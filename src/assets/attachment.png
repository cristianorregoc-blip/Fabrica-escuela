Actúa como un diseñador de producto UX/UI senior especializado en plataformas SaaS y fintech. Necesito que diseñes el FRONT END completo (pantallas de alta fidelidad, navegables entre sí) de una plataforma web de crowdfunding llamada "ImpulsaFund" (puedes sustituir el nombre si generas uno propio más adecuado).

CONTEXTO DEL PRODUCTO
ImpulsaFund conecta a "Creadores de proyectos" que buscan financiación con "Patrocinadores" que aportan dinero a cambio de recompensas. La plataforma debe transmitir confianza, transparencia y profesionalismo (piensa en un híbrido entre Kickstarter e Indiegogo, pero con identidad propia).

SISTEMA DE DISEÑO (aplícalo de forma consistente en todas las pantallas)
- Estilo visual: moderno, limpio, minimalista, con acentos de color vibrantes para transmitir energía y confianza.
- Paleta de colores: 
  - Primario: un color vibrante (ej. morado o verde esmeralda) para CTAs principales.
  - Secundario: un color complementario para acciones secundarias.
  - Estados: verde para éxito/confirmación, rojo para errores, amarillo/naranja para advertencias, gris para estados deshabilitados.
  - Neutros: escala de grises para textos y fondos.
- Tipografía: una familia sans-serif moderna (ej. Inter, Poppins o similar), con jerarquía clara (H1, H2, H3, body, caption).
- Espaciado: sistema de 8px grid.
- Componentes con bordes redondeados suaves (8-12px), sombras sutiles para cards, y micro-interacciones (hover, focus, loading).
- Diseño responsive: prioriza escritorio (1440px) pero genera también la versión mobile (375px) de cada pantalla clave.
- Incluye un ícono de candado/HTTPS visible cerca de cualquier formulario que involucre datos de pago, para reforzar la sensación de seguridad.

COMPONENTES GLOBALES REUTILIZABLES
- Navbar superior: logo, links (Explorar proyectos, Cómo funciona), botones "Iniciar sesión" y "Registrarse" (cuando no hay sesión) o avatar/menú de usuario con su rol (cuando hay sesión).
- Footer simple con links institucionales.
- Sistema de botones: primario, secundario, texto, y estado deshabilitado/loading (con spinner).
- Inputs de texto con: label, placeholder, estado normal, estado focus, estado de error (borde rojo + mensaje de error debajo), estado de éxito (borde verde).
- Toasts/banners de notificación para mensajes globales de éxito o error.
- Modal de confirmación reutilizable.

---

PANTALLA 1 — REGISTRO (Historia de usuario 1)
Objetivo: un visitante se registra como Patrocinador o Creador mediante correo o redes sociales.

Elementos:
- Formulario centrado con: campo de correo electrónico, campo de contraseña (con ícono de mostrar/ocultar), selector de rol mediante dos tarjetas seleccionables ("Quiero ser Patrocinador" / "Quiero ser Creador de proyectos"), botón principal "Crear cuenta".
- Debajo o encima del formulario: botones de "Continuar con Google" y "Continuar con Facebook" (o similares), separados por un divisor "o regístrate con tu correo".
- Checklist de requisitos de contraseña visible en tiempo real debajo del campo de contraseña (ej. "Mínimo 8 caracteres", "Al menos 1 mayúscula", "Al menos 1 número", "Al menos 1 símbolo"), cada requisito con un ícono que cambia de gris a verde con check cuando se cumple.
- Link inferior: "¿Ya tienes cuenta? Inicia sesión".

Estados a diseñar:
1. Estado default (formulario vacío).
2. Estado de error "correo ya registrado": mensaje inline debajo del campo de correo: "Este correo ya está registrado. Intenta iniciar sesión o usa otro correo." + el botón de submit deshabilitado hasta corregir.
3. Estado de error "contraseña insegura": el checklist de requisitos resalta en rojo los que faltan, y el botón "Crear cuenta" permanece deshabilitado.
4. Estado de carga (loading) al enviar el formulario (spinner en el botón, máx. percepción de 2 segundos).
5. Estado de éxito: transición o pantalla breve de confirmación ("¡Cuenta creada! Redirigiendo a tu panel...") antes de llevar al dashboard según el rol elegido.

---

PANTALLA 2 — INICIO DE SESIÓN (Historia de usuario 2)
Objetivo: un usuario registrado ingresa con correo y contraseña.

Elementos:
- Formulario centrado con: campo de correo, campo de contraseña, checkbox "Recordarme", link "¿Olvidaste tu contraseña?", botón principal "Iniciar sesión".
- Opciones de login social (mismas que en registro).
- Link inferior: "¿No tienes cuenta? Regístrate".

Estados a diseñar:
1. Estado default.
2. Estado de error genérico: un banner o mensaje inline (NO específico) que diga algo como: "El correo o la contraseña son incorrectos." — Importante: el diseño NO debe sugerir visualmente cuál de los dos campos falló (ambos campos se marcan igual, sin distinción).
3. Estado de carga.
4. Estado de éxito → redirección al panel principal correspondiente al rol (dashboard de Creador o de Patrocinador).

---

