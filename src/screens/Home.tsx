import { type Screen } from '../types'

interface Props {
  navigate: (s: Screen) => void
}

export default function Home({ navigate }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-md fade-in text-center">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-display font-800 text-2xl text-gray-900">ImpulsaFund</span>
        </div>

        <h1 className="font-display font-800 text-3xl sm:text-4xl text-gray-900 mb-3 leading-tight">
          Impulsa proyectos<br />que importan
        </h1>
        <p className="text-gray-500 text-base mb-10 leading-relaxed">
          La plataforma de crowdfunding para creadores con ideas y patrocinadores con propósito.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('register')}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-sm"
          >
            Crear una cuenta
          </button>
          <button
            onClick={() => navigate('login')}
            className="w-full py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>

        {/* Explore link */}
        <button
          onClick={() => navigate('campaign-page')}
          className="mt-8 text-sm text-gray-400 hover:text-primary transition-colors underline underline-offset-2"
        >
          Explorar campañas sin registrarse →
        </button>
      </div>
    </div>
  )
}
