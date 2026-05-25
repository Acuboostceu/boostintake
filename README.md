# BoostIntake

Digital intake form platform for small medical clinics (acupuncture, chiropractic, massage).

## Quick Start

### Prerequisites
- Node.js v18+
- Supabase project (free tier works)
- AWS account with SES + S3 (existing `boostintake` bucket in `us-east-2`)
- Twilio account (for SMS)

### 1. Server Setup

```bash
cd server
cp .env.example .env
# Fill in .env with your credentials
npm install
```

Run Supabase schema:
- Open Supabase > SQL Editor
- Paste contents of `server/supabase-schema.sql` and run

```bash
npm run dev   # starts on :3001
```

### 2. Client Setup

```bash
cd client
npm install
npm run dev   # starts on :5173, proxies /api to :3001
```

## Project Structure

```
boostintake/
├── client/                    # React PWA (Vite + Tailwind)
│   └── src/
│       ├── components/
│       │   ├── ui/            # Button, Input, Card, ProgressBar, Checkbox
│       │   └── forms/         # FormRenderer, SignaturePad
│       ├── forms/
│       │   ├── common/        # Patient Info, HIPAA, Financial Policy, AOB, Arbitration
│       │   └── acupuncture/   # Acupuncture Consent, Health History, Review of Systems
│       ├── pages/
│       │   ├── patient/       # PatientVerify → PatientForms → PatientComplete
│       │   ├── dashboard/     # DashboardLayout, Home, ClinicSettings, SendPatient, TabletMode
│       │   └── auth/          # Login
│       └── store/             # Zustand (formStore)
└── server/                    # Node.js + Express
    └── src/
        ├── routes/            # auth, clinic, patient
        ├── services/
        │   ├── pdf/           # PDFKit generation
        │   ├── email/         # AWS SES
        │   ├── sms/           # Twilio
        │   └── storage/       # AWS S3 (logo upload)
        └── middleware/        # JWT auth
```

## Patient Flow

1. Staff: Dashboard → Send Forms → enters patient name, DOB, phone
2. Server creates a unique token, sends SMS: `boostintake.com/p/<token>`
3. Patient opens link → verifies name + DOB
4. Completes 8 forms (Patient Info, Acupuncture Consent, Health History, Review of Systems, HIPAA, Financial Policy, AOB, Arbitration)
5. Draws signature on each consent form
6. Submits → PDF generated in memory → emailed to clinic → all PHI deleted

## Tablet Mode

- Staff: Dashboard → Tablet Mode (bookmarked as PWA on tablet)
- Patient enters name + DOB on tablet
- Fills all forms and signs
- Completion screen prompts staff PIN to reset

## Environment Variables

See `server/.env.example` for all required variables.

## HIPAA Notes

- No PHI stored after submission (token expires, PDF deleted immediately after email)
- AWS SES requires HIPAA BAA — sign before production use
- S3 bucket has public access blocked
- All tokens expire in 24 hours
- Only submission logs (no PHI) are retained

## Next Steps (Phase 2)

- [ ] Stripe subscription billing
- [ ] Chiropractic + Massage templates
- [ ] Custom form builder
- [ ] Insurance card photo upload
- [ ] Multi-location (Clinic plan)
- [ ] Branded welcome messages (Pro plan)
