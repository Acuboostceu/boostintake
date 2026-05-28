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
} from '../../i18n/formContent'

const CHECKBOX_LABEL_MAP = {
  hipaaAcknowledge: 'hipaaAcknowledge',
  financialAgreement: 'financialAgree',
  aobAgreement: 'aobAuthorize',
  arbitrationConsent: 'arbitrationAgree',
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

export function getChiropracticForms(clinicInfo = {}, lang = 'en') {
  return [
    translatePatientInfo(lang),
    CHIROPRACTIC_CONSENT_FORM,
    CHIRO_HISTORY_FORM,
    CHIRO_PAIN_DIAGRAM_FORM,
    buildHipaaForm(lang),
    buildFinancialPolicyForm(clinicInfo, lang),
    buildAOBForm(clinicInfo, lang),
    buildArbitrationForm(lang),
  ]
}
