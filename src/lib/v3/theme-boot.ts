/** Clave de localStorage para el tema del shell v3. */
export const THEME_KEY = "mdp-theme";

/**
 * Script inline para <head>: aplica el tema guardado antes del primer paint
 * y marca la sesión como «ya vista» para no repetir la animación del hero.
 */
export const THEME_BOOT_SCRIPT = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light')document.documentElement.setAttribute('data-mdp-theme','light');if(sessionStorage.getItem('v3-seen'))document.documentElement.classList.add('v3-seen');}catch(e){}`;
