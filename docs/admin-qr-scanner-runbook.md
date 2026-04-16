# Admin QR Scanner Runbook

## Objetivo
Dejar operativo el scanner QR del admin para el inicio del evento, con un protocolo rapido de verificacion, diagnostico y contingencia.

## Pre-check (5 minutos antes de abrir puertas)
- Confirmar que la URL de admin abre en HTTPS (candado activo en navegador).
- Abrir `/admin/scanner` y seleccionar el evento correcto.
- Tocar `Iniciar Camara` y validar que aparece preview de video.
- Escanear 2 QR de prueba:
  - uno valido nuevo (debe registrar asistencia),
  - uno repetido (debe mostrar mensaje de duplicado).
- Confirmar que el ingreso manual tambien funciona.

## Matriz minima de QA (go/no-go)
Ejecutar antes del evento en dispositivos reales:

| Plataforma | Navegador | Dispositivo | Estado |
|---|---|---|---|
| iOS actual | Safari | iPhone 1 | ☐ |
| iOS actual | Safari | iPhone 2 (opcional) | ☐ |
| Android actual | Chrome | Android 1 | ☐ |
| Android actual | Chrome | Android 2 (opcional) | ☐ |

Casos a cubrir por cada dispositivo:
- Primer permiso de camara (Allow) y apertura correcta.
- Permiso denegado previamente y recuperacion manual.
- Camara ocupada por otra app/pestana y reintento exitoso.
- Reinicio de scanner (`Detener` -> `Iniciar`) sin congelarse.
- Lectura repetida del mismo QR sin duplicar asistencia.

### Criterio go/no-go
- Apertura de camara exitosa en al menos 95% de intentos.
- Registro de asistencia consistente para QR validos.
- No hay duplicados visibles al reescanear el mismo QR.
- Mensajes de error accionables cuando falla la camara.

## Diagnostico rapido por error

### "La camara requiere HTTPS"
- Abrir siempre el dominio final con certificado valido.
- No usar links `http://` ni iframes sin permisos.

### "Permiso de camara denegado"
- Rehabilitar permiso en configuracion del navegador/sitio.
- Cerrar y volver a abrir la pestana de admin.

### "No se encontro una camara disponible"
- Probar otro navegador/dispositivo.
- Verificar que no sea escritorio sin webcam.

### "La camara esta en uso por otra app o pestana"
- Cerrar WhatsApp/Instagram/Camera u otras apps usando camara.
- Cerrar otras pestanas con scanner o videollamadas.

### "No se pudo iniciar la camara seleccionada"
- Cambiar la camara en el selector de `Camara`.
- Volver a `Auto (preferir trasera)` y reintentar.

## Contingencia durante el evento
- Mantener 1-2 dispositivos backup ya logueados en admin.
- Si falla camara, usar ingreso manual de codigo QR.
- Si hay degradacion general:
  - registrar asistencia manualmente,
  - continuar ingreso para no frenar fila,
  - reconciliar al cierre.

## Operacion recomendada del staff
- Un operador principal escanea.
- Un operador secundario valida errores y fallback manual.
- Cada 20-30 minutos: reinicio controlado del scanner si se percibe lentitud.

