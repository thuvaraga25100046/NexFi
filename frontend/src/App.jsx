import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Globe, LogOut, Store, User } from 'lucide-react'

import SessionProvider from './auth/SessionProvider'
import { useSession } from './auth/sessionContext'
import AppLayout from './components/AppLayout'
import ErrorBoundary from './components/ErrorBoundary'
import WelcomeLoginScreen from './components/WelcomeLoginScreen'
import Dashboard from './pages/Dashboard'
import Forecast from './pages/Forecast'
import Onboarding from './pages/Onboarding'
import Payables from './pages/Payables'
import Receivables from './pages/Receivables'
import RecurringExpenses from './pages/RecurringExpenses'
import Simulator from './pages/Simulator'
import Transactions from './pages/Transactions'
import { getTranslator } from './lib/i18n'

/** Blocks the app shell until a session exists, remembering the attempted path. */
function RequireAuth({ children }) {
  const { user } = useSession()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

/**
 * Renders the welcome/login screen.
 */
function LoginRoute() {
  const { signIn } = useSession()
  return <WelcomeLoginScreen onLogin={signIn} />
}

/**
 * A signed-in user who has not finished shop setup is guided through the onboarding questionnaire.
 */
function OnboardingGate({ children }) {
  const { needsOnboarding } = useSession()
  if (needsOnboarding) return <Navigate to="/onboarding" replace />
  return children
}

/** The signed-in shell: app layout, real pages, language selector, and session controls. */
function AuthenticatedApp() {
  const { user, profile, language, setLanguage, signOut } = useSession()
  const t = getTranslator(language)

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'si', label: 'සිං' },
    { code: 'ta', label: 'தமி' },
  ]

  return (
    <div className="relative">
      {/* Top Floating Utility Bar */}
      <div className="fixed top-3 right-3 z-30 flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 py-1 px-1.5 shadow-md backdrop-blur-md">
        {/* Language Switcher */}
        <div className="flex items-center rounded-full bg-slate-100 p-0.5" role="group" aria-label="Language">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setLanguage(item.code)}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                language === item.code
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* User Identity Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 pl-2 pr-1 text-xs font-semibold text-slate-700">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
            {profile?.shopName ? <Store className="h-3 w-3" /> : <User className="h-3 w-3" />}
          </span>
          <span className="max-w-[130px] truncate">
            {profile?.shopName || profile?.ownerName || (user?.mobile ? `+94 ${user.mobile}` : 'Shop')}
          </span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={signOut}
          title={t('nav.logout')}
          className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <LogOut className="h-3 w-3 sm:hidden" />
          <span className="hidden sm:inline">{t('nav.logout')}</span>
        </button>
      </div>

      <ErrorBoundary>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="receivables" element={<Receivables />} />
            <Route path="payables" element={<Payables />} />
            <Route path="recurring-expenses" element={<RecurringExpenses />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="simulator" element={<Simulator />} />
            <Route path="onboarding" element={<Onboarding />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

function AppRoutes() {
  const { user, needsOnboarding } = useSession()

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/login"
          element={user && !needsOnboarding ? <Navigate to="/" replace /> : <LoginRoute />}
        />

        {/* Accessible to unauthenticated new users registering and first-time authenticated users */}
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          path="*"
          element={
            user ? (
              <OnboardingGate>
                <AuthenticatedApp />
              </OnboardingGate>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  )
}
