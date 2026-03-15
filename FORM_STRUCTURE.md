# Estructura Visual del Formulario de Certificados

## 📐 Layout General

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║                                                       ║  │
│  ║  Nuevo Certificado de Calibración                   ║  │
│  ║  Registra los datos del certificado...              ║  │
│  ║                                                       ║  │
│  ║  ─────────────────────────────────────────────────  ║  │
│  ║                                                       ║  │
│  ║  📋 Seleccionar Hito de Calibración                 ║  │
│  ║  ┌─────────────────────────────────────────────┐   ║  │
│  ║  │ [Selecciona un hito de calibración...] ▼   │   ║  │
│  ║  └─────────────────────────────────────────────┘   ║  │
│  ║                                                       ║  │
│  ║  ─────────────────────────────────────────────────  ║  │
│  ║                                                       ║  │
│  ║  ℹ️  Tipo de Instrumento: Estación Total            ║  │
│  ║                                                       ║  │
│  ║  ─────────────────────────────────────────────────  ║  │
│  ║                                                       ║  │
│  ║  Datos del Certificado de Calibración              ║  │
│  ║  Completa todos los campos según el tipo...         ║  │
│  ║                                                       ║  │
│  ║  ┌──────────────────┐  ┌──────────────────┐        ║  │
│  ║  │ Empresa          │  │ Nº Certificado   │        ║  │
│  ║  │ [TopGeo]         │  │ [CERT-EST-...]   │        ║  │
│  ║  └──────────────────┘  └──────────────────┘        ║  │
│  ║                                                       ║  │
│  ║  ┌──────────────────┐  ┌──────────────────┐        ║  │
│  ║  │ Estado           │  │ Fecha Calibr.    │        ║  │
│  ║  │ [Vigente]        │  │ [2024-03-15]     │        ║  │
│  ║  └──────────────────┘  └──────────────────┘        ║  │
│  ║                                                       ║  │
│  ║  ┌──────────────────┐  ┌──────────────────┐        ║  │
│  ║  │ Responsable      │  │ Precisión H      │        ║  │
│  ║  │ [Ing. Carlos...] │  │ [2.5"]           │        ║  │
│  ║  └──────────────────┘  └──────────────────┘        ║  │
│  ║                                                       ║  │
│  ║  ┌──────────────────┐  ┌──────────────────┐        ║  │
│  ║  │ Precisión V      │  │ Precisión D      │        ║  │
│  ║  │ [2.5"]           │  │ [2mm + 2ppm]     │        ║  │
│  ║  └──────────────────┘  └──────────────────┘        ║  │
│  ║                                                       ║  │
│  ║        ┌──────────────────────┐                    ║  │
│  ║        │  [Guardar] (Submit)  │                    ║  │
│  ║        └──────────────────────┘                    ║  │
│  ║                                                       ║  │
│  ╚═══════════════════════════════════════════════════╝  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos Dinámicos Según Tipo de Instrumento

### ESTACIÓN TOTAL (Tipo 1)

```
PASO 1: Seleccionar Hito
   └─► Se obtiene: id_tipo = 1

PASO 2: Sistema detecta Estación Total
   └─► Muestra campos específicos:
       • Precisión Angular Horizontal (")
       • Precisión Angular Vertical (")
       • Precisión en Distancia (mm)

PASO 3: Campos base + específicos
   └─► Total de 8 campos
       ✓ Empresa
       ✓ Nº Certificado
       ✓ Estado
       ✓ Fecha Calibración
       ✓ Responsable
       ✓ Precisión H
       ✓ Precisión V
       ✓ Precisión D
```

### NIVEL (Tipo 2)

```
PASO 1: Seleccionar Hito
   └─► Se obtiene: id_tipo = 2

PASO 2: Sistema detecta Nivel
   └─► Muestra campos específicos:
       • Precisión Angular Vertical (")
       • Precisión en Distancia (mm/km)

PASO 3: Campos base + específicos
   └─► Total de 7 campos
       ✓ Empresa
       ✓ Nº Certificado
       ✓ Estado
       ✓ Fecha Calibración
       ✓ Responsable
       ✓ Precisión V
       ✓ Precisión D
```

### ANTENA GNSS (Tipo 3)

```
PASO 1: Seleccionar Hito
   └─► Se obtiene: id_tipo = 3

PASO 2: Sistema detecta Antena GNSS
   └─► Muestra campos específicos:
       • Precisión Horizontal (mm)
       • Precisión Vertical (mm)

PASO 3: Campos base + específicos
   └─► Total de 7 campos
       ✓ Empresa
       ✓ Nº Certificado
       ✓ Estado
       ✓ Fecha Calibración
       ✓ Responsable
       ✓ Precisión H
       ✓ Precisión V
```

---

## 🎨 Componentes Visuales

### Card Principal
```
┌──────────────────────────────────────────┐
│  Sombra: 0 10px 40px rgba(0,0,0,0.1)   │
│  Border-radius: 12px                    │
│  Fondo: Blanco (#ffffff)                │
│  Padding: 40px                          │
│  Max-width: 1400px                      │
└──────────────────────────────────────────┘
```

### Campos de Entrada
```
┌─────────────────────────────┐
│ Label (14px, gris)          │
│ ┌─────────────────────────┐ │
│ │ Contenido (16px, negro) │ │
│ └─────────────────────────┘ │
│ Border-radius: 6px          │
│ Border: 1px #d9d9d9       │
└─────────────────────────────┘
```

### Alert de Tipo de Instrumento
```
┌─────────────────────────────────────────┐
│ ℹ️  Tipo de Instrumento: Estación Total │
│                                         │
│ Color: info (azul)                      │
│ Border-left: 4px solid #0066cc        │
└─────────────────────────────────────────┘
```

### Botón de Envío
```
        ┌──────────────┐
        │   Guardar    │
        └──────────────┘
        Tipo: primary (azul)
        Width: auto
        Padding: 8px 24px
        Border-radius: 6px
```

---

## 📊 Grid Responsivo

### Desktop (>1200px)
```
┌─────────────────┬─────────────────┬─────────────────┐
│    Campo 1      │    Campo 2      │    Campo 3      │
├─────────────────┼─────────────────┼─────────────────┤
│    Campo 4      │    Campo 5      │    Campo 6      │
├─────────────────┼─────────────────┼─────────────────┤
│    Campo 7      │    Campo 8      │                 │
├─────────────────┴─────────────────┴─────────────────┤
│              [Botón Guardar]                         │
└──────────────────────────────────────────────────────┘

Grid: 3 columnas
minmax(280px, 1fr)
gap: 20px
```

### Tablet (768px - 1200px)
```
┌─────────────────┬─────────────────┐
│    Campo 1      │    Campo 2      │
├─────────────────┼─────────────────┤
│    Campo 3      │    Campo 4      │
├─────────────────┼─────────────────┤
│    Campo 5      │    Campo 6      │
├─────────────────┼─────────────────┤
│    Campo 7      │    Campo 8      │
├─────────────────┴─────────────────┤
│    [Botón Guardar]                │
└──────────────────────────────────┘

Grid: 2 columnas
minmax(280px, 1fr)
gap: 20px
```

### Móvil (<768px)
```
┌──────────────────────────┐
│      Campo 1             │
├──────────────────────────┤
│      Campo 2             │
├──────────────────────────┤
│      Campo 3             │
├──────────────────────────┤
│      Campo 4             │
├──────────────────────────┤
│      Campo 5             │
├──────────────────────────┤
│      Campo 6             │
├──────────────────────────┤
│      Campo 7             │
├──────────────────────────┤
│      Campo 8             │
├──────────────────────────┤
│ [Botón Guardar]          │
└──────────────────────────┘

Grid: 1 columna
100% ancho
gap: 20px
```

---

## 🎭 Estados del Formulario

### Estado Inicial
- Select de hito vacío
- No se muestran campos de certificado
- Solo visible el título y descripción

### Estado Intermedio
- Hito seleccionado
- Se muestra alerta de tipo de instrumento
- Campos específicos comienzan a renderizar

### Estado Completo
- Todos los campos visibles
- Formulario listo para completar
- Botón Guardar activo

### Estado de Carga
- Botón Guardar deshabilitado con spinner
- Envío POST en progreso
- Espera respuesta del servidor

### Estado de Éxito
- Modal de éxito mostrado
- Formulario se resetea
- Usuario puede ingresar nuevo certificado

---

## 🎨 Colores y Estilos

```
Paleta Principal:
├─ Primario: #0066cc (Azul profesional)
├─ Secundario: #0052a3 (Azul oscuro)
├─ Fondo Light: #f5f7fa (Gris muy claro)
├─ Fondo Dark: #c3cfe2 (Gris claro)
├─ Texto Primario: #1a1a1a (Negro)
├─ Texto Secundario: #666 (Gris)
├─ Texto Terciario: #999 (Gris claro)
├─ Border: #d9d9d9 (Gris muy claro)
├─ Éxito: #52c41a (Verde)
├─ Error: #f5222d (Rojo)
├─ Warning: #faad14 (Naranja)
└─ Info: #1890ff (Azul info)

Tipografía:
├─ Títulos H1: 32px, peso 700
├─ Títulos H2: 22px, peso 600
├─ Labels: 14px, peso 500
├─ Texto: 14px, peso 400
└─ Monospace: Monaco, Courier New
```

---

## 🔄 Transiciones y Animaciones

```
Entrada de la tarjeta (slideIn):
├─ Duration: 0.4s
├─ Timing: ease-out
└─ Transform: translateY(20px → 0px)

Hover en tarjeta:
├─ Box-shadow: 0 8px 25px rgba(0,0,0,0.12)
├─ Transform: translateY(-2px)
└─ Duration: 0.3s

Hover en campos:
├─ Border-color: #0066cc
├─ Box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)
└─ Duration: 0.2s
```

---

## 📱 Accesibilidad

```
Textos Alternativos:
├─ Labels claramente asociados a inputs
├─ Iconos con texto descriptivo
├─ Mensajes de error informativos
└─ Aria-labels donde sea necesario

Navegación:
├─ Tab order lógico
├─ Focus visible en todos los elementos
├─ Botones accesibles por teclado
└─ Enter para enviar formulario

Contraste:
├─ WCAG AA compliant
├─ Ratio 4.5:1 para texto pequeño
└─ Ratio 3:1 para texto grande
```
