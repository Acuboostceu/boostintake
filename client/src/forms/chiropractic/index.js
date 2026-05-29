import { PATIENT_INFO_FORM } from '../common/patientInfo'
import { HIPAA_FORM } from '../common/hipaa'
import { FINANCIAL_POLICY_FORM } from '../common/financialPolicy'
import { ASSIGNMENT_OF_BENEFITS_FORM } from '../common/assignmentOfBenefits'
import { ARBITRATION_FORM } from '../common/arbitration'
import { CHIROPRACTIC_CONSENT_FORM } from './chiropracticConsent'
import { CHIRO_HISTORY_FORM } from './chiroHistory'
import { CHIRO_PAIN_DIAGRAM_FORM } from './chiroPainDiagram'
import { t } from '../../i18n/translations'
import {
  HIPAA_CONTENT,
  FINANCIAL_POLICY_CONTENT,
  AOB_CONTENT,
  ARBITRATION_CONTENT,
  CHIRO_CONSENT_CONTENT,
} from '../../i18n/formContent'

const CHECKBOX_LABEL_MAP = {
  hipaaAcknowledge: 'hipaaAcknowledge',
  financialAgreement: 'financialAgree',
  aobAgreement: 'aobAuthorize',
  arbitrationConsent: 'arbitrationAgree',
  chiroConsentUnderstood: 'chiroConsentUnderstood',
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

function buildHipaaForm(lang) {
  const c = HIPAA_CONTENT[lang]
  if (!c) return HIPAA_FORM
  const tr = t[lang] || t.en
  return translateForm({ ...HIPAA_FORM, sections: c.sections }, tr)
}

function buildFinancialPolicyForm(clinicInfo, lang) {
  const getTextFn = FINANCIAL_POLICY_CONTENT[lang] || FINANCIAL_POLICY_CONTENT.en
  const tr = t[lang] || t.en
  return translateForm({ ...FINANCIAL_POLICY_FORM, content: getTextFn(clinicInfo) }, tr)
}

function buildAOBForm(clinicInfo, lang) {
  const getTextFn = AOB_CONTENT[lang] || AOB_CONTENT.en
  const tr = t[lang] || t.en
  return translateForm({ ...ASSIGNMENT_OF_BENEFITS_FORM, content: getTextFn(clinicInfo) }, tr)
}

function buildArbitrationForm(lang) {
  const content = ARBITRATION_CONTENT[lang]
  const tr = t[lang] || t.en
  return translateForm({ ...ARBITRATION_FORM, content: content || ARBITRATION_FORM.content }, tr)
}

function translatePatientInfo(lang) {
  const tr = t[lang] || t.en
  return translateForm(PATIENT_INFO_FORM, tr)
}

function buildChiroConsent(lang) {
  const tr = t[lang] || t.en
  const c = CHIRO_CONSENT_CONTENT[lang]

  // For English (or if no translated content), translate only title/label/checkbox
  if (!c) {
    return translateForm(CHIROPRACTIC_CONSENT_FORM, tr)
  }

  // For KO/ES: replace sections with translated content, translate title/labels
  return translateForm(
    {
      ...CHIROPRACTIC_CONSENT_FORM,
      sections: c.sections,
    },
    tr
  )
}

function buildChiroHistory(lang) {
  const tr = t[lang] || t.en
  const chTr = tr.chiroHistory || {}

  if (lang === 'en' || !Object.keys(chTr).length) {
    return translateForm(CHIRO_HISTORY_FORM, tr)
  }

  // Map of field id → translated option array key in chTr
  const optionMap = {
    mechanismOfInjury: chTr.mechanismOptions,
    painPattern: chTr.painPatternOptions,
    painQuality: chTr.painQualityOptions,
    radiating: chTr.yesNo,
    aggravatingFactors: chTr.aggravatingOptions,
    relievingFactors: chTr.relievingOptions,
    activitiesAffected: chTr.activitiesOptions,
    workStatus: chTr.workStatusOptions,
    previousTreatments: chTr.treatmentOptions,
    imagingDone: chTr.imagingOptions,
    previousChiropractic: chTr.yesNo,
    medicalConditions: chTr.medicalConditionOptions,
  }

  const sections = CHIRO_HISTORY_FORM.sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      const label = chTr[field.id] || field.label
      const options = optionMap[field.id] || field.options
      return { ...field, label, englishOptions: field.options, options }
    }),
  }))

  return translateForm({ ...CHIRO_HISTORY_FORM, sections }, tr)
}

function buildChiroPainDiagram(lang) {
  const tr = t[lang] || t.en
  const pdTr = tr.chiroPainDiagram || {}

  if (lang === 'en' || !Object.keys(pdTr).length) {
    return translateForm(CHIRO_PAIN_DIAGRAM_FORM, tr)
  }

  const optionMap = {
    painRegions: pdTr.painRegionOptions,
    symptomTypes: pdTr.symptomTypeOptions,
    worstTimeOfDay: pdTr.worstTimeOptions,
  }

  const sections = CHIRO_PAIN_DIAGRAM_FORM.sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      const label = pdTr[field.id] || field.label
      const options = optionMap[field.id] || field.options
      return { ...field, label, englishOptions: field.options, options }
    }),
  }))

  return translateForm({ ...CHIRO_PAIN_DIAGRAM_FORM, sections }, tr)
}

export function getChiropracticForms(clinicInfo = {}, lang = 'en') {
  return [
    translatePatientInfo(lang),
    buildChiroConsent(lang),
    buildChiroHistory(lang),
    buildChiroPainDiagram(lang),
    buildHipaaForm(lang),
    buildFinancialPolicyForm(clinicInfo, lang),
    buildAOBForm(clinicInfo, lang),
    buildArbitrationForm(lang),
  ]
}
