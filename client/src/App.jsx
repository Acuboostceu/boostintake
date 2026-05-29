import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { PatientVerify } from './pages/patient/PatientVerify'
import { PatientForms } from './pages/patient/PatientForms'
import { PatientComplete } from './pages/patient/PatientComplete'

import { DashboardLayout } from './pages/dashboard/DashboardLayout'
import { DashboardHome } from './pages/dashboard/DashboardHome'
import { ClinicSettings } from './pages/dashboard/ClinicSettings'
import { SendPatient } from './pages/dashboard/SendPatient'
import { TabletMode } from './pages/dashboard/TabletMode'
import { FormsPage } from './pages/dashboard/FormsPage'
import { Billing } from './pages/dashboard/Billing'
import { SocialMarketing } from './pages/dashboard/SocialMarketing'

import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { Landing } from './pages/Landing'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/p/:token" element={<PatientVerify />} />
          <Route path="/p/:token/forms" element={<PatientForms />} />
          <Route path="/p/:token/complete" element={<PatientComplete />} />

          <Route path="/tablet" element={<TabletMode />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="forms" element={<FormsPage />} />
            <Route path="settings" element={<ClinicSettings />} />
            <Route path="send" element={<SendPatient />} />
            <Route path="billing" element={<Billing />} />
            <Route path="social" element={<SocialMarketing />} />
          </Route>

          <Route path="/" element={<Landing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
