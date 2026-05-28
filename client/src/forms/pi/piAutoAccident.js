export const PI_AUTO_ACCIDENT_FORM = {
  id: 'pi_auto_accident',
  title: 'Auto Accident / PI Intake',
  requiresSignature: false,
  sections: [
    {
      title: 'Accident Information',
      fields: [
        { id: 'accidentDate', label: 'Date of Accident', type: 'date' },
        { id: 'accidentTime', label: 'Time of Accident (approximate)', type: 'text', placeholder: 'e.g., 3:30 PM' },
        { id: 'accidentLocation', label: 'Location of Accident (city/street)', type: 'text', placeholder: 'e.g., Main St & 5th Ave, Los Angeles' },
        {
          id: 'vehicleType',
          label: 'Your vehicle type',
          type: 'radio',
          options: ['Sedan', 'SUV/Truck', 'Minivan', 'Motorcycle', 'Other'],
        },
        {
          id: 'vehiclePosition',
          label: 'Your position in vehicle',
          type: 'radio',
          options: ['Driver', 'Front passenger', 'Rear passenger (left)', 'Rear passenger (right)'],
        },
        {
          id: 'seatbelt',
          label: 'Were you wearing a seatbelt?',
          type: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'airbagDeployed',
          label: 'Did airbag(s) deploy?',
          type: 'radio',
          options: ['Yes', 'No', 'Not applicable'],
        },
        {
          id: 'impactDirection',
          label: 'Direction of impact (check all that apply)',
          type: 'multicheck',
          options: ['Front', 'Rear (rear-ended)', 'Left side', 'Right side', 'Rollover'],
        },
        {
          id: 'vehicleDamage',
          label: 'How would you describe the vehicle damage?',
          type: 'radio',
          options: ['Minor (cosmetic)', 'Moderate', 'Severe', 'Unknown'],
        },
        { id: 'vehicleSpeed', label: 'Estimated speed of impact', type: 'text', placeholder: 'e.g., 25 mph, unknown' },
      ],
    },
    {
      title: 'Immediate Response',
      fields: [
        {
          id: 'leftScene',
          label: 'Did you leave the scene by ambulance?',
          type: 'radio',
          options: ['Yes', 'No'],
        },
        {
          id: 'erVisit',
          label: 'Did you visit an emergency room?',
          type: 'radio',
          options: ['Yes', 'No'],
        },
        { id: 'erHospital', label: 'If yes, which hospital?', type: 'text', placeholder: 'Hospital name' },
        {
          id: 'policeReport',
          label: 'Was a police report filed?',
          type: 'radio',
          options: ['Yes', 'No', 'Unknown'],
        },
        { id: 'policeReportNumber', label: 'Police report number (if known)', type: 'text', placeholder: 'e.g., 2024-001234' },
      ],
    },
    {
      title: 'Symptoms',
      fields: [
        {
          id: 'symptomsImmediate',
          label: 'Symptoms experienced immediately after accident (check all that apply)',
          type: 'multicheck',
          options: [
            'Neck pain', 'Back pain', 'Headache', 'Dizziness', 'Shoulder pain',
            'Arm/hand pain', 'Leg/foot pain', 'Numbness/tingling', 'Blurred vision',
            'Memory problems', 'Loss of consciousness', 'Nausea', 'Anxiety/shock', 'None immediately',
          ],
        },
        {
          id: 'symptomsDelayed',
          label: 'Symptoms that developed in the days following (check all that apply)',
          type: 'multicheck',
          options: [
            'Neck pain', 'Back pain', 'Headache', 'Dizziness', 'Shoulder pain',
            'Arm/hand pain', 'Leg/foot pain', 'Numbness/tingling', 'Blurred vision',
            'Memory problems', 'Loss of consciousness', 'Nausea', 'Anxiety/shock', 'None immediately',
          ],
        },
        {
          id: 'currentSymptoms',
          label: 'Describe your current symptoms in detail',
          type: 'textarea',
          required: true,
          placeholder: 'Please describe your pain, location, severity, and any changes since the accident...',
        },
      ],
    },
    {
      title: 'Legal & Insurance',
      fields: [
        {
          id: 'attorneyRetained',
          label: 'Have you retained an attorney?',
          type: 'radio',
          options: ['Yes', 'No'],
        },
        { id: 'attorneyName', label: 'Attorney name and firm', type: 'text', placeholder: 'e.g., John Smith, Smith & Associates' },
        { id: 'attorneyPhone', label: 'Attorney phone number', type: 'text', placeholder: '(555) 000-0000' },
        {
          id: 'insuranceClaimFiled',
          label: 'Has an insurance claim been filed?',
          type: 'radio',
          options: ['Yes', 'No', 'In progress'],
        },
        { id: 'atFaultPartyInsurance', label: "At-fault party's insurance company (if known)", type: 'text', placeholder: 'e.g., State Farm, Allstate' },
        { id: 'claimNumber', label: 'Claim number (if known)', type: 'text', placeholder: 'e.g., CLM-2024-000123' },
      ],
    },
    {
      title: 'Prior History',
      fields: [
        {
          id: 'priorAccidents',
          label: 'Have you been in a prior motor vehicle accident?',
          type: 'radio',
          options: ['Yes', 'No'],
        },
        { id: 'priorAccidentDetails', label: 'If yes, please describe (date, injuries, treatment)', type: 'text', placeholder: 'e.g., 2019, rear-ended, treated for whiplash' },
        {
          id: 'priorInjuryToSameArea',
          label: 'Do you have any prior injuries to the same area(s) now affected?',
          type: 'radio',
          options: ['Yes', 'No'],
        },
        { id: 'priorInjuryDetails', label: 'If yes, please describe', type: 'text', placeholder: 'e.g., Prior neck surgery in 2018' },
      ],
    },
  ],
}
