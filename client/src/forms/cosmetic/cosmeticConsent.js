export const COSMETIC_CONSENT_FORM = {
  id: 'cosmetic_consent',
  title: 'Cosmetic Acupuncture Informed Consent',
  requiresSignature: true,
  signatureLabel: 'By signing below, I confirm that I have read and understood this consent form.',
  sections: [
    {
      title: '',
      content: `Cosmetic Acupuncture involves the insertion of fine needles into specific points on the face and body. Please read this consent carefully before your treatment.

**Informed Consent for Cosmetic Acupuncture**

Cosmetic acupuncture involves the insertion of sterile, single-use disposable needles into particular points on the face and body. There are some risks to treatment, including: bruising of the skin, slight bleeding, temporary redness or swelling, weakness, fainting, and/or the temporary aggravation of existing conditions. While bruising is uncommon, it is a known risk with facial treatments. There is little to no risk of infection when sterile, disposable needles are used.

Glow Wellness Acupuncture & Eastern Medicine does not provide primary care or Western (allopathic) medical care. Please see your medical doctor for those services and routine check-ups.

If you are pregnant, have a bleeding disorder, pacemaker, high blood pressure, active infection, or take anticoagulant medications (e.g., Warfarin, aspirin), please inform your acupuncturist before treatment begins.

**Results**

While cosmetic acupuncture has been shown to improve skin tone, firmness, and the appearance of fine lines, results vary by individual. This treatment is not a surgical procedure and cannot be compared to a surgical facelift. We make no guarantee of specific outcomes.

**Microneedling — Collagen Induction Therapy**

Microneedling creates controlled micro-injuries in the skin to stimulate collagen production. Side effects typically include: temporary redness, warmth, tightness, minor flaking or dryness, pinpoint bleeding, and in rare cases bruising or swelling. Symptoms generally subside within 12–48 hours.

Absolute contraindications for microneedling: Accutane within 6 months, scleroderma, collagen vascular disease, active bacterial or fungal infection, blood clotting disorders, pregnancy or nursing, facial cancer, chemotherapy, dermatological diseases affecting the face, immune suppression, scars less than 6 months old, or Botox/fillers within the past 2–4 weeks.

Precautions: keloid or raised scarring, eczema, psoriasis, actinic keratosis, herpes simplex (cold sores).

**Privacy**

In accordance with HIPAA, Glow Wellness Acupuncture & Eastern Medicine protects your personal and health information and does not disclose it to third parties without your consent.`,
    },
  ],
  fields: [
    {
      id: 'cosmeticConsentUnderstood',
      label: 'I have read and understand the information above, including the risks and limitations of cosmetic acupuncture and microneedling.',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'cosmeticConsentVoluntary',
      label: 'I am undergoing treatment of my own free will and agree that this procedure is being performed for cosmetic purposes.',
      type: 'checkbox',
      required: true,
    },
  ],
}
