const MEDICAL_LIEN_CONTENT = `MEDICAL LIEN AGREEMENT

This Medical Lien Agreement ("Agreement") is entered into between the undersigned patient ("Patient") and [Clinic Name] ("Provider").

**Authorization for Treatment**

Patient hereby authorizes Provider to furnish necessary medical treatment, services, and supplies related to injuries sustained in an accident or incident on or about the date of the accident referenced herein.

**Assignment of Benefits and Lien**

In consideration of Provider agreeing to treat Patient on a lien basis (deferred payment), Patient hereby:

• Assigns to Provider a lien upon any and all claims, causes of action, settlements, judgments, or proceeds arising from the accident or incident causing Patient's injuries.

• Authorizes and directs Patient's attorney (if any), insurance company, or any other party to pay directly to Provider from any settlement, judgment, or insurance proceeds, the reasonable value of all medical services rendered.

• Understands that this lien will remain in effect until Provider's bill is paid in full or until Provider releases the lien in writing.

**Patient Responsibilities**

Patient agrees to:
• Notify Provider immediately of any settlement negotiations or offers.
• Not settle any claim without ensuring Provider's lien is satisfied.
• Provide Provider with the name and contact information of Patient's attorney (if applicable).
• Cooperate fully with Provider and Patient's attorney in the prosecution of any claim.

**Payment Terms**

Patient acknowledges that regardless of the outcome of any legal action or insurance claim, Patient remains personally responsible for all charges for services rendered. The lien is a convenience to Patient and does not relieve Patient of personal financial responsibility.

**No Guarantee**

Provider makes no guarantee regarding the outcome of any legal or insurance claim. This Agreement does not constitute legal advice.

By signing below, Patient acknowledges having read and understood this Agreement and voluntarily agrees to its terms.`

export const PI_MEDICAL_LIEN_FORM = {
  id: 'pi_medical_lien',
  title: 'Medical Lien Agreement',
  requiresSignature: true,
  signatureLabel: 'Medical Lien Agreement',
  content: MEDICAL_LIEN_CONTENT,
  fields: [
    { id: 'attorneyName', label: 'Attorney Name (if represented)', type: 'text', placeholder: 'Full name' },
    { id: 'attorneyFirm', label: 'Law Firm', type: 'text', placeholder: 'Firm name' },
    { id: 'attorneyPhone', label: 'Attorney Phone', type: 'text', placeholder: '(555) 000-0000' },
    {
      id: 'liensUnderstood',
      label: 'I understand that I am personally responsible for all charges regardless of the outcome of my legal or insurance claim.',
      type: 'checkbox',
      required: true,
    },
  ],
}
