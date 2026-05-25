export const ASSIGNMENT_OF_BENEFITS_FORM = {
  id: 'assignment_of_benefits',
  title: 'Assignment of Benefits',
  requiresSignature: true,
  signatureLabel: 'Assignment of Benefits',
  getText: ({ clinicName = 'this clinic' }) => `
I hereby authorize and request my insurance company to pay directly to **${clinicName}** the insurance benefits otherwise payable to me for services rendered. I understand that I am financially responsible for all charges whether or not paid by insurance.

I also authorize the release of any medical or other information necessary to process insurance claims. I authorize the use of this signature on all insurance submissions.

A photocopy of this authorization shall be considered as effective and valid as the original.
`,
  fields: [
    {
      id: 'aobAgreement',
      label: 'I authorize assignment of benefits directly to this clinic.',
      type: 'checkbox',
      required: true,
    },
  ],
}
