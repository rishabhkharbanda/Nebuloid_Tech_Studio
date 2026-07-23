import { Suspense } from 'react'
import AdminLoginPage from './login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm">Loading…</div>}>
      <AdminLoginPage />
    </Suspense>
  )
}
