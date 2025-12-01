# Pizzería Nápoles - E-commerce

Trabajo final del curso de React - E-commerce de pizzería con carrito de compras y conexión a Firebase.

## Descripción del Proyecto

Este proyecto es una aplicación web de e-commerce desarrollada con React que permite a los usuarios navegar por un catálogo de pizzas, agregarlas al carrito de compras y finalizar la compra. Los productos y las órdenes se almacenan en Firebase Firestore.

## Tecnologías Utilizadas

- **React** 18.2.0
- **React Router DOM** 6.14.1 - Para la navegación
- **Vite** 5.1.0 - Herramienta de desarrollo
- **Firebase** - Base de datos (Firestore)
- **Bootstrap** 5 - Estilos (CDN)
- **Context API** - Gestión del estado del carrito

## Funcionalidades Principales

- Navegación entre vistas (catálogo, detalle, carrito, checkout)
- Filtrado de productos por categoría
- Carrito de compras con persistencia en localStorage
- Validación de stock disponible
- Formulario de checkout con validaciones
- Guardado de órdenes en Firebase Firestore
- Confirmación de compra con ID de orden

## Requisitos Previos

- Node.js versión 14 o superior
- npm (incluido con Node.js)
- Cuenta de Firebase con proyecto configurado

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd e-commerce-Pizzeria-Napoles
```

2. Instalar las dependencias:
```bash
npm install --legacy-peer-deps
```

3. Configurar Firebase:
   - Crear un archivo `.env` en la raíz del proyecto
   - Copiar el contenido de `.env.example` y completar con las credenciales de Firebase
   - Las credenciales se obtienen desde Firebase Console

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación se ejecutará en `http://localhost:5173`

## Estructura del Proyecto

```
src/
├── components/          # Componentes de React
│   ├── NavBar.jsx
│   ├── CartWidget.jsx
│   ├── ItemListContainer.jsx
│   ├── ItemList.jsx
│   ├── ItemDetailContainer.jsx
│   ├── ItemDetail.jsx
│   ├── ItemCount.jsx
│   ├── Cart.jsx
│   ├── CartItem.jsx
│   ├── CheckoutForm.jsx
│   ├── OrderConfirmation.jsx
│   ├── Loader.jsx
│   ├── Contact.jsx
│   └── NotFound.jsx
├── context/            # Context API
│   └── CartContext.jsx
├── services/           # Servicios de Firebase
│   ├── firebase.js
│   └── firestore.js
├── data/              # Datos locales
│   └── products.js
├── assets/            # Recursos (imágenes)
├── App.jsx
├── main.jsx
└── index.css
```

## Configuración de Firebase

Para que el proyecto funcione correctamente es necesario configurar Firebase:

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Firestore Database
3. Obtener las credenciales de configuración
4. Crear el archivo `.env` con las credenciales (ver `.env.example`)

Para instrucciones detalladas, consultar el archivo `FIREBASE_GUIDE.md`.

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea el build de producción
- `npm run preview` - Previsualiza el build de producción

## Uso de la Aplicación

1. Al ingresar se visualiza el catálogo completo de productos
2. Se pueden filtrar los productos por categoría desde el menú
3. Al hacer clic en "Ver Detalles" se accede a la información completa del producto
4. Desde el detalle se puede seleccionar la cantidad y agregar al carrito
5. El ícono del carrito en la barra de navegación muestra la cantidad de productos
6. En la vista del carrito se pueden modificar las cantidades o eliminar productos
7. Al presionar "Finalizar Compra" se accede al formulario de datos personales
8. Una vez completado el formulario, se genera una orden que se guarda en Firestore
9. Se muestra una confirmación con el ID de la orden generada

## Consideraciones

- El stock de los productos se valida al momento de agregar al carrito
- El carrito se persiste en localStorage para mantener los datos entre sesiones
- Las credenciales de Firebase no deben subirse al repositorio (usar `.env`)
- El archivo `.env` debe compartirse por separado con el profesor

## Autor

Maximo Calamante

## Entrega del Proyecto

Este proyecto fue desarrollado como trabajo final para el curso de React.

