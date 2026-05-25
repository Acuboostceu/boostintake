import { PATIENT_INFO_FORM } from '../common/patientInfo'
import { HIPAA_FORM } from '../common/hipaa'
import { FINANCIAL_POLICY_FORM } from '../common/financialPolicy'
import { ASSIGNMENT_OF_BENEFITS_FORM } from '../common/assignmentOfBenefits'
import { ARBITRATION_FORM } from '../common/arbitration'
import { ACUPUNCTURE_CONSENT_FORM } from './acupunctureConsent'
import { HEALTH_HISTORY_FORM } from './healthHistory'
import { REVIEW_OF_SYSTEMS_FORM } from './reviewOfSystems'

export function getAcupunctureForms(clinicInfo = {}) {
  return [
    PATIENT_INFO_FORM,
    ACUPUNCTURE_CONSENT_FORM,
    HEALTH_HISTORY_FORM,
    REVIEW_OF_SYSTEMS_FORM,
    HIPAA_FORM,
    {
      ...FINANCIAL_POLICY_FORM,
      // Inject clinic-specific text at runtime
      content: FINANCIAL_POLICY_FORM.getText(clinicInfo),
    },
    ASSIGNMENT_OF_BENEFITS_FORM,
    ARBITRATION_FORM,
  ]
}
