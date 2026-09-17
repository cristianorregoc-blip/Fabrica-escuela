import { useState, useEffect } from 'react'
import { type Screen, type User, type Campaign } from '../types'

interface Props {
  navigate: (s: Screen) => void
  user: User | null
  campaigns: Campaign[]
  activeCampaign: Campaign | null
  onViewCampaign: (id: number) => void
}

const DEMO_END_DATE = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000)

const demoRewards = [
  { id: 1, emoji: '☕', title: 'Patrocinador Semilla', min: 10, description: 'Tu nombre en la página de agradecimientos y actualizaciones exclusivas del proyecto.', claimed: 89 },
  { id: 2, emoji: '🌿', title: 'Adopción Verde', min: 50, description: 'Una EcoBottle edición limitada con tu nombre grabado + los beneficios anteriores.', claimed: 43 },
  { id: 3, emoji: '🚀', title: 'Fundador Impulsor', min: 150, description: 'Visita virtual al equipo + crédito especial como "Fundador" en el producto final + recompensas anteriores.', claimed: 15 },
]

function Countdown({ endDate }: { endDate: Date }) {
  const [time, setTime] = useState(() => getTimeLeft(endDate))

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft(endDate)), 1000)
    return () => clearInterval(t)
  }, [endDate])

  function getTimeLeft(end: Date) {
    const diff = Math.max(0, end.getTime() - Date.now())
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const secs = Math.floor((diff % (1000 * 60)) / 1000)
    return { days, hours, mins, secs }
  }

  return (
    <div className="flex items-center gap-2">
      {[
        { v: time.days, label: 'días' },
        { v: time.hours, label: 'hrs' },
        { v: time.mins, label: 'min' },
        { v: time.secs, label: 'seg' },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-gray-900 text-white rounded-lg w-12 h-12 flex items-center justify-center font-display font-700 text-lg tabular-nums">
            {String(item.v).padStart(2, '0')}
          </div>
          <span className="text-xs text-gray-400 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function CampaignPage({ navigate, user, campaigns, activeCampaign, onViewCampaign }: Props) {
  const [activeTab, setActiveTab] = useState<'desc' | 'rewards' | 'updates'>('desc')

  // All derived values computed before any conditional return (rules of hooks)
  const isUserCampaign = !!activeCampaign
  const GOAL = activeCampaign?.goal ?? 30000
  const RAISED = activeCampaign?.raised ?? 13500
  const TOTAL_SPONSORS = activeCampaign?.sponsors ?? 147
  const END_DATE = activeCampaign
    ? new Date(Date.now() + activeCampaign.daysLeft * 24 * 60 * 60 * 1000)
    : DEMO_END_DATE
  const rewards = activeCampaign?.rewards.map((r, i) => ({
    id: r.id,
    emoji: ['☕', '🌿', '🚀', '💎', '🎁'][i % 5],
    title: r.title || `Recompensa ${i + 1}`,
    min: parseFloat(r.amount) || 10,
    description: r.description || 'Sin descripción.',
    claimed: 0,
  })) ?? demoRewards
  const pct = GOAL > 0 ? Math.round((RAISED / GOAL) * 100) : 0

  // List view when no specific campaign selected and there are user campaigns
  if (!activeCampaign && campaigns.length > 0) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-display font-800 text-2xl text-gray-900 mb-2">Explorar proyectos</h1>
          <p className="text-gray-500 text-sm mb-8">Descubre campañas activas y apoya las ideas que te inspiran.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(c => {
              const pct = c.goal > 0 ? Math.round((c.raised / c.goal) * 100) : 0
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {c.videoUrl && (c.videoUrl.includes('unsplash') || c.videoUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)) ? (
                      <img src={c.videoUrl} alt={c.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-1">🚀</div>
                        <p className="text-xs text-gray-400">{c.category}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">{c.category}</span>
                    <h3 className="font-display font-700 text-gray-900 mt-2 mb-1 line-clamp-2">{c.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.description || 'Sin descripción.'}</p>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1.5">
                      <div className="h-full rounded-full bg-primary progress-bar" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span><strong className="text-gray-900">${c.raised.toLocaleString()}</strong> de ${c.goal.toLocaleString()}</span>
                      <span>{pct}% · {c.daysLeft}d</span>
                    </div>
                    <button
                      onClick={() => onViewCampaign(c.id)}
                      className="w-full bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary-hover transition-colors"
                    >
                      Ver campaña
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-bg">
      {/* Back to list when viewing a specific user campaign */}
      {isUserCampaign && campaigns.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <button
            onClick={() => onViewCampaign(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Volver a explorar
          </button>
        </div>
      )}
      {/* Hero */}
      <div className="relative">
        {isUserCampaign ? (
          activeCampaign!.videoUrl && (activeCampaign!.videoUrl.match(/\.(jpg|jpeg|png|gif|webp)/i) || activeCampaign!.videoUrl.includes('unsplash')) ? (
            <img
              src={activeCampaign!.videoUrl}
              alt={activeCampaign!.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover bg-green-100"
            />
          ) : (
            <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-primary to-[#047857]" />
          )
        ) : (
          <img
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1440&h=480&fit=crop&auto=format"
            alt="EcoBottle campaña"
            className="w-full h-64 sm:h-80 lg:h-96 object-cover bg-green-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-primary text-white px-3 py-1 rounded-full">
              {activeCampaign?.category ?? 'Medio ambiente'}
            </span>
            <span className="text-xs font-medium text-green-200">✓ Verificada</span>
          </div>
          <h1 className="font-display font-800 text-2xl sm:text-3xl lg:text-4xl text-white mb-1">
            {activeCampaign?.title ?? 'EcoBottle — La botella biodegradable que salva océanos'}
          </h1>
          <p className="text-sm text-green-100">
            por <span className="font-semibold text-white">{activeCampaign?.creatorName ?? 'Lucía Martínez'}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 mb-6">
              {(['desc', 'rewards', 'updates'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === t ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {{ desc: 'Descripción', rewards: 'Recompensas', updates: 'Actualizaciones' }[t]}
                </button>
              ))}
            </div>

            {activeTab === 'desc' && (
              <div className="fade-in space-y-6">
                <div className="prose prose-sm max-w-none">
                  {isUserCampaign ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {activeCampaign!.description || 'Sin descripción.'}
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-700 leading-relaxed">
                        EcoBottle nació de una pregunta simple: ¿qué pasaría si tu botella de agua desapareciera en lugar de contaminar? Diseñamos una botella 100% compostable a partir de algas marinas y residuos agrícolas, completamente libre de plástico.
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        Cada año, <strong>8 millones de toneladas de plástico</strong> terminan en nuestros océanos. EcoBottle se disuelve en agua tibia en menos de 24 horas sin dejar rastro. Hemos completado las pruebas de laboratorio y obtenemos la certificación FDA en agosto — solo necesitamos financiamiento para la producción inicial.
                      </p>
                    </>
                  )}
                </div>

                {/* Media */}
                {isUserCampaign && activeCampaign!.videoUrl ? (
                  <div className="rounded-xl overflow-hidden bg-gray-100 h-48">
                    {activeCampaign!.videoUrl.match(/\.(jpg|jpeg|png|gif|webp)/i) || activeCampaign!.videoUrl.includes('unsplash') ? (
                      <img src={activeCampaign!.videoUrl} alt="Media" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center"><div className="text-3xl mb-1">🎥</div><p className="text-xs text-gray-400 truncate max-w-xs px-4">{activeCampaign!.videoUrl}</p></div>
                      </div>
                    )}
                  </div>
                ) : !isUserCampaign ? (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'photo-1558618666-fcd25c85cd64',
                    'photo-1532996122724-e3c354a0b15b',
                    'photo-1470115636492-6d2b56f9146d',
                  ].map(id => (
                    <img
                      key={id}
                      src={`https://images.unsplash.com/${id}?w=300&h=200&fit=crop&auto=format`}
                      alt=""
                      className="w-full h-28 object-cover rounded-xl bg-gray-100"
                    />
                  ))}
                </div>
                ) : null}

                {!isUserCampaign && <div className="bg-primary-light rounded-xl p-5 border border-green-200">
                  <h3 className="font-display font-700 text-gray-900 mb-2">¿A qué irán los fondos?</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {[
                      ['40%', 'Producción inicial de 10,000 unidades'],
                      ['25%', 'Certificación y pruebas regulatorias'],
                      ['20%', 'Logística y distribución en LATAM'],
                      ['15%', 'Marketing y comunidad'],
                    ].map(([pct, label]) => (
                      <li key={label} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-primary w-8 text-right">{pct}</span>
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>}
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="fade-in space-y-4">
                {rewards.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-2xl flex-shrink-0">
                        {r.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h3 className="font-display font-700 text-gray-900">{r.title}</h3>
                          <span className="font-display font-800 text-primary text-lg">${r.min}+</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{r.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-400">{r.claimed} personas eligieron esto</span>
                          <button
                            onClick={() => navigate('payment-flow')}
                            className="text-xs font-semibold bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-hover transition-colors"
                          >
                            Seleccionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'updates' && (
              <div className="fade-in space-y-4">
                {isUserCampaign ? (
                  <div className="py-12 text-center">
                    <div className="text-4xl mb-3">📢</div>
                    <p className="font-display font-700 text-gray-700 mb-1">Sin actualizaciones aún</p>
                    <p className="text-sm text-gray-400">El creador no ha publicado actualizaciones para esta campaña.</p>
                  </div>
                ) : (
                  [
                    { date: '12 sep 2026', title: '¡Superamos el 40%!', body: 'Gracias a la comunidad, hemos alcanzado $13,500. El equipo está preparando una actualización especial para los patrocinadores Fundadores.' },
                    { date: '1 sep 2026', title: 'Lanzamos la campaña', body: 'Estamos emocionados de compartir EcoBottle con el mundo. Este es el inicio de algo grande.' },
                  ].map(u => (
                    <div key={u.title} className="bg-white rounded-2xl border border-gray-100 p-5">
                      <p className="text-xs text-gray-400 mb-1">{u.date}</p>
                      <h3 className="font-display font-700 text-gray-900 mb-2">{u.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{u.body}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-20">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
                {/* Progress */}
                <div className="mb-5">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <span className="font-display font-800 text-3xl text-gray-900">${RAISED.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 ml-1">recaudados</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{pct}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-primary progress-bar shadow-sm"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Faltan <strong className="text-gray-700">${(GOAL - RAISED).toLocaleString()}</strong> para alcanzar la meta de ${GOAL.toLocaleString()}
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="font-display font-700 text-xl text-gray-900">{TOTAL_SPONSORS}</div>
                    <div className="text-xs text-gray-500">Patrocinadores</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="font-display font-700 text-xl text-primary">Activa</div>
                    <div className="text-xs text-gray-500">Estado</div>
                  </div>
                </div>

                {/* Countdown */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tiempo restante</p>
                  <Countdown endDate={END_DATE} />
                </div>

                <button
                  onClick={() => navigate('payment-flow')}
                  className="w-full bg-primary text-white rounded-xl py-3.5 font-display font-700 text-base hover:bg-primary-hover transition-colors shadow-sm mb-3"
                >
                  Apoyar este proyecto ✨
                </button>

                {pct === 0 && (
                  <p className="text-center text-xs text-gray-400 font-medium">¡Sé el primero en apoyar este proyecto!</p>
                )}

                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-3">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pago seguro · HTTPS/TLS cifrado
                </div>

                {/* Creator */}
                <div className="border-t border-gray-100 mt-5 pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(activeCampaign?.creatorName ?? 'L')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{activeCampaign?.creatorName ?? 'Lucía Martínez'}</p>
                    <p className="text-xs text-gray-400">Creador/a del proyecto</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
