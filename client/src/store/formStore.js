import { create } from 'zustand'

export const useFormStore = create((set, get) => ({
  // Patient identity
  patient: null,         // { name, dob, token }
  clinicInfo: null,      // { name, address, phone, logo, cancelHours, noShowFee }

  // Form state
  currentFormIndex: 0,
  formData: {},          // { [formId]: { fields... } }
  signatures: {},        // { [formId]: dataURL }
  declinedForms: {},     // { [formId]: true }

  setPatient: (patient) => set({ patient }),
  setClinicInfo: (clinicInfo) => set({ clinicInfo }),

  setFormData: (formId, data) =>
    set((state) => ({
      formData: { ...state.formData, [formId]: { ...state.formData[formId], ...data } },
    })),

  setSignature: (formId, dataURL) =>
    set((state) => ({
      signatures: { ...state.signatures, [formId]: dataURL },
    })),

  setDeclined: (formId, declined) =>
    set((state) => ({
      declinedForms: { ...state.declinedForms, [formId]: declined },
    })),

  nextForm: () =>
    set((state) => ({ currentFormIndex: state.currentFormIndex + 1 })),

  prevForm: () =>
    set((state) => ({ currentFormIndex: Math.max(0, state.currentFormIndex - 1) })),

  reset: () =>
    set({
      patient: null,
      currentFormIndex: 0,
      formData: {},
      signatures: {},
      declinedForms: {},
    }),
}))
