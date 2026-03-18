import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from '@/components/ui/Toaster'
import { Footer } from '@/components/layout/Footer'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { CartDrawer } from '@/components/cart/CartDrawer'

// Public pages
import HomePage from '@/pages/public/HomePage'
import ServicesPage from '@/pages/public/ServicesPage'
import PricingPage from '@/pages/public/PricingPage'
import ShopPage from '@/pages/public/ShopPage'
import ContactPage from '@/pages/public/ContactPage'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Instructor pages
import InstructorDashboard from '@/pages/instructor/InstructorDashboard'
import CreateTestPage from '@/pages/instructor/CreateTestPage'
import EditTestPage from '@/pages/instructor/EditTestPage'
import SubmissionsPage from '@/pages/instructor/SubmissionsPage'
import GradeSubmissionPage from '@/pages/instructor/GradeSubmissionPage'
import AnalyticsPage from '@/pages/instructor/AnalyticsPage'

// Student pages
import StudentDashboard from '@/pages/student/StudentDashboard'
import TakeTestPage from '@/pages/student/TakeTestPage'
import ResultsPage from '@/pages/student/ResultsPage'

function AppShell() {
  const [cartOpen, setCartOpen] = useState(false)
  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function PortalShell() {
  const [cartOpen, setCartOpen] = useState(false)
  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Routes>
            {/* Public routes with Navbar + Footer */}
            <Route element={<AppShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Auth + Portal routes (no footer) */}
            <Route element={<PortalShell />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Instructor */}
              <Route path="/instructor" element={<ProtectedRoute allowedRole="instructor"><InstructorDashboard /></ProtectedRoute>} />
              <Route path="/instructor/tests/new" element={<ProtectedRoute allowedRole="instructor"><CreateTestPage /></ProtectedRoute>} />
              <Route path="/instructor/tests/:id" element={<ProtectedRoute allowedRole="instructor"><EditTestPage /></ProtectedRoute>} />
              <Route path="/instructor/submissions" element={<ProtectedRoute allowedRole="instructor"><SubmissionsPage /></ProtectedRoute>} />
              <Route path="/instructor/submissions/:id/grade" element={<ProtectedRoute allowedRole="instructor"><GradeSubmissionPage /></ProtectedRoute>} />
              <Route path="/instructor/analytics" element={<ProtectedRoute allowedRole="instructor"><AnalyticsPage /></ProtectedRoute>} />

              {/* Student */}
              <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/tests/:id" element={<ProtectedRoute allowedRole="student"><TakeTestPage /></ProtectedRoute>} />
              <Route path="/student/results/:id" element={<ProtectedRoute allowedRole="student"><ResultsPage /></ProtectedRoute>} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
