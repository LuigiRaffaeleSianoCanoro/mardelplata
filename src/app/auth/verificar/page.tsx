import Link from "next/link";

export default function VerificarPage() {
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-ocean-800/50 backdrop-blur-xl rounded-3xl p-8 border border-ocean-600/30 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-ocean-300 to-ocean-700 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/>
              <polyline points="22,7 12,13 2,7"/>
              <path d="m16 19 2 2 4-4"/>
            </svg>
          </div>
          
          <h1 className="text-2xl font-display font-bold text-white mb-3">
            Revisa tu email
          </h1>
          <p className="text-ocean-200 mb-6">
            Te enviamos un link de verificación. Hace click en el link para activar tu cuenta y completar tu perfil.
          </p>
          
          <div className="bg-ocean-900/50 rounded-xl p-4 border border-ocean-600/30 mb-6">
            <p className="text-ocean-300 text-sm">
              Si no ves el email, revisa tu carpeta de spam.
            </p>
          </div>
          
          <Link 
            href="/auth/login"
            className="inline-flex items-center gap-2 text-ocean-400 hover:text-ocean-200 transition-colors font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
