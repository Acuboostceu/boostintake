export const CHIROPRACTIC_CONSENT_FORM = {
  id: 'chiro_consent',
  title: 'Chiropractic Informed Consent',
  requiresSignature: true,
  signatureLabel: 'Chiropractic Informed Consent',
  sections: [
    {
      title: '',
      content: `I hereby request and consent to the performance of chiropractic treatment and related procedures by the chiropractor(s) and/or other licensed healthcare providers at this clinic, whether or not signatories to this form.

**Nature of Chiropractic Treatment**

I understand that chiropractic care may include spinal manipulation and mobilization, extremity adjustments, soft tissue therapies (massage, myofascial release, trigger point therapy), therapeutic exercise and stretching, physical modalities (ultrasound, electrical stimulation, heat/ice, traction), and lifestyle and nutritional counseling.

**Expected Benefits**

Chiropractic care is intended to reduce pain and discomfort, restore normal joint motion and function, improve posture and biomechanics, and support the body's natural healing processes. I understand that results are not guaranteed and that the number of treatments needed varies by individual.

**Risks and Possible Complications**

I understand that chiropractic treatment, like all healthcare procedures, carries some risk. Common temporary effects include muscle soreness or stiffness following treatment, which typically resolves within 24–48 hours. Less common risks include temporary increase in symptoms, headache, or fatigue.

Rare but serious risks include: aggravation or herniation of an intervertebral disc; fracture in individuals with osteoporosis or bone pathology; stroke or vertebrobasilar injury associated with cervical (neck) manipulation (estimated to occur in approximately 1 in several million cervical manipulations); and, in extremely rare cases, nerve damage or cauda equina syndrome.

I will inform my chiropractor of any known conditions such as osteoporosis, cancer, inflammatory arthritis, anticoagulant use, or recent trauma or surgery, as these may affect treatment safety and approach.

**Alternatives to Treatment**

I understand that alternatives to chiropractic care exist, including rest and activity modification, medication (over-the-counter or prescription), physical therapy, massage therapy, acupuncture, pain management injections, and surgery. I have had the opportunity to ask questions about these alternatives.

**Right to Withdraw Consent**

I understand that I may withdraw my consent and discontinue treatment at any time without affecting my right to future care. I have had the opportunity to ask questions, and my questions have been answered to my satisfaction.

By signing below, I acknowledge that I have read and understood the above information, that the risks and benefits of chiropractic treatment have been explained to me, and that I voluntarily consent to chiropractic care.`,
    },
  ],
  fields: [
    {
      id: 'chiroConsentUnderstood',
      label: 'I have read and understand the above consent, and voluntarily agree to receive chiropractic treatment.',
      type: 'checkbox',
      required: true,
    },
  ],
}
