export const COSMETIC_PHOTO_RELEASE_FORM = {
  id: 'cosmetic_photo_release',
  title: 'Photo & Media Release',
  requiresSignature: true,
  signatureLabel: 'By signing below, I confirm my choices above and authorize use of my photos accordingly.',
  optional: true,
  sections: [
    {
      title: '',
      content: `Glow Wellness Acupuncture & Eastern Medicine may take before-and-after photographs during your cosmetic acupuncture treatments for clinical documentation. This form asks whether you also consent to those images being used for educational or promotional purposes.

Your clinical care is not affected by your choices below. You may withdraw this authorization at any time by notifying our office in writing.`,
    },
  ],
  fields: [
    {
      id: 'photoReleaseMarketing',
      label: 'I consent to my photos being used for marketing purposes (website, social media, printed materials).',
      type: 'checkbox',
      required: false,
    },
    {
      id: 'photoReleaseEducation',
      label: 'I consent to my photos being used for educational or training purposes (staff training, seminars, case studies).',
      type: 'checkbox',
      required: false,
    },
    {
      id: 'photoReleaseBlur',
      label: 'I require that identifying features (eyes, face outline) be blurred or obscured before any public use.',
      type: 'checkbox',
      required: false,
    },
    {
      id: 'photoReleaseName',
      label: 'If my name is referenced alongside my photos, I prefer:',
      type: 'radio',
      required: false,
      options: ['Full name', 'First name only', 'Initials only', 'Anonymous — no name'],
    },
  ],
}
