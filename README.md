# Crudzocial-RoyalSociety

## Información del Equipo

**RoyalSociety:** 

**Integrantes:**
- Ian Aguirre
- Esteban González
- Emmanuel Pérez

## Descripción del Sistema

**Crudzocial** es una aplicación web de gestión de contenido personal que permite a los usuarios crear, editar y gestionar notas, imágenes y mantener un registro de actividades. El sistema está diseñado como una plataforma social con funcionalidades CRUD (Create, Read, Update, Delete) para diferentes tipos de contenido.

### Objetivo
El objetivo principal es proporcionar una interfaz intuitiva y moderna para que los usuarios puedan:
- Gestionar notas personales con etiquetas y categorías
- Subir y organizar imágenes en una galería personal
- Mantener un registro de todas las actividades realizadas
- Gestionar su perfil de usuario
- Tener una experiencia de usuario fluida y responsive

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y moderna
- **CSS3**: Estilos con Bulma CSS Framework
- **JavaScript (ES6+)**: Funcionalidad dinámica y modular
- **Bulma CSS**: Framework CSS para diseño responsive
- **Font Awesome**: Iconografía
- **Particles.js**: Efectos visuales en el login

### Almacenamiento
- **localStorage**: Persistencia de datos del usuario
- **sessionStorage**: Gestión de sesiones activas

### Características Técnicas
- **Modular JavaScript**: Uso de módulos ES6 para organización del código
- **Responsive Design**: Diseño adaptable a diferentes dispositivos
- **Single Page Application (SPA)**: Navegación fluida con iframes

## Cómo Ejecutar y Probar el Sistema

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, pero recomendado)

### Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone [URL-del-repositorio]
   cd Crudzocial
   ```

2. **Abrir el proyecto:**
   - Opción 1: Abrir `index.html` directamente en el navegador
   - Opción 2: Usar un servidor local:
     ```bash
     # Con Python 3
     python -m http.server 8000
     
     # Con Node.js (si tienes http-server instalado)
     npx http-server
     
     # Con PHP
     php -S localhost:8000
     ```

3. **Acceder a la aplicación:**
   - Navegar a `http://localhost:8000` (si usas servidor local)
   - O abrir `index.html` directamente

### Pruebas del Sistema

1. **Registro de Usuario:**
   - Ir a "Sign up" desde la página de login
   - Completar formulario con username, email y password
   - Verificar que se crea el usuario correctamente

2. **Login:**
   - Usar credenciales registradas
   - Verificar redirección a welcome page

3. **Funcionalidades CRUD:**
   - **Notas:** Crear, editar, eliminar notas con etiquetas
   - **Imágenes:** Subir, visualizar, eliminar imágenes
   - **Logs:** Ver historial de actividades
   - **Perfil:** Actualizar información personal

## Funcionalidades Implementadas

### Sistema de Autenticación
- **Registro de usuarios** con validación de campos
- **Login seguro** con verificación de credenciales
- **Gestión de sesiones** con sessionStorage
- **Logout** funcional

### Gestión de Notas
- **Crear notas** con título, contenido y etiquetas
- **Editar notas** existentes
- **Eliminar notas** con confirmación
- **Etiquetas personalizables** con diferentes colores
- **Fechas automáticas** de creación
- **Persistencia** en localStorage

### Gestión de Imágenes
- **Subida de imágenes** con drag & drop
- **Vista previa** de imágenes
- **Galería responsive** con grid layout
- **Modal de visualización** con navegación
- **Información detallada** (tamaño, fecha, tipo)
- **Eliminación** de imágenes

### Sistema de Logs
- **Registro automático** de todas las actividades
- **Historial personal** por usuario
- **Fechas y timestamps** precisos
- **Acciones registradas:**
  - Login/Logout
  - Creación/edición/eliminación de notas
  - Subida/eliminación de imágenes
  - Actualización de perfil

### Gestión de Perfil
- **Información personal** editable
- **Campos:** nombres, apellidos, email, teléfono, país, ciudad, dirección, código postal
- **Persistencia** de datos
- **Validación** de campos

### Interfaz de Usuario
- **Diseño responsive** con Bulma CSS
- **Navegación lateral** con iframe
- **Notificaciones** en tiempo real
- **Efectos visuales** con particles.js
- **Iconografía** con Font Awesome

## Uso de localStorage y sessionStorage

### localStorage
Se utiliza para persistencia de datos a largo plazo:

```javascript
// Almacenamiento de usuarios
localStorage.setItem('users', JSON.stringify(users));

// Almacenamiento de notas
localStorage.setItem('notas', JSON.stringify(notas));

// Almacenamiento de imágenes
localStorage.setItem('userImages', JSON.stringify(images));

// Almacenamiento de logs
localStorage.setItem('userLogs', JSON.stringify(userLogs));
```

