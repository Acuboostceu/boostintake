export const HIPAA_FORM = {
  id: 'hipaa',
  title: 'HIPAA Notice of Privacy Practices',
  requiresSignature: true,
  signatureLabel: 'Acknowledgment of Receipt — Notice of Privacy Practices',
  sections: [
    {
      title: '',
      content: `THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.

We are required by law to maintain the privacy of your protected health information (PHI), to provide you with notice of our legal duties and privacy practices with respect to PHI, and to notify you following a breach of unsecured PHI. We are required to abide by the terms of this Notice while it is in effect.`,
    },
    {
      title: 'I. Uses and Disclosures of Protected Health Information',
      content: `We use and disclose health information about you for treatment, payment, and healthcare operations:

**Treatment:** We may use or disclose your PHI to provide, coordinate, or manage your health care and related services. For example, we may disclose your PHI to other healthcare providers involved in your care, such as specialists, physical therapists, or hospitals.

**Payment:** We may use or disclose your PHI to obtain payment for services we provide to you. For example, we may send claims to your health insurance company or Medicare/Medicaid that include information about your diagnosis and treatment.

**Healthcare Operations:** We may use or disclose your PHI for our practice's business operations. This includes quality assessment, employee training, licensing, auditing, and certain research activities.

**Appointment Reminders:** We may contact you by phone, text, or mail to remind you of scheduled appointments or to follow up on care.

**Treatment Alternatives:** We may use your PHI to tell you about possible treatment options or alternatives that may be of interest to you.`,
    },
    {
      title: 'II. Other Permitted Uses and Disclosures',
      content: `We may use or disclose your PHI without your authorization in certain situations required or permitted by law, including:

• **As Required by Law:** We will disclose your PHI when required by federal, state, or local law.

• **Public Health Activities:** To authorized public health agencies to prevent or control disease, injury, or disability; to report births or deaths; to report suspected abuse, neglect, or domestic violence.

• **Health Oversight Activities:** To government agencies for oversight activities such as audits, investigations, and inspections.

• **Judicial and Administrative Proceedings:** In response to a court order, subpoena, or other lawful process.

• **Law Enforcement:** To law enforcement officials as required by law or in response to a valid legal process.

• **Serious Threats to Health or Safety:** To prevent or lessen a serious and imminent threat to the health or safety of a person or the public.

• **Workers' Compensation:** For workers' compensation or similar programs as authorized by law.

• **Coroners and Funeral Directors:** To a medical examiner, coroner, or funeral director as necessary.

• **Research:** Under certain conditions with appropriate safeguards in place.`,
    },
    {
      title: 'III. Uses and Disclosures Requiring Your Authorization',
      content: `Other uses and disclosures of your PHI not covered by this Notice will be made only with your written authorization. You may revoke your authorization in writing at any time, except to the extent that we have already taken action in reliance upon it. Uses and disclosures requiring your authorization include:

• Most uses and disclosures of psychotherapy notes
• Uses and disclosures for marketing purposes
• Sale of your PHI`,
    },
    {
      title: 'IV. Your Rights Regarding Your Health Information',
      content: `**Right to Inspect and Copy:** You have the right to inspect and copy your PHI that we maintain, with limited exceptions. To do so, submit a written request. We may charge a reasonable fee for copies.

**Right to an Electronic Copy:** If your PHI is maintained electronically, you may request an electronic copy of such information.

**Right to Amend:** If you believe your PHI is incorrect or incomplete, you may request that we amend it. We may deny your request under certain circumstances.

**Right to an Accounting of Disclosures:** You have the right to request a list of disclosures we have made of your PHI, other than for treatment, payment, healthcare operations, and certain other disclosures. The first list each year is free; we may charge for additional lists.

**Right to Request Restrictions:** You have the right to request that we restrict certain uses and disclosures of your PHI. We are not required to agree to the restriction unless it involves a disclosure to a health plan for payment or healthcare operations and the PHI pertains solely to a healthcare item for which you have paid out of pocket in full.

**Right to Confidential Communications:** You may request that we communicate with you about health matters in a certain way or at a certain location. For example, you may request that we only contact you at a specific phone number or address. We will accommodate reasonable requests.

**Right to a Paper Copy of This Notice:** You have the right to receive a paper copy of this Notice at any time, even if you have agreed to receive the Notice electronically. You may obtain a copy at our front desk.

**Right to Notification of a Breach:** You have the right to be notified if there is a breach of your unsecured PHI.`,
    },
    {
      title: 'V. Changes to This Notice',
      content: `We reserve the right to change this Notice and to make the new Notice effective for all PHI we maintain. If we make material changes, we will post the revised Notice in our office and on our website (if applicable). You may obtain a copy of the current Notice at any time by contacting our office.`,
    },
    {
      title: 'VI. Complaints',
      content: `If you believe we have violated your privacy rights, you may file a complaint with:

**Our Privacy Officer:** Contact our office directly to file a complaint. We will not retaliate against you for filing a complaint.

**U.S. Department of Health & Human Services:** Office for Civil Rights
200 Independence Avenue, S.W., Washington, D.C. 20201
Toll-free: 1-877-696-6775 | ocr.hhs.gov

You will not be penalized or retaliated against in any way for filing a complaint.`,
    },
  ],
  fields: [
    {
      id: 'hipaaAcknowledge',
      label: 'I acknowledge that I have received and had the opportunity to review the Notice of Privacy Practices.',
      type: 'checkbox',
      required: true,
    },
  ],
}
