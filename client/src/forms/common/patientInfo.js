export const PATIENT_INFO_FORM = {
  id: 'patient_info',
  title: 'Patient Information',
  requiresSignature: false,
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'First name' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Last name' },
        { id: 'dob', label: 'Date of Birth', type: 'masked-date', required: true },
        { id: 'gender', label: 'Gender', type: 'radio', required: true, options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '(555) 000-0000' },
        { id: 'email', label: 'Email Address', type: 'email', required: false, placeholder: 'email@example.com' },
      ],
    },
    {
      title: 'Address',
      fields: [
        { id: 'address', label: 'Street Address', type: 'text', required: true, placeholder: '123 Main St' },
        { id: 'city', label: 'City', type: 'text', required: true, placeholder: 'City' },
        { id: 'state', label: 'State', type: 'text', required: true, placeholder: 'CA' },
        { id: 'zip', label: 'ZIP Code', type: 'text', required: true, placeholder: '90210' },
      ],
    },
    {
      title: 'Emergency Contact',
      fields: [
        { id: 'emergencyName', label: 'Emergency Contact Name', type: 'text', required: false, placeholder: 'Full name' },
        { id: 'emergencyRelation', label: 'Relationship', type: 'text', required: false, placeholder: 'Spouse, Parent, etc.' },
        { id: 'emergencyPhone', label: 'Emergency Contact Phone', type: 'tel', required: false, placeholder: '(555) 000-0000' },
      ],
    },
    {
      title: 'Insurance Information',
      fields: [
        { id: 'hasInsurance', label: 'Do you have health insurance?', type: 'radio', required: false, options: ['Yes', 'No'] },
        { id: 'insuranceName', label: 'Insurance Company', type: 'text', required: false, placeholder: 'e.g., Blue Cross Blue Shield' },
        { id: 'insuranceId', label: 'Member ID', type: 'text', required: false, placeholder: 'Member ID number' },
        { id: 'insuranceGroup', label: 'Group Number', type: 'text', required: false, placeholder: 'Group number' },
      ],
    },
    {
      title: 'How did you hear about us?',
      fields: [
        { id: 'referral', label: 'Referral Source', type: 'radio', required: false, options: ['Google', 'Yelp', 'Friend/Family', 'Doctor Referral', 'Social Media', 'Other'] },
        { id: 'referralOther', label: 'If other, please specify', type: 'text', required: false, placeholder: 'Please specify' },
      ],
    },
  ],
}