### sessionStorage
Se utiliza para gestión de sesiones activas:

```javascript
// Usuario activo durante la sesión
sessionStorage.setItem('activeUser', JSON.stringify(user));

// Recuperación del usuario activo
const activeUser = JSON.parse(sessionStorage.getItem('activeUser'));
```

## Funciones Implementadas

### Funciones de Autenticación
- `loadUsers()`: Carga usuarios desde localStorage
- `loadExistingUser(username)`: Verifica existencia de usuario
- `isFilledFields()`: Valida campos requeridos
- `isUserValid()`: Verifica usuario existente
- `isPasswordValid()`: Valida contraseña

### Funciones de Gestión de Contenido
- `generarIdUnico()`: Crea IDs únicos para elementos
- `cargarNotas()`: Carga notas desde localStorage
- `guardarNotas()`: Persiste notas en localStorage
- `renderizarNotas()`: Muestra notas en la UI
- `addImage()`: Añade nueva imagen
- `removeImage()`: Elimina imagen

### Funciones de Logs
- `addUserLog()`: Registra actividad del usuario
- `loadUserLogs()`: Carga logs desde localStorage
- `getUserLogs()`: Obtiene logs de usuario específico
- `renderLogs()`: Muestra logs en la interfaz

## Permisos Adicionales al Admin

El sistema incluye funcionalidades especiales para administradores:

### Funcionalidades de Admin
- **Acceso completo** a todos los logs del sistema
- **Gestión de usuarios** (visualización de todos los usuarios)
- **Monitoreo de actividades** de todos los usuarios
- **Acceso privilegiado** a funcionalidades avanzadas

### Implementación de Permisos
```javascript
// Verificación de permisos de admin
function isAdmin(user) {
    return user.role === 'admin' || user.username === 'admin';
}

// Acceso condicional a funcionalidades
if (isAdmin(activeUser)) {
    // Mostrar funcionalidades de admin
    showAdminFeatures();
}
```

## Sistema de Logs

### Estructura de Logs
```javascript
{
    "username": [
        {
            "action": "Inicio de sesión exitoso",
            "date": "2024-01-15T10:30:00.000Z"
        },
        {
            "action": "Creación de nota",
            "date": "2024-01-15T10:35:00.000Z"
        }
    ]
}
```

### Acciones Registradas
- Login/Logout de usuarios
- Registro de nuevos usuarios
- Creación de notas
- Edición de notas
- Eliminación de notas
- Subida de imágenes
- Eliminación de imágenes
- Actualización de perfil

## Qué Aprendimos como Equipo

### Habilidades Técnicas
- **Desarrollo Frontend** con HTML5, CSS3 y JavaScript moderno
- **Gestión de estado** con localStorage y sessionStorage
- **Arquitectura modular** con ES6 modules
- **Diseño responsive** con frameworks CSS
- **Manejo de archivos** y gestión de imágenes
- **Validación de formularios** y manejo de errores

### Habilidades de Trabajo en Equipo
- **Colaboración** en desarrollo de funcionalidades
- **Organización** de código y estructura de proyecto
- **Comunicación** efectiva entre miembros del equipo
- **Resolución de conflictos** en el código
- **Planificación** y distribución de tareas

### Aprendizajes Específicos
- **Gestión de sesiones** y autenticación
- **CRUD operations** en aplicaciones web
- **Persistencia de datos** en el navegador
- **Interfaz de usuario** intuitiva y moderna
- **Logging y auditoría** de actividades
- **Manejo de archivos** multimedia

## Estado Actual del Proyecto

### Funcionalidades Completadas
- [x] Sistema de autenticación completo
- [x] Gestión CRUD de notas
- [x] Gestión de imágenes con galería
- [x] Sistema de logs funcional
- [x] Gestión de perfil de usuario
- [x] Interfaz responsive y moderna
- [x] Persistencia de datos con localStorage
- [x] Gestión de sesiones con sessionStorage

### Funcionalidades en Desarrollo
- [ ] Sistema de roles y permisos avanzado
- [ ] Exportación de datos
- [ ] Búsqueda y filtros avanzados
- [ ] Temas personalizables
- [ ] Notificaciones push

### Próximas Mejoras
- [ ] Integración con backend
- [ ] Base de datos persistente
- [ ] Autenticación con OAuth
- [ ] Compartir contenido entre usuarios
- [ ] API REST para integración externa

### Métricas del Proyecto
- **Líneas de código:** ~2,000+ líneas
- **Archivos JavaScript:** 9 módulos
- **Páginas HTML:** 7 páginas
- **Estilos CSS:** 5 archivos
- **Funcionalidades principales:** 5 módulos

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2024  
**Estado:** Funcional y estable