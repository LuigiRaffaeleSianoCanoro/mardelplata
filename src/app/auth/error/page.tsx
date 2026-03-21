import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-ocean-800/50 backdrop-blur-xl rounded-3xl p-8 border border-ocean-600/30 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          
          <h1 className="text-2xl font-display font-bold text-white mb-3">
            Error de autenticación
          </h1>
          <p className="text-ocean-200 mb-6">
            Hubo un problema con tu inicio de sesión. Por favor intenta de nuevo.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/auth/login"
              className="w-full bg-ocean-400 hover:bg-ocean-300 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-ocean-400/40 text-center"
            >
              Volver al login
            </Link>
            <Link 
              href="/"
              className="text-ocean-400 hover:text-ocean-200 transition-colors font-medium"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
