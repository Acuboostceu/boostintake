export const ARBITRATION_FORM = {
  id: 'arbitration',
  title: 'Arbitration Agreement',
  requiresSignature: true,
  signatureLabel: 'Arbitration Agreement',
  optional: true,
  content: `**ARBITRATION OF DISPUTES**
(California Code of Civil Procedure §1295)

NOTICE: BY SIGNING THIS CONTRACT YOU ARE AGREEING TO HAVE ANY ISSUE OF MEDICAL MALPRACTICE DECIDED BY NEUTRAL ARBITRATION AND YOU ARE GIVING UP YOUR RIGHT TO A JURY OR COURT TRIAL. SEE ARTICLE 1 OF THIS CONTRACT.

**Article 1. Agreement to Arbitrate**

It is understood that any dispute as to medical malpractice, that is as to whether any medical services rendered under this contract were unnecessary or unauthorized or were improperly, negligently, or incompetently rendered, will be determined by submission to arbitration as provided by California law, and not by a lawsuit or resort to court process except as California law provides for judicial review of arbitration proceedings. Both parties to this contract, by entering into it, are giving up their constitutional right to have any such dispute decided in a court of law before a jury, and instead are accepting the use of arbitration.

**Article 2. All Claims Must Be Arbitrated**

It is the intention of the parties that this agreement bind all parties whose claims may arise out of or relate to treatment or service provided by the physician including any spouse or heirs of the patient and any children, whether born or unborn, at the time of the occurrence giving rise to any claim. In the case of any pregnant mother, the term "patient" herein shall mean both the mother and the unborn child, and any dispute arising from the treatment of the pregnant mother shall be subject to this arbitration agreement.

All claims for monetary damages exceeding the jurisdictional limit of the small claims court against the physician, and the physician's partners, associates, association, corporation or partnership, and the employees, agents and estates of any of them, must be arbitrated including, without limitation, claims for loss of consortium, wrongful death, emotional distress, injunctive relief, or punitive damages.

**Article 3. Procedure**

Arbitration hereunder shall be pursuant to the laws of the State of California. The parties may agree to any arbitrator or arbitration service. If they cannot agree, the arbitration shall be determined by the Arbitration Rules and Procedures of the Medical Association or, if none apply, by the Commercial Arbitration Rules of the American Arbitration Association. The costs of arbitration, including the fees of the arbitrator, shall be allocated pursuant to the laws of the State of California.

**Article 4. General Provisions**

All claims based on the same incident, transaction, or related circumstances shall be arbitrated in one proceeding. A claim shall be waived and forever barred if (1) on the date notice thereof is received, the claim, if asserted in a civil action, would be barred by the applicable California statute of limitations, or (2) the claimant fails to pursue the arbitration claim in accordance with the procedures described herein with reasonable diligence.

**Article 5. Revocation**

This contract may be changed only by a written amendment signed by both parties. You have the right to rescind (cancel) this agreement within 30 days of the date of signature below by sending written notice to the office of this provider. After the 30-day period, this agreement will remain in effect until revoked in writing by either party.

**Voluntary Agreement**

Signing this arbitration agreement is not a requirement for receiving treatment. If you choose not to sign, it will have no effect on the quality of care you receive.`,
  fields: [
    {
      id: 'arbitrationConsent',
      label: 'I have read and understand the above Arbitration Agreement and voluntarily agree to its terms.',
      type: 'checkbox',
      required: false,
    },
  ],
}
