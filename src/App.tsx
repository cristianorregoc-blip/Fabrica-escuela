import { useState, useEffect } from 'react'
import { type Screen, type User, type Draft, type Campaign } from './types'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './screens/Home'
import Register from './screens/Register'
import Login from './screens/Login'
import CreatorDashboard from './screens/CreatorDashboard'
import SponsorDashboard from './screens/SponsorDashboard'
import CreateCampaign from './screens/CreateCampaign'
import CampaignPage from './screens/CampaignPage'
import PaymentFlow from './screens/PaymentFlow'

const STORAGE_VERSION = 'v3'
if (localStorage.getItem('if_version') !== STORAGE_VERSION) {
  ['if_user', 'if_accounts', 'if_drafts', 'if_campaigns'].forEach(k => localStorage.removeItem(k))
  localStorage.setItem('if_version', STORAGE_VERSION)
}

// #conectarconBACKEND — sesión de usuario: reemplazar con token JWT / cookie de sesión del servidor
function loadUser(): User | null {
  try { return JSON.parse(localStorage.getItem('if_user') || 'null') } catch { return null }
}
// #conectarconBACKEND — borradores: reemplazar con GET /api/drafts?userId=...
function loadDrafts(): Draft[] {
  try { return JSON.parse(localStorage.getItem('if_drafts') || '[]') } catch { return [] }
}
// #conectarconBACKEND — campañas publicadas: reemplazar con GET /api/campaigns
function loadCampaigns(): Campaign[] {
  try { return JSON.parse(localStorage.getItem('if_campaigns') || '[]') } catch { return [] }
}
// #conectarconBACKEND — registro de cuentas: reemplazar con GET /api/users
export function loadAccounts(): User[] {
  try { return JSON.parse(localStorage.getItem('if_accounts') || '[]') } catch { return [] }
}
// #conectarconBACKEND — crear cuenta: reemplazar con POST /api/users
export function saveAccount(u: User) {
  const accounts = loadAccounts()
  if (!accounts.find(a => a.email === u.email)) {
    localStorage.setItem('if_accounts', JSON.stringify([...accounts, u]))
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(loadUser() ? 'campaign-page' : 'home')
  const [user, setUser] = useState<User | null>(loadUser)
  const [isNewUser, setIsNewUser] = useState(false)
  const [drafts, setDrafts] = useState<Draft[]>(loadDrafts)
  const [campaigns, setCampaigns] = useState<Campaign[]>(loadCampaigns)
  const [editingDraftId, setEditingDraftId] = useState<number | null>(null)
  const [viewingCampaignId, setViewingCampaignId] = useState<number | null>(null)

  // #conectarconBACKEND — persistir sesión: reemplazar con manejo de token/cookie
  useEffect(() => {
    if (user) localStorage.setItem('if_user', JSON.stringify(user))
    else localStorage.removeItem('if_user')
  }, [user])

  // #conectarconBACKEND — persistir borradores: reemplazar con PUT /api/drafts
  useEffect(() => {
    localStorage.setItem('if_drafts', JSON.stringify(drafts))
  }, [drafts])

  // #conectarconBACKEND — persistir campañas: reemplazar con PUT /api/campaigns
  useEffect(() => {
    localStorage.setItem('if_campaigns', JSON.stringify(campaigns))
  }, [campaigns])

  function navigate(s: Screen) {
    setScreen(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleLogin(u: User) {
    setIsNewUser(false)
    setUser(u)
  }

  function handleRegister(u: User) {
    setIsNewUser(true)
    setUser(u)
  }

  function handleLogout() {
    setUser(null)
    setIsNewUser(false)
    navigate('home')
  }

  // #conectarconBACKEND — guardar borrador: reemplazar con POST/PUT /api/drafts/:id
  function handleSaveDraft(draft: Draft) {
    setDrafts(prev => {
      const exists = prev.find(d => d.id === draft.id)
      if (exists) return prev.map(d => d.id === draft.id ? draft : d)
      return [...prev, draft]
    })
  }

  // #conectarconBACKEND — eliminar borrador: reemplazar con DELETE /api/drafts/:id
  function handleDeleteDraft(id: number) {
    setDrafts(prev => prev.filter(d => d.id !== id))
  }

  // #conectarconBACKEND — publicar campaña: reemplazar con POST /api/campaigns
  function handlePublishCampaign(c: Campaign) {
    setCampaigns(prev => [...prev, c])
    setDrafts(prev => prev.filter(d => d.id !== c.id))
  }

  function openDraft(id: number | null) {
    setEditingDraftId(id)
    navigate('create-campaign')
  }

  function viewCampaign(id: number) {
    setViewingCampaignId(id < 0 ? null : id)
    navigate('campaign-page')
  }

  const editingDraft = editingDraftId !== null ? drafts.find(d => d.id === editingDraftId) ?? null : null
  const viewingCampaign = viewingCampaignId !== null ? campaigns.find(c => c.id === viewingCampaignId) ?? null : null

  const noFooterScreens: Screen[] = ['payment-flow']
  const showFooter = !noFooterScreens.includes(screen)

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar user={user} navigate={navigate} onLogout={handleLogout} />

      <main className="flex-1">
        {screen === 'home' && (
          <Home navigate={navigate} />
        )}
        {screen === 'register' && (
          <Register navigate={navigate} onLogin={handleRegister} />
        )}
        {screen === 'login' && (
          <Login navigate={navigate} onLogin={handleLogin} />
        )}
        {screen === 'creator-dashboard' && user && (
          <CreatorDashboard
            navigate={navigate}
            user={user}
            isNew={isNewUser}
            drafts={drafts}
            campaigns={campaigns.filter(c => c.creatorEmail === user.email)}
            onOpenDraft={openDraft}
            onDeleteDraft={handleDeleteDraft}
            onViewCampaign={viewCampaign}
          />
        )}
        {screen === 'creator-dashboard' && !user && (
          <Login navigate={navigate} onLogin={handleLogin} />
        )}
        {screen === 'sponsor-dashboard' && user && (
          <SponsorDashboard navigate={navigate} user={user} isNew={isNewUser} />
        )}
        {screen === 'sponsor-dashboard' && !user && (
          <Login navigate={navigate} onLogin={handleLogin} />
        )}
        {screen === 'create-campaign' && (
          <CreateCampaign
            navigate={navigate}
            initialDraft={editingDraft}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublishCampaign}
            user={user}
          />
        )}
        {screen === 'campaign-page' && (
          <CampaignPage
            navigate={navigate}
            user={user}
            campaigns={campaigns}
            activeCampaign={viewingCampaign}
            onViewCampaign={viewCampaign}
          />
        )}
        {screen === 'payment-flow' && (
          <PaymentFlow navigate={navigate} />
        )}
      </main>

      {showFooter && <Footer />}

      {/* Demo navigation overlay */}
      <div className="fixed bottom-4 right-4 z-50">
        <details className="group">
          <summary className="flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer shadow-lg list-none">
            <span>🗺 Navegar</span>
            <svg className="w-3 h-3 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </summary>
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 min-w-52 fade-in">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">Pantallas</p>
            {([
              { s: 'home', label: '🏠 Inicio' },
              { s: 'campaign-page', label: '🌍 Explorar proyectos' },
              { s: 'payment-flow', label: '💳 Flujo de aporte' },
              { s: 'register', label: '📝 Registro' },
              { s: 'login', label: '🔐 Iniciar sesión' },
              { s: 'create-campaign', label: '✏️ Crear campaña' },
              { s: 'creator-dashboard', label: '🚀 Dashboard Creador' },
              { s: 'sponsor-dashboard', label: '💎 Dashboard Patrocinador' },
            ] as { s: Screen; label: string }[]).map(({ s, label }) => (
              <button
                key={s}
                onClick={() => {
                  if (s === 'create-campaign') setEditingDraftId(null)
                  if (s === 'campaign-page') setViewingCampaignId(null)
                  navigate(s)
                  if ((s === 'creator-dashboard' || s === 'sponsor-dashboard') && !user) {
                    const demoUser: User = { name: s === 'creator-dashboard' ? 'Ana Creadora' : 'Carlos Patrocinador', email: s === 'creator-dashboard' ? 'ana@crear.co' : 'carlos@mail.co', role: s === 'creator-dashboard' ? 'creator' : 'sponsor' }
                    setUser(demoUser)
                    setIsNewUser(false)
                  }
                }}
                className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors font-medium ${screen === s ? 'bg-primary-light text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            ))}
            {user && (
              <div className="border-t border-gray-100 mt-2 pt-2">
                <p className="text-xs text-gray-400 px-3">Sesión: <strong>{user.name}</strong> ({user.role})</p>
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  )
}
