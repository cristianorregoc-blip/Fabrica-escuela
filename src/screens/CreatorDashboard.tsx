import { useState } from 'react'
import { type Screen, type User, type Draft, type Campaign } from '../types'

interface Props {
  navigate: (s: Screen) => void
  user: User
  isNew?: boolean
  drafts: Draft[]
  campaigns: Campaign[]
  onOpenDraft: (id: number) => void
  onDeleteDraft: (id: number) => void
  onViewCampaign: (id: number) => void
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'Activa': 'bg-green-100 text-green-700',
    'Borrador': 'bg-gray-100 text-gray-600',
    'Finalizada': 'bg-secondary-light text-secondary',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

export default function CreatorDashboard({ navigate, user, isNew = false, drafts, campaigns, onOpenDraft, onDeleteDraft, onViewCampaign }: Props) {
  const [showDrafts, setShowDrafts] = useState(false)

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-800 text-2xl text-gray-900">Panel del Creador</h1>
            <p className="text-gray-500 text-sm mt-1">Hola, <span className="font-semibold text-gray-700">{user.name}</span> — gestiona tus campañas aquí.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDrafts(v => !v)}
              className={`relative flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${showDrafts ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Borradores
              {drafts.length > 0 && (
                <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${showDrafts ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                  {drafts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('create-campaign')}
              className="flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Nueva campaña
            </button>
          </div>
        </div>

        {/* Stats */}
        {(() => {
          const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0)
          const totalSponsors = campaigns.reduce((s, c) => s + c.sponsors, 0)
          const active = campaigns.filter(c => c.daysLeft > 0).length
          return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total recaudado', value: `$${totalRaised.toLocaleString()}`, sub: campaigns.length ? `en ${campaigns.length} campaña${campaigns.length > 1 ? 's' : ''}` : 'aún sin campañas', icon: '💰', color: 'bg-green-50 border-green-100' },
            { label: 'Patrocinadores', value: String(totalSponsors), sub: totalSponsors ? 'usuarios únicos' : 'aún sin patrocinadores', icon: '👥', color: 'bg-blue-50 border-blue-100' },
            { label: 'Campañas activas', value: String(active), sub: active ? 'en progreso' : 'crea tu primera campaña', icon: '🚀', color: 'bg-primary-light border-green-200' },
            { label: 'Campañas publicadas', value: String(campaigns.length), sub: campaigns.length ? 'en total' : 'sin historial aún', icon: '⭐', color: 'bg-secondary-light border-violet-200' },
          ].map(s => (
            <div key={s.label} className={`bg-white border rounded-2xl p-5 ${s.color}`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-display font-700 text-2xl text-gray-900">{s.value}</div>
              <div className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>
          )
        })()}

        {/* Campaigns */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-display font-700 text-gray-900">Mis campañas</h2>
          </div>
          {campaigns.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">🚀</div>
              <p className="font-display font-700 text-gray-700 mb-1">Aún no tienes campañas</p>
              <p className="text-sm text-gray-400 mb-5">Crea tu primera campaña y empieza a recaudar fondos.</p>
              <button
                onClick={() => navigate('create-campaign')}
                className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Crear primera campaña
              </button>
            </div>
          ) : (
          <div className="divide-y divide-gray-50">
            {campaigns.map(c => {
              const pct = c.goal > 0 ? Math.round((c.raised / c.goal) * 100) : 0
              const status = c.daysLeft <= 0 ? 'Finalizada' : 'Activa'
              return (
              <div key={c.id} className="px-6 py-5 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={status} />
                      <span className="text-xs text-gray-400">{c.category}</span>
                    </div>
                    <h3
                      className="font-semibold text-gray-900 text-sm truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => onViewCampaign(c.id)}
                    >
                      {c.title}
                    </h3>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>${c.raised.toLocaleString()} recaudados de ${c.goal.toLocaleString()}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-primary progress-bar" style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="text-xs text-gray-400">Patrocinadores</div>
                      <div className="text-sm font-semibold text-gray-900">{c.sponsors}</div>
                    </div>
                    {c.daysLeft > 0 && (
                      <div>
                        <div className="text-xs text-gray-400">Días restantes</div>
                        <div className="text-sm font-semibold text-gray-900">{c.daysLeft}</div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewCampaign(c.id)}
                        className="text-xs font-medium text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary-light transition-colors"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
          )}
        </div>

        {/* Drafts panel */}
        {showDrafts && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-in">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <h2 className="font-display font-700 text-gray-900">Borradores guardados</h2>
              </div>
              <span className="text-xs text-gray-400">{drafts.length} {drafts.length === 1 ? 'borrador' : 'borradores'}</span>
            </div>
            {drafts.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-400">No hay borradores guardados.</p>
                <button
                  onClick={() => navigate('create-campaign')}
                  className="mt-3 text-sm font-semibold text-primary hover:underline"
                >
                  Crear una campaña →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {drafts.map(d => (
                  <div key={d.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">Borrador</span>
                          <span className="text-xs text-gray-400">{d.savedAt}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 truncate">{d.title || 'Sin título'}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-gray-400 progress-bar" style={{ width: `${d.complete}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">{d.complete}% completado</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => onDeleteDraft(d.id)}
                          className="text-xs font-medium text-gray-400 hover:text-error transition-colors px-2 py-1.5"
                          title="Eliminar borrador"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <button
                          onClick={() => onOpenDraft(d.id)}
                          className="text-xs font-semibold text-primary border border-primary rounded-lg px-3 py-1.5 hover:bg-primary-light transition-colors"
                        >
                          Continuar editando
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick tips */}
        <div className="mt-6 bg-gradient-to-br from-primary to-[#047857] rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-display font-700 text-lg mb-1">Consejo del día</h3>
              <p className="text-sm text-green-100 leading-relaxed">Las campañas con videos explicativos recaudan un <strong className="text-white">85% más</strong> que las que solo tienen imágenes. ¡Agrega un video a tu próxima campaña!</p>
              <button
                onClick={() => navigate('create-campaign')}
                className="mt-3 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg px-4 py-2 transition-colors"
              >
                Crear nueva campaña →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
