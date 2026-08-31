import { COSMETIC_INTAKE_FORM } from './cosmeticIntake'
import { COSMETIC_CONSENT_FORM } from './cosmeticConsent'
import { COSMETIC_PHOTO_RELEASE_FORM } from './cosmeticPhotoRelease'

export function getCosmeticForms() {
  return [
    COSMETIC_CONSENT_FORM,
    COSMETIC_INTAKE_FORM,
    COSMETIC_PHOTO_RELEASE_FORM,
  ]
}
