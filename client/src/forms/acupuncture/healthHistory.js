export const HEALTH_HISTORY_FORM = {
  id: 'health_history',
  title: 'Health History & Chief Complaint',
  requiresSignature: false,
  sections: [
    {
      title: 'Chief Complaint',
      fields: [
        { id: 'chiefComplaint', label: 'What is your primary reason for seeking treatment today?', type: 'textarea', required: true, placeholder: 'Describe your main concern...' },
        { id: 'symptomDuration', label: 'How long have you had this condition?', type: 'text', required: false, placeholder: 'e.g., 2 weeks, 3 months, 1 year' },
        { id: 'painScale', label: 'Current pain level (0 = no pain, 10 = worst pain imaginable)', type: 'pain-slider', required: false },
        { id: 'symptomDescription', label: 'How would you describe your pain/discomfort?', type: 'multicheck', required: false, options: ['Sharp', 'Dull', 'Aching', 'Burning', 'Stabbing', 'Cramping', 'Throbbing', 'Tingling/Numbness', 'Pressure'] },
        { id: 'worseWith', label: 'What makes your symptoms worse?', type: 'text', required: false, placeholder: 'e.g., activity, cold, stress...' },
        { id: 'betterWith', label: 'What makes your symptoms better?', type: 'text', required: false, placeholder: 'e.g., rest, heat, movement...' },
      ],
    },
    {
      title: 'Medical History',
      fields: [
        { id: 'currentMedications', label: 'Current Medications & Supplements', type: 'textarea', required: false, placeholder: 'List all medications, vitamins, and supplements...' },
        { id: 'allergies', label: 'Allergies (medications, foods, environmental)', type: 'textarea', required: false, placeholder: 'List all known allergies...' },
        { id: 'pastSurgeries', label: 'Past Surgeries or Hospitalizations', type: 'textarea', required: false, placeholder: 'Include dates if possible...' },
        {
          id: 'medicalConditions',
          label: 'Do you have any of the following conditions? (check all that apply)',
          type: 'multicheck',
          required: false,
          options: [
            'Diabetes', 'High Blood Pressure', 'Heart Disease', 'Pacemaker', 'Cancer (current/past)',
            'Autoimmune Disease', 'Thyroid Condition', 'Hepatitis B or C', 'HIV/AIDS',
            'Blood Clotting Disorder', 'Epilepsy/Seizures', 'Osteoporosis', 'Kidney Disease',
            'Liver Disease', 'Anemia', 'Fibromyalgia', 'Chronic Fatigue', 'Anxiety/Depression',
            'None of the above',
          ],
        },
        { id: 'previousAcupuncture', label: 'Have you had acupuncture before?', type: 'radio', required: false, options: ['Yes', 'No'] },
        { id: 'previousAcupunctureDetails', label: 'If yes, when and how was your experience?', type: 'text', required: false, placeholder: 'Describe your previous experience...' },
      ],
    },
    {
      title: 'Lifestyle',
      fields: [
        { id: 'occupation', label: 'Occupation', type: 'text', required: false, placeholder: 'Your job or occupation' },
        { id: 'exerciseFrequency', label: 'Exercise frequency', type: 'radio', required: false, options: ['Rarely/Never', '1-2x/week', '3-4x/week', 'Daily'] },
        { id: 'sleepHours', label: 'Average hours of sleep per night', type: 'radio', required: false, options: ['Less than 5', '5-6', '7-8', 'More than 8'] },
        { id: 'sleepQuality', label: 'Sleep quality', type: 'radio', required: false, options: ['Poor', 'Fair', 'Good', 'Excellent'] },
        { id: 'stressLevel', label: 'Current stress level (1-5)', type: 'radio', required: false, options: ['1 - Very Low', '2 - Low', '3 - Moderate', '4 - High', '5 - Very High'] },
        { id: 'diet', label: 'How would you describe your diet?', type: 'radio', required: false, options: ['Mostly healthy', 'Average', 'Could be better', 'Poor'] },
        { id: 'smoking', label: 'Smoking', type: 'radio', required: false, options: ['Never', 'Former', 'Current'] },
        { id: 'alcohol', label: 'Alcohol consumption', type: 'radio', required: false, options: ['None', 'Occasional', 'Moderate', 'Heavy'] },
      ],
    },
    {
      title: "Women's Health (if applicable)",
      fields: [
        { id: 'lastMenstrualPeriod', label: 'Last Menstrual Period (LMP)', type: 'text', required: false, placeholder: 'Approximate date' },
        { id: 'cycleRegularity', label: 'Menstrual cycle', type: 'radio', required: false, options: ['Regular', 'Irregular', 'Post-menopausal', 'N/A'] },
        { id: 'pregnancies', label: 'Number of pregnancies', type: 'text', required: false, placeholder: 'Number' },
      ],
    },
  ],
}
