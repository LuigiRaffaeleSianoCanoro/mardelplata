import Link from "next/link";

export default function VerificarPage() {
  return (
    <div className="flex w-full max-w-md justify-center px-0">
      <div className="w-full">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-none">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-foreground">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"/>
              <polyline points="22,7 12,13 2,7"/>
              <path d="m16 19 2 2 4-4"/>
            </svg>
          </div>
          
          <h1 className="mb-3 font-sans text-2xl font-semibold tracking-tight text-foreground">
            Revisa tu email
          </h1>
          <p className="mb-6 text-muted-foreground">
            Te enviamos un link de verificación. Hace click en el link para activar tu cuenta y completar tu perfil.
          </p>
          
          <div className="mb-6 rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Si no ves el email, revisa tu carpeta de spam.
            </p>
          </div>
          
          <Link 
            href="/auth/login"
            className="inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
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
