<<<<<<< Updated upstream
# HomeStock
=======
# README generado por IA

Una aplicación móvil y web para el control de inventario de artículos del hogar, desarrollada con React Native y Expo.

## 🎯 Características

- ✅ Agregar productos con nombre, cantidad y cantidad mínima
- ✅ Editar productos existentes
- ✅ Actualización rápida de cantidades (+1, +5, -1, -5)
- ✅ Notificaciones visuales de productos con stock bajo
- ✅ Eliminar productos
- ✅ Interfaz simple y eficiente
- ✅ Almacenamiento local persistente
- ✅ Compatible con iOS, Android y Web

## 🚀 Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/Pekzer/HomeStock.git
cd HomeStock
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar la aplicación:

Para Android:
```bash
npm run android
```

Para iOS:
```bash
npm run ios
```

Para Web:
```bash
npm run web
```

Para modo desarrollo (escanear QR con Expo Go):
```bash
npm start
```

## 📱 Uso

### Agregar un Producto
1. Toca el botón "+" en la pantalla principal
2. Ingresa el nombre del producto
3. Define la cantidad actual y la cantidad mínima
4. Guarda el producto

### Ver y Editar Productos
1. Toca cualquier producto en la lista para ver sus detalles
2. Usa los botones de actualización rápida para modificar la cantidad
3. Toca "Editar" para modificar todos los campos

### Productos con Stock Bajo
- Los productos con cantidad igual o menor a la mínima se destacan en rojo
- Aparece un contador en el encabezado con el número de productos con stock bajo

## 🛠️ Tecnologías

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage

## 📁 Estructura del Proyecto

```
HomeStock/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── screens/        # Pantallas de la aplicación
│   ├── services/       # Servicios (almacenamiento)
│   ├── types/          # Definiciones de TypeScript
│   └── utils/          # Utilidades
├── assets/             # Recursos (imágenes, fuentes)
├── App.tsx             # Punto de entrada de la aplicación
└── package.json        # Dependencias y scripts
```

## 📄 Licencia

MIT
>>>>>>> Stashed changes
