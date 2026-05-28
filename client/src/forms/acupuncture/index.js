import { PATIENT_INFO_FORM } from '../common/patientInfo'
import { HIPAA_FORM } from '../common/hipaa'
import { FINANCIAL_POLICY_FORM } from '../common/financialPolicy'
import { ASSIGNMENT_OF_BENEFITS_FORM } from '../common/assignmentOfBenefits'
import { ARBITRATION_FORM } from '../common/arbitration'
import { ACUPUNCTURE_CONSENT_FORM } from './acupunctureConsent'
import { HEALTH_HISTORY_FORM } from './healthHistory'
import { REVIEW_OF_SYSTEMS_FORM } from './reviewOfSystems'
import { t } from '../../i18n/translations'
import { ACUPUNCTURE_CONSENT_CONTENT, REVIEW_OF_SYSTEMS_CONTENT } from '../../i18n/formContent'

// Map of field ID → translation key in formCheckboxes
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

  const sections = form.sections.map((section) => {
    const sectionTitle = translateSectionTitle(section.title, tr)
    const sectionFields = section.fields?.map((field) => translateField(form.id, field, tr)) || []
    return { ...section, title: sectionTitle, fields: sectionFields }
  })
  return { ...form, title, signatureLabel, fields, sections }
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

function buildAcupunctureConsent(lang) {
  const c = ACUPUNCTURE_CONSENT_CONTENT[lang] || ACUPUNCTURE_CONSENT_CONTENT.en
  return {
    ...ACUPUNCTURE_CONSENT_FORM,
    title: c.title,
    signatureLabel: c.signatureLabel,
    sections: [{ title: '', content: c.content }],
    fields: [
      {
        id: 'isPregnant',
        label: c.isPregnantLabel,
        type: 'radio',
        options: c.isPregnantOptions,
        required: true,
      },
      {
        id: 'acuConsentUnderstood',
        label: c.understoodLabel,
        type: 'checkbox',
        required: true,
      },
    ],
  }
}

function buildReviewOfSystems(lang) {
  const c = REVIEW_OF_SYSTEMS_CONTENT[lang] || REVIEW_OF_SYSTEMS_CONTENT.en
  const enSectionKeys = Object.keys(REVIEW_OF_SYSTEMS_CONTENT.en.sections)
  const trSectionKeys = Object.keys(c.sections)

  const sections = REVIEW_OF_SYSTEMS_FORM.sections.map((section) => {
    // Match by index to map English section title → translated title + options
    const enIdx = enSectionKeys.indexOf(section.title)
    if (enIdx === -1) {
      // Additional Notes section — translate label only
      if (section.title === 'Additional Notes') {
        const addLabel = lang === 'ko' ? '추가 사항' : lang === 'es' ? 'Notas Adicionales' : 'Additional Notes'
        const placeholder = lang === 'ko' ? '추가적인 건강 우려사항이나 정보를 입력해주세요...' : lang === 'es' ? 'Cualquier información adicional de salud...' : 'Any additional health concerns or information...'
        const fieldLabel = lang === 'ko' ? '담당 의사에게 알리고 싶은 사항이 있나요?' : lang === 'es' ? '¿Hay algo más que le gustaría que su médico supiera?' : 'Is there anything else you would like your practitioner to know?'
        return {
          ...section,
          title: addLabel,
          fields: section.fields.map(f => ({ ...f, label: fieldLabel, placeholder })),
        }
      }
      return section
    }
    const trTitle = trSectionKeys[enIdx]
    const trOptions = c.sections[trTitle]
    return {
      ...section,
      title: trTitle,
      fields: section.fields.map(f => ({
        ...f,
        options: trOptions || f.options,
      })),
    }
  })

  return {
    ...REVIEW_OF_SYSTEMS_FORM,
    title: (t[lang] || t.en).formTitles?.review_of_systems || REVIEW_OF_SYSTEMS_FORM.title,
    intro: c.intro,
    sections,
  }
}

export function getAcupunctureForms(clinicInfo = {}, lang = 'en') {
  const tr = t[lang] || t.en

  return [
    translateForm(PATIENT_INFO_FORM, tr),
    buildAcupunctureConsent(lang),
    translateForm(HEALTH_HISTORY_FORM, tr),
    buildReviewOfSystems(lang),
    translateForm(HIPAA_FORM, tr),
    translateForm({
      ...FINANCIAL_POLICY_FORM,
      content: FINANCIAL_POLICY_FORM.getText(clinicInfo),
    }, tr),
    translateForm(ASSIGNMENT_OF_BENEFITS_FORM, tr),
    translateForm(ARBITRATION_FORM, tr),
  ]
}