PANTALLA 3 — CREAR/EDITAR CAMPAÑA (Historia de usuario 3)
Objetivo: un creador verificado registra los detalles de su campaña y la guarda como borrador.

Diseña esta pantalla como un formulario multi-sección (puede ser en pasos/tabs o como un solo scroll largo con secciones claramente separadas):
- Sección "Información básica": Título de la campaña (input), Descripción (textarea con contador de caracteres).
- Sección "Financiamiento" (campos obligatorios): Meta financiera (input numérico con símbolo de moneda), Duración/fecha límite (selector de fecha o número de días), Categoría (dropdown/select).
- Sección "Recompensas": lista dinámica donde se pueden añadir tarjetas de recompensa (título, descripción, monto mínimo, botón "+ Añadir recompensa").
- Sección "Medios": campo para añadir enlaces de video/imágenes (input de URL) + previsualización tipo thumbnail.
- Barra lateral o superior fija con dos botones: "Guardar como borrador" (secundario) y "Publicar" (primario, puede aparecer deshabilitado o con tooltip si aún faltan requisitos de publicación).
- Indicador visual de estado de la campaña (badge tipo "Borrador").

Estados a diseñar:
1. Formulario vacío.
2. Estado de error de validación: al intentar "Guardar como borrador" sin completar Meta, Duración o Categoría, cada campo obligatorio faltante se marca en rojo con mensaje "Este campo es obligatorio" y aparece un resumen tipo banner arriba: "Completa los campos obligatorios para guardar tu borrador."
3. Estado de éxito: toast/notificación "Borrador guardado correctamente" + el badge de estado cambia a "Borrador" y el usuario puede seguir editando.

---

PANTALLA 4 — PÁGINA PÚBLICA DE CAMPAÑA (Historia de usuario 4)
Objetivo: cualquier usuario visualiza el avance de una campaña activa.

Elementos:
- Header con imagen/video destacado de la campaña, título, nombre del creador.
- Panel lateral (sticky en desktop) con:
  - Barra de progreso visual (porcentaje recaudado vs. meta).
  - Monto recaudado (grande, destacado) y monto faltante para llegar a la meta (texto secundario).
  - Contador de tiempo restante con formato "X días : Y horas" (debe verse como un componente tipo countdown, actualizándose).
  - Número de patrocinadores.
  - Botón CTA "Apoyar este proyecto".
- Debajo: descripción completa de la campaña, galería de medios, sección de recompensas disponibles.

Estados a diseñar:
1. Campaña con progreso parcial (ej. 45% recaudado) — barra de progreso reflejando ese %.
2. Campaña recién publicada sin aportes aún (0% recaudado, barra vacía, mensaje "¡Sé el primero en apoyar este proyecto!").
3. Vista con contador de tiempo activo (ej. "12 días : 6 horas restantes").
4. (Opcional) Estado de campaña finalizada/vencida, mostrando "Campaña finalizada" en vez del contador.

---

PANTALLA 5 — FLUJO DE APORTE / SIMULACIÓN DE PAGO (Historia de usuario 5)
Objetivo: un patrocinador selecciona un monto o recompensa y simula el pago.

Diseña este flujo como un modal o una pantalla de checkout de 2-3 pasos:

Paso 1 — Selección de monto/recompensa:
- Tarjetas seleccionables con las recompensas disponibles (monto mínimo, descripción, ícono de "seleccionado" al elegir), o un input libre para "Aportar un monto personalizado".
- Botón "Continuar".

Paso 2 — Datos de pago (simulado):
- Formulario de tarjeta (número, fecha de expiración, CVV) puramente visual/simulado.
- Ícono/badge de "Pago seguro" con candado y texto "Conexión cifrada (HTTPS/TLS)" visible cerca del botón de confirmación, para reflejar el requisito no funcional de seguridad.
- Botón "Confirmar aporte".

Paso 3 — Resultado:
- Estado de ÉXITO: pantalla/modal de confirmación con ícono de check, mensaje "¡Gracias por tu aporte! Tu apoyo de $[monto] fue registrado con éxito.", resumen del aporte, botón "Volver a la campaña".
- Estado de ERROR: pantalla/modal con ícono de alerta, mensaje "No pudimos procesar tu aporte. Por favor, intenta nuevamente.", botón "Reintentar" y botón secundario "Cancelar".
- Estado de carga mientras se "procesa" el pago (spinner con mensaje "Procesando tu aporte...").

---

ENTREGABLES ESPERADOS
Genera los siguientes frames/pantallas, todos conectados con prototipo navegable (flujos de click entre pantallas):
1. Registro (con sus 3 estados de error/éxito)
2. Inicio de sesión (con estado de error genérico)
3. Dashboard de Creador (vista simple, solo como punto de llegada tras login/registro)
4. Dashboard de Patrocinador (vista simple, solo como punto de llegada tras login/registro)
5. Crear/Editar campaña (formulario con estados de validación)
6. Página pública de campaña (con progreso, monto faltante y contador)
7. Flujo de aporte (3 pasos: selección, pago simulado, confirmación/error)

Usa nombres de capas y frames ordenados y descriptivos (ej. "01_Registro_Default", "01_Registro_ErrorCorreo", etc.) para que sea fácil de navegar dentro de Figma.