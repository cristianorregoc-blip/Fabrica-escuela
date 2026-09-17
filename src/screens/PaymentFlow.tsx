import { useState } from 'react'
import { type Screen } from '../types'

interface Props {
  navigate: (s: Screen) => void
}

const rewardOptions = [
  { id: 1, emoji: '☕', title: 'Patrocinador Semilla', min: 10, description: 'Nombre en agradecimientos + actualizaciones exclusivas.' },
  { id: 2, emoji: '🌿', title: 'Adopción Verde', min: 50, description: 'EcoBottle edición limitada grabada con tu nombre.' },
  { id: 3, emoji: '🚀', title: 'Fundador Impulsor', min: 150, description: 'Visita virtual al equipo + crédito como Fundador.' },
]

type FlowStatus = 'select' | 'payment' | 'loading' | 'success' | 'error'

export default function PaymentFlow({ navigate }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedReward, setSelectedReward] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [cardNum, setCardNum] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [status, setStatus] = useState<FlowStatus>('select')

  const amount = selectedReward
    ? rewardOptions.find(r => r.id === selectedReward)?.min
    : parseInt(customAmount) || 0

  function formatCard(v: string) {
    return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  function formatExp(v: string) {
    return v.replace(/\D/g, '').slice(0, 4).replace(/^(.{2})(.+)/, '$1/$2')
  }

  function canPay() {
    return cardNum.replace(/\s/g, '').length >= 16 && cardExp.length >= 5 && cardCvv.length >= 3 && cardName.trim()
  }

  // #conectarconBACKEND — procesar pago: reemplazar con POST /api/payments (monto, recompensa, token de tarjeta via Stripe/similar)
  // #conectarconBACKEND — registrar aporte: reemplazar con POST /api/contributions (campaignId, userId, amount, rewardId)
  async function handlePay() {
    setStatus('loading')
    setStep(3)
    await new Promise(r => setTimeout(r, 2000))
    // Simulate: cvv 999 = error
    if (cardCvv === '999') {
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  const stepLabels = ['Selección', 'Pago', 'Confirmación']

  return (
    <div className="min-h-screen bg-bg flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg fade-in">
        {/* Back */}
        <button onClick={() => navigate('campaign-page')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          EcoBottle — La botella biodegradable
        </button>

        {/* Steps indicator */}
        {step < 3 || status === 'loading' ? (
          <div className="flex items-center gap-2 mb-8">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  i + 1 < step ? 'bg-primary text-white' :
                  i + 1 === step ? 'bg-primary text-white ring-4 ring-primary/20' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium flex-1 ${i + 1 === step ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                {i < 2 && <div className={`h-px flex-1 ${i + 1 < step ? 'bg-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        ) : null}

        {/* Step 1: Select reward */}
        {step === 1 && (
          <div className="fade-in">
            <h1 className="font-display font-800 text-2xl text-gray-900 mb-2">Elige tu aporte</h1>
            <p className="text-gray-500 text-sm mb-6">Selecciona una recompensa o ingresa un monto personalizado.</p>

            <div className="space-y-3 mb-5">
              {rewardOptions.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setSelectedReward(r.id); setCustomAmount('') }}
                  className={`card-selectable w-full bg-white rounded-2xl border-2 p-4 text-left flex items-start gap-4 ${
                    selectedReward === r.id ? 'border-primary shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${selectedReward === r.id ? 'bg-primary-light' : 'bg-gray-100'}`}>
                    {r.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-sm">{r.title}</span>
                      <span className="font-display font-700 text-primary text-base">${r.min}+</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.description}</p>
                  </div>
                  {selectedReward === r.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">o ingresa un monto personalizado</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={e => { setCustomAmount(e.target.value); setSelectedReward(null) }}
                placeholder="Ej: 75"
                min={1}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {amount > 0 && (
              <div className="bg-primary-light rounded-xl px-4 py-3 mb-4 flex items-center justify-between fade-in">
                <span className="text-sm text-gray-700">Total a aportar</span>
                <span className="font-display font-700 text-primary text-xl">${amount}</span>
              </div>
            )}

            <button
              disabled={!amount}
              onClick={() => setStep(2)}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
                amount ? 'bg-primary text-white hover:bg-primary-hover shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="fade-in">
            <h1 className="font-display font-800 text-2xl text-gray-900 mb-2">Datos de pago</h1>
            <p className="text-gray-500 text-sm mb-6">
              Aportando <strong className="text-primary">${amount}</strong> a EcoBottle.
            </p>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              {/* Card visual */}
              <div className="h-36 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 relative overflow-hidden mb-2">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-10 -translate-x-6" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-white/40 text-xs font-medium">ImpulsaFund</div>
                    <div className="flex gap-1">
                      <div className="w-6 h-4 rounded-sm bg-red-500/80" />
                      <div className="w-6 h-4 rounded-sm bg-yellow-400/80 -ml-3" />
                    </div>
                  </div>
                  <div className="text-white font-mono text-base tracking-widest">
                    {cardNum || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex gap-6 mt-3">
                    <div>
                      <div className="text-white/40 text-xs">VENCE</div>
                      <div className="text-white text-xs font-mono">{cardExp || 'MM/AA'}</div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs">TITULAR</div>
                      <div className="text-white text-xs font-medium truncate max-w-32">{cardName.toUpperCase() || 'NOMBRE APELLIDO'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Número de tarjeta</label>
                <input
                  value={cardNum}
                  onChange={e => setCardNum(formatCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre en la tarjeta</label>
                <input
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  placeholder="Lucía Martínez"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Vencimiento</label>
                  <input
                    value={cardExp}
                    onChange={e => setCardExp(formatExp(e.target.value))}
                    placeholder="MM/AA"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                  <input
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary transition-all font-mono"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400">Usa CVV <strong>999</strong> para simular un error de pago.</p>
            </div>

            <div className="flex items-center gap-2 my-4 justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs text-gray-500 font-medium">Pago seguro · Conexión cifrada (HTTPS/TLS)</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900">${amount}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Comisión plataforma (5%)</span>
                <span className="font-semibold text-gray-900">${(amount * 0.05).toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-display font-800 text-primary text-lg">${(amount * 1.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
                Atrás
              </button>
              <button
                disabled={!canPay()}
                onClick={handlePay}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                  canPay() ? 'bg-primary text-white hover:bg-primary-hover shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirmar aporte
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && (
          <div className="fade-in text-center">
            {status === 'loading' && (
              <div className="py-16">
                <svg className="w-12 h-12 animate-spin text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <h2 className="font-display font-700 text-xl text-gray-900 mb-2">Procesando tu aporte...</h2>
                <p className="text-gray-500 text-sm">Esto tomará solo un momento.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="py-8 fade-in">
                <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display font-800 text-2xl text-gray-900 mb-2">¡Gracias por tu aporte!</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Tu apoyo de <strong className="text-primary font-bold">${amount}</strong> fue registrado con éxito. ¡Eres parte del cambio!
                </p>
                <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Campaña</span>
                    <span className="font-medium text-gray-900">EcoBottle</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recompensa</span>
                    <span className="font-medium text-gray-900">{selectedReward ? rewardOptions.find(r => r.id === selectedReward)?.title : 'Aporte libre'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monto</span>
                    <span className="font-bold text-primary">${(amount * 1.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha</span>
                    <span className="font-medium text-gray-900">{new Date().toLocaleDateString('es-AR')}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('campaign-page')}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Volver a la campaña
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="py-8 fade-in">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-display font-800 text-2xl text-gray-900 mb-2">No pudimos procesar tu aporte</h2>
                <p className="text-gray-500 text-sm mb-6">Por favor, verifica los datos de tu tarjeta e intenta nuevamente.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('campaign-page')}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => { setStep(2); setStatus('select') }}
                    className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
