// cancelHours, noShowFee, checkFee are injected from clinic settings at runtime
export const FINANCIAL_POLICY_FORM = {
  id: 'financial_policy',
  title: 'Financial Policy',
  requiresSignature: true,
  signatureLabel: 'Financial Policy Agreement',
  getText: ({ clinicName = 'our clinic', cancelHours = 24, noShowFee = 50, checkFee = 35 }) => `
**Payment is due at the time of service.** We accept cash, check, and all major credit cards. If you have insurance, we will bill your insurance as a courtesy; however, you are ultimately responsible for any amounts not covered.

**Cancellation Policy**
We require at least **${cancelHours} hours' notice** for cancellations or rescheduling. Cancellations made with less than ${cancelHours} hours' notice, or no-shows, will be charged a fee of **$${noShowFee}**.

This fee is not billable to insurance and must be paid before your next appointment.

**Returned Checks**
A **$${checkFee}** fee will be charged for any returned checks. After a returned check, all future payments must be made by cash or credit card.

**Insurance**
It is your responsibility to provide us with accurate and up-to-date insurance information. You are responsible for all co-pays, co-insurance, and deductibles at the time of service. If your insurance denies a claim, you are responsible for the full balance.

**Collection Policy**
Unpaid balances may be sent to a collection agency. You will be responsible for any collection fees incurred.

By signing below, I agree to the Financial Policy of **${clinicName}**.
`,
  fields: [
    {
      id: 'financialAgreement',
      label: 'I have read and agree to the Financial Policy.',
      type: 'checkbox',
      required: true,
    },
  ],
}
