export const REVIEW_OF_SYSTEMS_FORM = {
  id: 'review_of_systems',
  title: 'Review of Systems',
  requiresSignature: false,
  intro: 'Please check any symptoms you are currently experiencing or have experienced in the past 3 months.',
  sections: [
    {
      title: 'Head & Neurological',
      fields: [{
        id: 'ros_head',
        type: 'multicheck',
        options: ['Headaches', 'Migraines', 'Dizziness/Vertigo', 'Fainting', 'Memory problems', 'Brain fog', 'Facial pain', 'Jaw pain (TMJ)', 'Ringing in ears (Tinnitus)', 'Vision changes', 'Eye strain'],
      }],
    },
    {
      title: 'Neck, Shoulder & Back',
      fields: [{
        id: 'ros_musculo',
        type: 'multicheck',
        options: ['Neck pain/stiffness', 'Shoulder pain', 'Upper back pain', 'Lower back pain', 'Sciatica', 'Hip pain', 'Knee pain', 'Ankle/foot pain', 'Wrist/hand pain', 'Elbow pain', 'Muscle weakness', 'Joint stiffness', 'Muscle cramps'],
      }],
    },
    {
      title: 'Cardiovascular & Respiratory',
      fields: [{
        id: 'ros_cardio',
        type: 'multicheck',
        options: ['Chest pain', 'Heart palpitations', 'Shortness of breath', 'Cough (chronic)', 'Asthma', 'Seasonal allergies', 'Frequent colds/flu', 'Swollen ankles/legs', 'Poor circulation', 'Cold hands/feet'],
      }],
    },
    {
      title: 'Digestive',
      fields: [{
        id: 'ros_digestive',
        type: 'multicheck',
        options: ['Acid reflux/GERD', 'Nausea', 'Vomiting', 'Bloating/Gas', 'Constipation', 'Diarrhea', 'Irritable Bowel', 'Abdominal pain', 'Poor appetite', 'Excessive hunger/thirst', 'Weight gain', 'Weight loss'],
      }],
    },
    {
      title: 'Urinary & Reproductive',
      fields: [{
        id: 'ros_uro',
        type: 'multicheck',
        options: ['Frequent urination', 'Painful urination', 'Incontinence', 'Kidney stones', 'UTIs (frequent)', 'Sexual dysfunction', 'Infertility concerns', 'Menstrual irregularities', 'PMS symptoms', 'Menopausal symptoms', 'Prostate issues'],
      }],
    },
    {
      title: 'Mental & Emotional',
      fields: [{
        id: 'ros_mental',
        type: 'multicheck',
        options: ['Anxiety', 'Depression', 'Mood swings', 'Irritability', 'Panic attacks', 'PTSD', 'Insomnia', 'Excessive dreaming', 'Fatigue/Low energy', 'Burnout', 'Grief/Loss'],
      }],
    },
    {
      title: 'Skin & Other',
      fields: [{
        id: 'ros_skin',
        type: 'multicheck',
        options: ['Acne', 'Eczema/Psoriasis', 'Hives/Rashes', 'Excessive sweating', 'Night sweats', 'Hair loss', 'Brittle nails', 'Dry skin', 'Numbness/Tingling', 'Hot flashes', 'None of the above'],
      }],
    },
    {
      title: 'Additional Notes',
      fields: [
        { id: 'rosAdditional', label: 'Is there anything else you would like your practitioner to know?', type: 'textarea', required: false, placeholder: 'Any additional health concerns or information...' },
      ],
    },
  ],
}
