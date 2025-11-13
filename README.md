# HomeStock

Una aplicación móvil y web para el control de inventario de artículos del hogar, desarrollada con React Native y Expo.

## 📥 Descargar APK

### Descarga 
Descarga la APK desde [GitHub Releases](https://github.com/Pekzer/HomeStock/releases/latest) para acceso permanente.

## 🎯 Características

- ✅ Agregar productos con nombre, cantidad y cantidad mínima
- ✅ Editar productos existentes
- ✅ Actualización rápida de cantidades (+1, +5, -1, -5)
- ✅ Notificaciones visuales de productos con stock bajo
- ✅ Eliminar productos
- ✅ Interfaz simple y eficiente
- ✅ Almacenamiento local persistente
- ✅ Compatible con iOS, Android y Web

## 🔧 Desarrollo

### Generar APK
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar proyecto
eas build:configure

# Configurar credenciales Android
eas credentials

# Generar APK
eas build --platform android --profile preview
```

### Builds Automáticos
Este proyecto incluye GitHub Actions para generar APKs automáticamente al crear tags de versión. Los builds se publican en [Releases](https://github.com/Pekzer/HomeStock/releases).

Para crear una nueva versión:
```bash
git tag v1.1.0
git push origin v1.1.0
```

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
- Usa el botón "📉 Stock Bajo" para filtrar solo estos productos

### Búsqueda y Ordenamiento
- **Buscar**: Escribe en el campo de búsqueda para filtrar por nombre
- **Ordenar**: Toca los botones de ordenamiento (Nombre, Cantidad, Stock)
- **Filtro**: El botón rojo filtra productos con stock bajo

## 🛠️ Tecnologías

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- EAS Build

## 📁 Estructura del Proyecto

```
HomeStock/
├── src/
│   ├── screens/        # Pantallas de la aplicación
│   │   ├── HomeScreen.tsx
│   │   ├── AddProductScreen.tsx
│   │   └── ProductDetailScreen.tsx
│   ├── services/       # Servicios (almacenamiento)
│   │   └── StorageService.ts
│   └── types/          # Definiciones de TypeScript
│       └── Product.ts
├── assets/             # Recursos
├── App.tsx             # Punto de entrada
├── index.ts            # Registro de la app
└── package.json        # Dependencias y scripts
```

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ usando React Native & Expo**


