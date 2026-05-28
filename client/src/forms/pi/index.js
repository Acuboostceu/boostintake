import { PI_AUTO_ACCIDENT_FORM } from './piAutoAccident'
import { PI_MEDICAL_LIEN_FORM } from './piMedicalLien'

export { PI_AUTO_ACCIDENT_FORM }
export { PI_MEDICAL_LIEN_FORM }
import { INFORMATION_RELEASE_FORM } from '../common/informationRelease'
import { t } from '../../i18n/translations'
import { PI_MEDICAL_LIEN_CONTENT, INFORMATION_RELEASE_CONTENT } from '../../i18n/formContent'

const CHECKBOX_LABEL_MAP = {
  liensUnderstood: 'liensUnderstood',
  releaseUnderstood: 'releaseUnderstood',
}

function translateTopLevelFields(fields, tr) {
  if (!fields) return fields
  return fields.map((field) => {
    const key = CHECKBOX_LABEL_MAP[field.id]
    if (key && tr.formCheckboxes?.[key]) {
      return { ...field, label: tr.formCheckboxes[key] }
    }
    return field
  })
}

function translateForm(form, tr) {
  if (!tr) return form
  const title = tr.formTitles?.[form.id] || form.title
  const signatureLabel = tr.signatureLabels?.[form.id] || form.signatureLabel
  const fields = translateTopLevelFields(form.fields, tr)
  if (!form.sections) return { ...form, title, signatureLabel, fields }
  const sections = form.sections.map((section) => ({ ...section }))
  return { ...form, title, signatureLabel, fields, sections }
}

function buildPIAutoAccident(lang) {
  const tr = t[lang] || t.en
  const piTr = tr.piAutoAccident || {}

  if (lang === 'en' || !Object.keys(piTr).length) {
    return translateForm(PI_AUTO_ACCIDENT_FORM, tr)
  }

  const optionMap = {
    vehicleType: piTr.vehicleTypeOptions,
    vehiclePosition: piTr.vehiclePositionOptions,
    seatbelt: piTr.yesNo,
    airbagDeployed: piTr.yesNoNA,
    impactDirection: piTr.impactOptions,
    vehicleDamage: piTr.damageOptions,
    leftScene: piTr.yesNo,
    erVisit: piTr.yesNo,
    policeReport: piTr.yesNoUnknown,
    symptomsImmediate: piTr.symptomOptions,
    symptomsDelayed: piTr.symptomOptions,
    attorneyRetained: piTr.yesNo,
    insuranceClaimFiled: piTr.yesNoInProgress,
    priorAccidents: piTr.yesNo,
    priorInjuryToSameArea: piTr.yesNo,
  }

  const sections = PI_AUTO_ACCIDENT_FORM.sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      const label = piTr[field.id] || field.label
      const options = optionMap[field.id] || field.options
      return { ...field, label, options }
    }),
  }))

  return translateForm({ ...PI_AUTO_ACCIDENT_FORM, sections }, tr)
}

function buildPIMedicalLien(lang) {
  const tr = t[lang] || t.en
  const content = PI_MEDICAL_LIEN_CONTENT[lang]
  if (!content) {
    return translateForm(PI_MEDICAL_LIEN_FORM, tr)
  }
  return translateForm({ ...PI_MEDICAL_LIEN_FORM, content }, tr)
}

function buildInformationRelease(lang) {
  const tr = t[lang] || t.en
  const c = INFORMATION_RELEASE_CONTENT[lang]
  const irTr = tr.informationRelease || {}

  if (!c) {
    return translateForm(INFORMATION_RELEASE_FORM, tr)
  }

  const optionMap = {
    releaseRecipients: irTr.recipientOptions,
  }

  const fields = (INFORMATION_RELEASE_FORM.fields || []).map((field) => {
    const label = irTr[field.id] || field.label
    const options = optionMap[field.id] || field.options
    return { ...field, label, options }
  })

  return translateForm(
    { ...INFORMATION_RELEASE_FORM, sections: c.sections, fields },
    tr
  )
}

export function getPIForms(lang = 'en') {
  return [
    buildPIAutoAccident(lang),
    buildPIMedicalLien(lang),
    buildInformationRelease(lang),
  ]
}
