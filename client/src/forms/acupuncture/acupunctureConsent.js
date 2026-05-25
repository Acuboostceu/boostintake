export const ACUPUNCTURE_CONSENT_FORM = {
  id: 'acupuncture_consent',
  title: 'Acupuncture Informed Consent',
  requiresSignature: true,
  signatureLabel: 'Acupuncture Informed Consent',
  sections: [
    {
      title: '',
      content: `I hereby request and consent to the performance of acupuncture treatment and other procedures within the scope of the practice of acupuncture on me (or on the patient named below, for whom I am legally responsible) by the acupuncturist and/or other licensed acupuncturists who now or in the future treat me while employed by, working or associated with or serving as back-up for this clinic, whether signatories to this form or not.

I understand that methods of treatment may include, but are not limited to, acupuncture, moxibustion, cupping, electrical stimulation, Tui-Na (Chinese massage), Chinese herbal medicine, and nutritional counseling. I understand that herbs may need to be prepared and consumed according to instructions provided orally and in writing. The herbs may have an unpleasant smell or taste. I will immediately notify a member of the clinical staff of any unanticipated or unpleasant effects associated with the consumption of herbs.

I have been informed that acupuncture is a generally safe method of treatment, but that it may have some side effects, including bruising, numbness or tingling near the needling sites that may last a few days, and dizziness or fainting. Burns and/or scarring are a potential risk of moxibustion and cupping, or when treatment involves the use of heat lamps. Bruising is a common side effect of cupping. Unusual risks of acupuncture include spontaneous miscarriage, nerve damage and organ puncture, including lung puncture (pneumothorax). Infection is another possible risk, although the clinic uses sterile disposable needles and maintains a clean and safe environment.

I understand that while this document describes the major risks of treatment, other side effects and risks may occur. The herbs and nutritional supplements (which are from plant, animal and mineral sources) that have been recommended are traditionally considered safe in the practice of Chinese Medicine, although some may be toxic in large doses. I understand that some herbs may be inappropriate during pregnancy. Some possible side effects of taking herbs are nausea, gas, stomachache, vomiting, headache, diarrhea, rashes, hives, and tingling of the tongue. I will notify a clinical staff member if I am or become pregnant.

I do not expect the clinical staff to be able to anticipate and explain all possible risks and complications of treatment, and I wish to rely on the clinical staff to exercise judgment during the course of treatment which the clinical staff thinks, based upon the facts then known, is in my best interest. I understand that results are not guaranteed.

I understand the clinical and administrative staff may review my patient records and lab reports, but all my records will be kept confidential and will not be released without my written consent.

By voluntarily signing below, I show that I have read, or have had read to me, the above consent to treatment, have been told about the risks and benefits of acupuncture and other procedures, and have had an opportunity to ask questions. I intend this consent form to cover the entire course of treatment for my present condition and for any future condition(s) for which I seek treatment.`,
    },
  ],
  fields: [
    {
      id: 'isPregnant',
      label: 'Are you currently pregnant or trying to become pregnant?',
      type: 'radio',
      options: ['Yes', 'No', 'Not applicable'],
      required: true,
    },
    {
      id: 'acuConsentUnderstood',
      label: 'I have read and understand the above consent, and voluntarily agree to the proposed treatment.',
      type: 'checkbox',
      required: true,
    },
  ],
}
