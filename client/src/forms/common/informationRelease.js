export const INFORMATION_RELEASE_FORM = {
  id: 'information_release',
  title: 'Authorization to Release Medical Information',
  requiresSignature: true,
  signatureLabel: 'Authorization to Release Medical Information',
  sections: [
    {
      title: '',
      content: `I hereby authorize the release of my medical records, health information, and related documents to the parties indicated below, for the purposes described.

**Information to Be Released**

This authorization covers medical records, treatment notes, diagnostic reports, imaging results, billing records, and any other health information related to my care at this clinic.

**Purpose of Release**

The information may be released for the following purposes:
• Coordination of care with other treating healthcare providers
• Insurance claims processing and billing
• Legal proceedings related to my injury or condition (including personal injury claims)
• Workers' compensation claims
• Any other purpose I specify below

**Recipients**

I authorize release of my records to: my attorney(s), insurance company(ies), other treating physicians and healthcare providers, and any other parties directly involved in my care or legal representation.

**Patient Rights**

I understand that:
• I may revoke this authorization at any time by submitting a written request to this clinic.
• Revocation does not apply to information already released based on this authorization.
• My treatment is not conditioned on signing this authorization.
• Information disclosed under this authorization may be re-disclosed by the recipient and may no longer be protected by federal privacy regulations.
• This authorization will remain in effect for the duration of my treatment and legal proceedings, or until revoked in writing.`,
    },
  ],
  fields: [
    {
      id: 'releaseRecipients',
      label: 'Authorize release to (check all that apply):',
      type: 'multicheck',
      required: false,
      options: [
        'My attorney / law firm',
        'Insurance company (health)',
        'Insurance company (auto)',
        'Workers\' compensation carrier',
        'Other treating physicians / providers',
        'All of the above',
      ],
    },
    {
      id: 'additionalRecipients',
      label: 'Additional recipients or notes (optional)',
      type: 'text',
      required: false,
      placeholder: 'e.g., Dr. Smith at XYZ Medical, ABC Insurance claim #12345...',
    },
    {
      id: 'releaseUnderstood',
      label: 'I have read and understand this authorization and voluntarily consent to the release of my medical information as described above.',
      type: 'checkbox',
      required: true,
    },
  ],
}
