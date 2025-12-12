
# Universidad Politecnica Salesiana
![Logo Institucional](https://upload.wikimedia.org/wikipedia/commons/b/b0/Logo_Universidad_Polit%C3%A9cnica_Salesiana_del_Ecuador.png)  

---

# 🚀 Portafolio Administrable - LeMiBit

## 👥 Integrantes

* **[Leo Vasonez]** – [Enlace a tu GitHub](https://github.com/LeoFV87)
* **[Michelle Morocho]** – [Enlace a GitHub](https://github.com/Michelle97-bit)

🔗 **Repositorio del Proyecto:** [Enlace a este repo](https://github.com/LeoFV87/icc-ppw-proyecto-portafolio.git)
🌐 **Demo Desplegado:** [https://tu-proyecto.web.app](https://proyecto-integrador-ppw.web.app)

---

## 🛠 Tecnologías Utilizadas

El proyecto utiliza una arquitectura **Serverless** moderna basada en:

### **Frontend: Angular 18**
* **Signals & Standalone Components:** Gestión de estado reactivo y modularidad moderna.
* **TailwindCSS + DaisyUI:** Con Tailwind y DaisiUI podemos hacer el diseño de interfaz responsivo y aparte de componentes visuales como modales, cards, tablas, etc.

### **Backend y Servicios: Firebase**
* **Authentication:** Inicio de sesión seguro el cual lo realizamos con Google o tambien se puede realizar usando el método Correo/Contraseña.
* **Firestore Database:** Es una base de datos NoSQL en tiempo real que nos sirve para poder gestionar usuarios, proyectos y solicitudes.
* **Hosting:** Este host del sitio se realiza desplegando la aplicación SPA.

---

## 📖 Descripción del Proyecto

**LeMiBit** es una aplicación la cual fue diseñada para así poder centralizar la presentación profesional de desarrolladores de código. La cual nos permite a los **Administradores** poder gestionar con total control el acceso a la plataforma, a los **Programadores** en cambio les permite el poder construir su portafolio detallado (separando proyectos académicos de laborales) y finalmente a los **Usuarios Generales** les permite poder explorar el talento y tambien poder solicitar asesorías técnicas.

Este sistema resuelve la necesidad que hay de validar y de organizar la experiencia técnica en un formato estandarizado y visualmente atractivo.

---

## 🔐 Roles y Funcionalidades

### ⚡ Administrador
* **Gestión de Usuarios:** Permite el acceso a la visualización de todos los registros que hay en el sistema.
* **Control de Roles:** Tiene la capacidad complete de ascender usuarios a "Programadores","Administradores" e incluso poder degradarlos a usuarios.
* **Modo Dios:** El administrador tiene el acceso completo a todas las rutas que se encuentran protegidas.

### 💻 Programador
* **Gestión de Portafolio:** Le permite al programador poder crear, editar y eliminar proyectos.
* **Clasificación:** Existe un etiquetado de los proyectos como "Académicos" 📚 o "Laborales" 💼.
* **Perfil Público:** Esto le permite al programador puede realizar la edición de su foto, biografía, especialidad y redes sociales en este caso LinkedIn/GitHub.
* **Buzón de Asesorías:** El buzon es un espacio que le permite al programador poder aceptar o rechazar solicitudes de clientes con justificación.

### 👤 Usuario General
* **Exploración:** Tiene la capacidad de poder realizar la búsqueda de programadores en la sección "Explorar".
* **Solicitudes:** Posee tambien la capacidad de solicitar asesorias seleccionando horarios disponibles.
* **Visualización:** El usuario puede ver los detalles completos esto incluye a los proyectos y tambien los demos.

---

## 📱 Módulos y Pantallas

1.  **Home / Landing:** El home contiene la vista de bienvenida y aparte contiene todos los programadores/creadores del sitio.
2.  **Auth (Login/Register):** Es un sistema de autenticación que contiene validaciones.
3.  **Panel Admin:** Es una tabla la cual nos permite la gestión de usuarios con acciones rápidas.
4.  **Mi Portafolio (Programador):** CRUD de proyectos con modal de edición.
5.  **Mi Perfil (Programador):** Contiene la configuración de datos públicos y redes sociales.
6.  **Explorar (Público):** Es un grid de tarjetas de programadores el cual contiene filtros visuales.
7.  **Detalle de Portafolio:** Esto es una vista pública del perfil y proyectos del programador de X programador.
8.  **Buzón de Solicitudes:** Es un buzon el cual permite la gestión de estados de citas (Pendiente, Aceptada, Rechazada).

---

## 🔄 Flujos Principales

### 1. Flujo de Portafolio
> El Programador ingresa a "Mis Proyectos" -> Luego llena el formulario (Título, Rol, Tipo) -> **Angular** envía los datos a la **Firestore** -> Y ya su información se refleja inmediatamente en la vista pública "Explorar".

###  2. Flujo de Asesoría
> El Usuario visita un perfil -> Luego hace clic en "Solicitar" -> Y llena el tema y horario.
> El Programador es el que recibe la solicitud en su panel -> Hace la revisión del tema -> Al dar clic en el boton "Aprobar", el sistema lo que hace es actualizar el estado en **Firebase** y termina generando un enlace de **WhatsApp** para así contactar al cliente.

---

## 💾 Fragmentos Técnicos muy Importantes

### 1. Simulación de Notificación (WhatsApp)
Código que es utilizado para poder generar el enlace dinámico de contacto al aprobar una solicitud:

```typescript
simulateNotification(request: AdvisoryRequest, status: string, message: string) {
  const action = status === 'accepted' ? 'ACEPTADA ✅' : 'RECHAZADA ❌';
  const text = `Hola ${request.clientName}, tu solicitud sobre "${request.topic}" ha sido ${action}. 
  Mensaje: ${message}`;
  
  // Apertura de API de WhatsApp
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
}
