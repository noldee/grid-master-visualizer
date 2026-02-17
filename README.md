# 🏗️ Grid Architect Pro

Un sistema de grids animado de alto rendimiento para React y Astro. No es solo un layout, es un **Visual Engine** que permite aplicar físicas reales, efectos 3D y sistemas de iluminación reactiva a tus componentes mediante Framer Motion y Tailwind CSS.

---

## ✨ Características Principales

- **4 Visual Engines**: Elige entre High-Tilt 3D, Perspective Soft, Magnetic Force, y Ray-Cast Spotlight
- **Ray-Cast Lighting**: Sistema de iluminación que baña los bordes y el interior de las tarjetas según la posición del mouse
- **Físicas de Resorte**: Animaciones fluidas a 120fps gracias a `useSpring` y `useMotionTemplate`
- **Totalmente Adaptable**: Soporte nativo para Dark Mode y layouts irregulares (Bento Grid)
- **Optimizado para NPM**: Tipado completo con TypeScript y directiva `"use client"` para compatibilidad con Next.js (App Router)
- **Zero Config**: Funciona out-of-the-box con configuración mínima

---

## 🚀 Instalación

Instala el paquete y sus dependencias peer:

```bash
npm install canvas-grid-ui framer-motion tailwindcss

```

> **Nota**: Este paquete requiere Tailwind CSS instalado en tu proyecto para procesar las clases de diseño.

### Configuración de Tailwind

Asegúrate de que tu `tailwind.config.js` incluya el contenido del paquete:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/canvas-grid-architect/**/*.{js,ts,jsx,tsx}',
  ],
  // ... resto de tu configuración
}
```

---

## 🕹️ Motores Visuales (Visual Engines)

| Motor | Descripción | Efecto |
|-------|-------------|--------|
| **High-Tilt 3D** | Profundidad agresiva | Rotación de 35° con elevación en eje Z |
| **Perspective Soft** | Minimalismo elegante | Rotación suave de 12° para interfaces limpias |
| **Magnetic Force** | Atracción física | La tarjeta sigue el cursor con desplazamiento real |
| **Ray-Cast Spotlight** | Iluminación de precisión | Crea un aura de luz que revela bordes y detalles |

---

## 💻 Ejemplos de Uso

### Uso Básico (React/Next.js/Astro)

```tsx
import { GridComponent } from 'canvas-grid-architect';

export default function MyGrid() {
  return (
    <GridComponent 
      columns={3} 
      gap="gap-6" 
      animation="High-Tilt 3D"
    >
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
        <h3 className="text-xl font-bold">Explora el 3D</h3>
      </div>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
        <h3 className="text-xl font-bold">Físicas Reales</h3>
      </div>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
        <h3 className="text-xl font-bold">NPM Ready</h3>
      </div>
    </GridComponent>
  );
}
```

### Layout Irregular (Estilo Bento Box)

Puedes usar las clases de Tailwind directamente en los hijos para crear diseños complejos:

```tsx
<GridComponent columns={4} gap="gap-4" animation="Ray-Cast Spotlight">
  <div className="col-span-2 row-span-2 p-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
    <h2 className="text-2xl font-bold text-white">Tarjeta Grande</h2>
  </div>
  <div className="col-span-2 p-6 bg-white dark:bg-gray-800 rounded-xl">
    <h3 className="text-lg font-semibold">Tarjeta Ancha</h3>
  </div>
  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
    <p>Card A</p>
  </div>
  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
    <p>Card B</p>
  </div>
</GridComponent>
```

### Comparación de Engines

```tsx
// High-Tilt 3D - Ideal para portfolios y landing pages
<GridComponent animation="High-Tilt 3D" columns={3}>
  {/* tus cards */}
</GridComponent>

// Perspective Soft - Perfecto para dashboards y aplicaciones
<GridComponent animation="Perspective Soft" columns={4}>
  {/* tus cards */}
</GridComponent>

// Magnetic Force - Excelente para galerías interactivas
<GridComponent animation="Magnetic Force" columns={3}>
  {/* tus cards */}
</GridComponent>

// Ray-Cast Spotlight - Impactante para hero sections
<GridComponent animation="Ray-Cast Spotlight" columns={2}>
  {/* tus cards */}
</GridComponent>
```

---

## ⚙️ API Reference

### Props del Componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `columns` | `number` | `3` | Número de columnas en desktop |
| `gap` | `string` | `"gap-6"` | Clase de Tailwind para el espaciado |
| `animation` | `"High-Tilt 3D"` \| `"Perspective Soft"` \| `"Magnetic Force"` \| `"Ray-Cast Spotlight"` | `"High-Tilt 3D"` | Define el motor visual a utilizar |
| `className` | `string` | `""` | Clases adicionales para el contenedor |
| `children` | `ReactNode` | - | Elementos hijos a renderizar en el grid |

---

## 🎨 Personalización

### Dark Mode

El componente respeta automáticamente el modo oscuro de Tailwind CSS:

```tsx
// Las clases dark: funcionan automáticamente
<div className="bg-white dark:bg-gray-900">
  {/* contenido */}
</div>
```

### Responsive Design

Personaliza el número de columnas por breakpoint:

```tsx
<GridComponent 
  columns={3}
  className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
>
  {/* contenido */}
</GridComponent>
```

---

## 🛠️ Desarrollo Local

Si deseas contribuir o modificar el componente:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/noldee/grid-master-visualizer.git
   cd grid-master-visualizer
   ```

2. **Instala dependencias**:
   ```bash
   npm install
   ```

3. **Compila el proyecto**:
   ```bash
   npm run build
   ```

4. **Ejecuta los tests**:
   ```bash
   npm test
   ```

---

## 📦 Compatibilidad

- ✅ React 18+
- ✅ Next.js 13+ (App Router)
- ✅ Astro 3+
- ✅ Tailwind CSS 3+
- ✅ Framer Motion 10+

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Roadmap

- [ ] Soporte para más engines visuales
- [ ] Modo de performance reducido para dispositivos de baja potencia
- [ ] Integración con animaciones de scroll (ScrollTrigger)
- [ ] Preset de temas predefinidos
- [ ] Playground interactivo online

---

## 📄 Licencia

MIT © [noldee](https://github.com/noldee)

---

## 🌟 Showcase

¿Usaste Grid Architect Pro en tu proyecto? ¡Abre un issue y comparte tu trabajo para aparecer aquí!

---

<div align="center">

**[Documentación](https://github.com/noldee/grid-master-visualizer#readme)** • **[Reportar Bug](https://github.com/noldee/grid-master-visualizer/issues)** • **[Solicitar Feature](https://github.com/noldee/grid-master-visualizer/issues)**

Hecho con ❤️ por [noldee](https://github.com/noldee)

</div>
