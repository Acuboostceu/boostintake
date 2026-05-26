const PDFDocument = require('pdfkit')

const TEAL = '#2563EB'
const DARK = '#1F2937'
const GRAY = '#6B7280'
const PAGE_MARGIN = 36
const PAGE_WIDTH = 595

const SHOW_BLANK_FIELDS = new Set(['patient_info', 'health_history', 'review_of_systems'])

async function generatePDF({ patient, formData, signatures, declinedForms, clinic, formContents, formFields }) {
  console.log('[PDF] formContents keys:', Object.keys(formContents || {}))
  console.log('[PDF] formData keys:', Object.keys(formData || {}))
  console.log('[PDF] signatures keys:', Object.keys(signatures || {}))
  return new Promise((resolve, reject) => {
    const chunks = []
    const doc = new PDFDocument({ margin: PAGE_MARGIN, size: 'A4', autoFirstPage: true })

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const contentWidth = PAGE_WIDTH - PAGE_MARGIN * 2

    // Ordered form list
    const FORM_ORDER = [
      'patient_info',
      'acupuncture_consent',
      'health_history',
      'review_of_systems',
      'hipaa',
      'financial_policy',
      'assignment_of_benefits',
      'arbitration',
    ]

    const allIds = new Set([
      ...FORM_ORDER,
      ...Object.keys(formData || {}),
      ...Object.keys(signatures || {}),
      ...Object.keys(declinedForms || {}),
    ])

    const formIds = FORM_ORDER.filter((id) => allIds.has(id))

    // Forms to combine on one page (no page break between them)
    const COMBINE_WITH_PREV = new Set(['assignment_of_benefits'])

    let firstPage = true

    for (const formId of formIds) {
      const sig = signatures?.[formId]
      const declined = declinedForms?.[formId]

      if (!formData?.[formId] && !sig && !declined) continue

      if (firstPage) {
        firstPage = false
      } else if (COMBINE_WITH_PREV.has(formId)) {
        doc.moveDown(0.8)
        drawDivider(doc, contentWidth)
        doc.moveDown(0.5)
      } else {
        doc.addPage()
      }

      // ── Header ───────────────────────────────────────────────────
      drawHeader(doc, clinic, contentWidth, patient)
      doc.moveDown(0.5)
      drawDivider(doc, contentWidth)
      doc.moveDown(0.5)

      // ── Form title ───────────────────────────────────────────────
      doc.fontSize(13).font('Helvetica-Bold').fillColor(TEAL).text(getFormTitle(formId), { width: contentWidth })
      doc.moveDown(0.4)

      // ── Form content text ────────────────────────────────────────
      const contentText = formContents?.[formId]
      if (contentText) {
        const plain = contentText.replace(/\*\*/g, '')
        const paragraphs = plain.split(/\n\n+/)
        const isHipaa = formId === 'hipaa'
        const isCompact = isHipaa || formId === 'arbitration'
        const fontSize = isHipaa ? 7 : isCompact ? 8 : 8.5
        const lineGap = isCompact ? 0.3 : 1
        const paraGap = isCompact ? 0.1 : 0.25
        doc.fontSize(fontSize).fillColor(DARK)
        for (const para of paragraphs) {
          const trimmed = para.trim()
          if (!trimmed) continue
          const isHeader = trimmed.length < 60 && !trimmed.endsWith('.') && !trimmed.startsWith('•')
          doc
            .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
            .text(trimmed, { lineGap, width: contentWidth, align: isHeader ? 'left' : 'justify' })
          doc.moveDown(paraGap)
        }
        doc.moveDown(0.3)
        drawDivider(doc, contentWidth)
        doc.moveDown(0.4)
      }

      // ── Fields ───────────────────────────────────────────────────
      const showBlanks = SHOW_BLANK_FIELDS.has(formId)
      const fieldDefs = formFields?.[formId] || []
      const data = formData?.[formId] || {}

      if (showBlanks && fieldDefs.length > 0) {
        // Render all fields in order, blank line for empty ones
        for (const field of fieldDefs) {
          const value = data[field.id]
          const label = field.label || camelToLabel(field.id)
          const isEmpty = value === null || value === undefined || value === '' ||
            (Array.isArray(value) && value.length === 0)

          doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text(label.toUpperCase())

          if (isEmpty) {
            // Draw blank underline
            const y = doc.y + 2
            doc.moveTo(PAGE_MARGIN, y).lineTo(PAGE_MARGIN + 200, y)
              .strokeColor('#9CA3AF').lineWidth(0.5).stroke()
            doc.moveDown(0.9)
          } else {
            let display
            if (typeof value === 'boolean') display = value ? '✓ Yes' : 'No'
            else if (Array.isArray(value)) display = value.join(', ')
            else display = String(value)
            doc.fontSize(10).font('Helvetica').fillColor(DARK).text(display).moveDown(0.35)
          }
        }
      } else if (Object.keys(data).length > 0) {
        // Consent/other forms: only show filled fields
        for (const [key, value] of Object.entries(data)) {
          if (value === null || value === undefined || value === '' ||
            (Array.isArray(value) && value.length === 0)) continue

          const label = camelToLabel(key)
          let display
          if (typeof value === 'boolean') display = value ? '✓ Acknowledged' : '—'
          else if (Array.isArray(value)) display = value.join(', ')
          else display = String(value)

          doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text(label.toUpperCase())
          doc.fontSize(10).font('Helvetica').fillColor(DARK).text(display).moveDown(0.35)
        }
      }

      // ── Signature ────────────────────────────────────────────────
      if (sig) {
        doc.moveDown(0.3)
        drawDivider(doc, contentWidth)
        doc.moveDown(0.3)

        doc.fontSize(8).font('Helvetica-Bold').fillColor(GRAY).text('PATIENT SIGNATURE')
        doc.moveDown(0.2)

        try {
          const imgBuffer = Buffer.from(sig.split(',')[1], 'base64')
          doc.image(imgBuffer, { width: 200, height: 60 })
        } catch {}

        doc.moveDown(0.2)
        doc.fontSize(9).font('Helvetica').fillColor(GRAY)
          .text(`Signed by: ${patient.name}`)
          .text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`)

      } else if (declined) {
        doc.moveDown(0.3)
        drawDivider(doc, contentWidth)
        doc.moveDown(0.3)
        doc.fontSize(10).font('Helvetica-Oblique').fillColor(GRAY)
          .text('Patient declined to sign this form.')
      }
    }

    doc.end()
  })
}

function drawHeader(doc, clinic, contentWidth, patient) {
  doc.fontSize(16).font('Helvetica-Bold').fillColor(TEAL).text(clinic?.name || 'BoostIntake Clinic', { width: contentWidth })

  let subLine = ''
  if (clinic?.address) subLine += clinic.address
  if (clinic?.phone) subLine += (subLine ? ' · ' : '') + clinic.phone
  if (subLine) doc.fontSize(9).font('Helvetica').fillColor(GRAY).text(subLine, { width: contentWidth })
}

function drawDivider(doc, contentWidth) {
  const y = doc.y
  doc.moveTo(PAGE_MARGIN, y).lineTo(PAGE_MARGIN + contentWidth, y)
    .strokeColor('#E5E7EB').lineWidth(0.5).stroke()
  doc.moveDown(0.3)
}

function formatDob(raw) {
  if (!raw) return ''
  // MM/DD/YYYY (tablet)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) return raw
  // YYYY-MM-DD (SMS link)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split('-')
    return `${m}/${d}/${y}`
  }
  return raw
}

function camelToLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
}

function getFormTitle(formId) {
  const titles = {
    patient_info: 'Patient Information',
    hipaa: 'HIPAA Notice of Privacy Practices',
    financial_policy: 'Financial Policy',
    assignment_of_benefits: 'Assignment of Benefits',
    arbitration: 'Arbitration Agreement',
    acupuncture_consent: 'Acupuncture Informed Consent',
    health_history: 'Health History & Chief Complaint',
    review_of_systems: 'Review of Systems',
  }
  return titles[formId] || formId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

module.exports = { generatePDF }
