import { type Screen, type User } from '../types'

interface Props {
  navigate: (s: Screen) => void
  user: User
  isNew?: boolean
}

// #conectarconBACKEND — aportes del patrocinador: reemplazar con GET /api/contributions?userId=...
const demoContributions = [
  { title: 'EcoBottle — Botella biodegradable 2.0', amount: 75, date: '10 sep 2026', reward: 'Edición limitada + nombre en créditos', status: 'Activa', pct: 61 },
]


export default function SponsorDashboard({ navigate, user, isNew = false }: Props) {
  // #conectarconBACKEND — saldo y estadísticas del patrocinador: reemplazar con GET /api/users/:id/stats
  const contributions = isNew ? [] : demoContributions
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-800 text-2xl text-gray-900">Panel del Patrocinador</h1>
          <p className="text-gray-500 text-sm mt-1">Hola, <span className="font-semibold text-gray-700">{user.name}</span> — sigue el impacto de tus aportes.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total aportado', value: isNew ? '$0' : '$75', sub: isNew ? 'aún sin aportes' : 'en 1 proyecto', icon: '💳', color: 'bg-green-50 border-green-100' },
            { label: 'Proyectos apoyados', value: isNew ? '0' : '1', sub: isNew ? 'explora campañas' : 'este año', icon: '🎯', color: 'bg-blue-50 border-blue-100' },
            { label: 'Proyectos exitosos', value: isNew ? '0' : '0', sub: isNew ? 'aún sin historial' : 'campaña en curso', icon: '🏆', color: 'bg-yellow-50 border-yellow-100' },
            { label: 'Recompensas', value: isNew ? '0' : '1', sub: isNew ? 'apoya para recibir' : 'por recibir', icon: '🎁', color: 'bg-secondary-light border-violet-200' },
          ].map(s => (
            <div key={s.label} className={`bg-white border rounded-2xl p-5 ${s.color}`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-display font-700 text-2xl text-gray-900">{s.value}</div>
              <div className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6">
          {/* My contributions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-display font-700 text-gray-900">Mis aportes</h2>
            </div>
            {contributions.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-4xl mb-3">💎</div>
                <p className="font-display font-700 text-gray-700 mb-1">Aún no has aportado a ningún proyecto</p>
                <p className="text-sm text-gray-400 mb-5">Explora campañas y apoya las ideas que te inspiren.</p>
                <button
                  onClick={() => navigate('campaign-page')}
                  className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Explorar campañas →
                </button>
              </div>
            ) : (
            <div className="divide-y divide-gray-50">
              {contributions.map(c => (
                <div key={c.title} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => navigate('campaign-page')}
                        className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors text-left line-clamp-1"
                      >
                        {c.title}
                      </button>
                      <p className="text-xs text-gray-400 mt-0.5">{c.date} · Recompensa: {c.reward}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full progress-bar ${c.pct >= 100 ? 'bg-secondary' : 'bg-primary'}`}
                          style={{ width: `${Math.min(c.pct, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-gray-900">${c.amount}</div>
                      <span className={`text-xs font-medium ${c.status === 'Activa' ? 'text-primary' : 'text-gray-400'}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
