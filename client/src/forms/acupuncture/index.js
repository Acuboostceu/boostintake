import { PATIENT_INFO_FORM } from '../common/patientInfo'
import { HIPAA_FORM } from '../common/hipaa'
import { FINANCIAL_POLICY_FORM } from '../common/financialPolicy'
import { ASSIGNMENT_OF_BENEFITS_FORM } from '../common/assignmentOfBenefits'
import { ARBITRATION_FORM } from '../common/arbitration'
import { ACUPUNCTURE_CONSENT_FORM } from './acupunctureConsent'
import { HEALTH_HISTORY_FORM } from './healthHistory'
import { REVIEW_OF_SYSTEMS_FORM } from './reviewOfSystems'
import { t } from '../../i18n/translations'

function translateForm(form, tr) {
  if (!tr) return form
  const title = tr.formTitles?.[form.id] || form.title
  if (!form.sections) return { ...form, title }

  const sections = form.sections.map((section) => {
    const sectionTitle = translateSectionTitle(section.title, tr)
    const fields = section.fields?.map((field) => translateField(form.id, field, tr)) || []
    return { ...section, title: sectionTitle, fields }
  })
  return { ...form, title, sections }
}

function translateSectionTitle(title, tr) {
  const map = {
    'Personal Information': tr.sections?.personal,
    'Address': tr.sections?.address,
    'Emergency Contact': tr.sections?.emergency,
    'Insurance Information': tr.sections?.insurance,
    'How did you hear about us?': tr.sections?.referral,
    'Chief Complaint': tr.sections?.chiefComplaint,
    'Medical History': tr.sections?.medicalHistory,
    'Lifestyle': tr.sections?.lifestyle,
    "Women's Health (if applicable)": tr.sections?.womensHealth,
  }
  return map[title] || title
}

function translateField(formId, field, tr) {
  let fieldTr = null
  if (formId === 'patient_info') fieldTr = tr.patientInfo
  if (formId === 'health_history') fieldTr = tr.healthHistory

  if (!fieldTr) return field

  const label = fieldTr[field.id] || field.label
  let options = field.options

  // Translate options arrays
  const optionMap = {
    patient_info: {
      gender: fieldTr.genderOptions,
      referral: fieldTr.referralOptions,
      hasInsurance: fieldTr.yesNo,
    },
    health_history: {
      symptomDescription: fieldTr.symptomOptions,
      exerciseFrequency: fieldTr.exerciseOptions,
      sleepHours: fieldTr.sleepHourOptions,
      sleepQuality: fieldTr.sleepQualityOptions,
      stressLevel: fieldTr.stressOptions,
      diet: fieldTr.dietOptions,
      smoking: fieldTr.smokingOptions,
      alcohol: fieldTr.alcoholOptions,
      cycleRegularity: fieldTr.cycleOptions,
      previousAcupuncture: fieldTr.yesNo,
      medicalConditions: fieldTr.medicalConditionOptions,
    },
  }

  if (optionMap[formId]?.[field.id]) {
    options = optionMap[formId][field.id]
  }

  return { ...field, label, options }
}

export function getAcupunctureForms(clinicInfo = {}, lang = 'en') {
  const tr = t[lang] || t.en

  return [
    translateForm(PATIENT_INFO_FORM, tr),
    translateForm(ACUPUNCTURE_CONSENT_FORM, tr),
    translateForm(HEALTH_HISTORY_FORM, tr),
    translateForm(REVIEW_OF_SYSTEMS_FORM, tr),
    translateForm(HIPAA_FORM, tr),
    translateForm({
      ...FINANCIAL_POLICY_FORM,
      content: FINANCIAL_POLICY_FORM.getText(clinicInfo),
    }, tr),
    translateForm(ASSIGNMENT_OF_BENEFITS_FORM, tr),
    translateForm(ARBITRATION_FORM, tr),
  ]
}
