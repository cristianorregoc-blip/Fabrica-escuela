import { useState } from 'react'
import { type Screen, type Draft, type Campaign, type User } from '../types'

interface Reward {
  id: number
  title: string
  description: string
  amount: string
}

interface FormErrors {
  goal?: string
  duration?: string
  category?: string
}

interface Props {
  navigate: (s: Screen) => void
  initialDraft: Draft | null
  onSaveDraft: (draft: Draft) => void
  onPublish: (campaign: Campaign) => void
  user: User | null
}

function calcComplete(title: string, goal: string, duration: string, category: string, description: string): number {
  const fields = [title, goal, duration, category, description]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export default function CreateCampaign({ navigate, initialDraft, onSaveDraft, onPublish, user }: Props) {
  const [draftId] = useState(() => initialDraft?.id ?? Date.now())
  const [title, setTitle] = useState(initialDraft?.title ?? '')
  const [description, setDescription] = useState(initialDraft?.description ?? '')
  const [goal, setGoal] = useState(initialDraft?.goal ?? '')
  const [duration, setDuration] = useState(initialDraft?.duration ?? '')
  const [category, setCategory] = useState(initialDraft?.category ?? '')
  const [videoUrl, setVideoUrl] = useState(initialDraft?.videoUrl ?? '')
  const [rewards, setRewards] = useState<Reward[]>(
    initialDraft?.rewards ?? [{ id: 1, title: '', description: '', amount: '' }]
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [bannerError, setBannerError] = useState(false)
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const categories = ['Tecnología', 'Medio ambiente', 'Arte y cultura', 'Salud', 'Educación', 'Comunidad', 'Gastronomía', 'Ciencia']

  function validate(forPublish = false): FormErrors {
    const e: FormErrors = {}
    if (!goal) e.goal = 'Este campo es obligatorio'
    if (!duration) e.duration = 'Este campo es obligatorio'
    if (!category) e.category = 'Este campo es obligatorio'
    if (forPublish && !title) e.goal = e.goal || 'Completa el título de la campaña'
    return e
  }

  function buildDraft(): Draft {
    return {
      id: draftId,
      title,
      description,
      goal,
      duration,
      category,
      videoUrl,
      rewards,
      savedAt: new Date().toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      complete: calcComplete(title, goal, duration, category, description),
    }
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      setBannerError(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors({})
    setBannerError(false)
    setSaving(true)
    await new Promise(r => setTimeout(r, 900))
    // #conectarconBACKEND — guardar borrador: reemplazar con POST/PUT /api/drafts
    onSaveDraft(buildDraft())
    setSaving(false)
    setToast('Borrador guardado correctamente')
    setTimeout(() => setToast(''), 3500)
  }

  async function handlePublish() {
    const e = validate(true)
    if (Object.keys(e).length || !title || !description) {
      setErrors(e)
      setBannerError(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors({})
    setBannerError(false)
    setPublishing(true)
    await new Promise(r => setTimeout(r, 1500))
    // #conectarconBACKEND — publicar campaña: reemplazar con POST /api/campaigns
    const campaign: Campaign = {
      id: draftId,
      title,
      description,
      goal: parseFloat(goal),
      raised: 0,
      duration: parseInt(duration),
      daysLeft: parseInt(duration),
      category,
      videoUrl,
      rewards,
      sponsors: 0,
      creatorName: user?.name ?? 'Anónimo',
      creatorEmail: user?.email ?? '',
      publishedAt: new Date().toLocaleDateString('es-AR'),
    }
    onPublish(campaign)
    setPublishing(false)
    navigate('creator-dashboard')
  }

  function addReward() {
    setRewards(r => [...r, { id: Date.now(), title: '', description: '', amount: '' }])
  }

  function removeReward(id: number) {
    setRewards(r => r.filter(x => x.id !== id))
  }

  function updateReward(id: number, field: keyof Reward, value: string) {
    setRewards(r => r.map(x => x.id === id ? { ...x, [field]: value } : x))
  }

  const InputClass = (err?: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
      err ? 'border-error bg-red-50 focus:border-error' : 'border-gray-200 focus:border-primary'
    }`

  return (
    <div className="min-h-screen bg-bg">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 fade-in">
          <div className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-5 py-3 shadow-xl text-sm font-medium">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Sticky header bar */}
        <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-3 mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('creator-dashboard')} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 className="font-display font-700 text-gray-900 text-base leading-tight">
                {title || 'Sin título'}
              </h1>
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Borrador</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl px-4 py-2 hover:border-gray-300 transition-colors"
            >
              {saving
                ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : null}
              Guardar borrador
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-1.5 text-sm font-semibold bg-primary text-white rounded-xl px-4 py-2 hover:bg-primary-hover transition-colors shadow-sm"
            >
              {publishing
                ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : null}
              Publicar
            </button>
          </div>
        </div>

        {/* Error banner */}
        {bannerError && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 fade-in">
            <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Completa los campos obligatorios para guardar tu borrador.</p>
              <p className="text-xs text-red-600 mt-0.5">Los campos marcados en rojo son requeridos.</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Información básica */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display font-700 text-lg text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
              Información básica
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Título de la campaña</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ej: EcoBottle — La botella que salva océanos"
                  className={InputClass()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Descripción
                  <span className="ml-2 text-xs font-normal text-gray-400">{description.length}/2000</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, 2000))}
                  rows={5}
                  placeholder="Describe tu proyecto, su impacto y por qué la gente debería apoyarlo..."
                  className={`${InputClass()} resize-none`}
                />
              </div>
            </div>
          </section>

          {/* Financiamiento */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display font-700 text-lg text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
              Financiamiento <span className="text-xs font-normal text-gray-400 ml-1">(requerido)</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta financiera *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                  <input
                    type="number"
                    value={goal}
                    onChange={e => { setGoal(e.target.value); setErrors(p => ({ ...p, goal: '' })) }}
                    placeholder="30,000"
                    className={`${InputClass(errors.goal)} pl-8`}
                  />
                </div>
                {errors.goal && <p className="mt-1 text-xs text-error">{errors.goal}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Duración (días) *</label>
                <input
                  type="number"
                  value={duration}
                  onChange={e => { setDuration(e.target.value); setErrors(p => ({ ...p, duration: '' })) }}
                  placeholder="30"
                  min={1}
                  max={90}
                  className={InputClass(errors.duration)}
                />
                {errors.duration && <p className="mt-1 text-xs text-error">{errors.duration}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría *</label>
                <select
                  value={category}
                  onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: '' })) }}
                  className={InputClass(errors.category)}
                >
                  <option value="">Seleccionar...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="mt-1 text-xs text-error">{errors.category}</p>}
              </div>
            </div>
          </section>

          {/* Recompensas */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display font-700 text-lg text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
              Recompensas
            </h2>
            <div className="space-y-4">
              {rewards.map((r, i) => (
                <div key={r.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recompensa {i + 1}</span>
                    {rewards.length > 1 && (
                      <button onClick={() => removeReward(r.id)} className="text-gray-400 hover:text-error transition-colors text-xs">Eliminar</button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                      <input value={r.title} onChange={e => updateReward(r.id, 'title', e.target.value)} placeholder="Edición limitada" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                      <input value={r.description} onChange={e => updateReward(r.id, 'description', e.target.value)} placeholder="Lo que recibirás..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Monto mínimo ($)</label>
                      <input type="number" value={r.amount} onChange={e => updateReward(r.id, 'amount', e.target.value)} placeholder="25" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addReward}
                className="flex items-center gap-2 text-sm font-medium text-primary border border-dashed border-primary rounded-xl px-4 py-3 w-full justify-center hover:bg-primary-light transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Añadir recompensa
              </button>
            </div>
          </section>

          {/* Medios */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display font-700 text-lg text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">4</span>
              Medios
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL de video o imagen</label>
              <input
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... o enlace de imagen"
                className={InputClass()}
              />
              {videoUrl && (
                <div className="mt-3 bg-gray-100 rounded-xl h-40 flex items-center justify-center overflow-hidden fade-in">
                  {videoUrl.includes('unsplash') || videoUrl.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
                    <img src={videoUrl} alt="Vista previa" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎥</div>
                      <p className="text-xs text-gray-500">Vista previa de video</p>
                      <p className="text-xs text-gray-400 truncate max-w-xs px-4">{videoUrl}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
