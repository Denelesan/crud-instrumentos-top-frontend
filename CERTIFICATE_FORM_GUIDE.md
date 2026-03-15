# Guía de Uso - Formulario de Certificados de Calibración

## 📋 Descripción General

El nuevo formulario de certificados de calibración proporciona una interfaz profesional y dinámica para registrar certificados de calibración según el tipo de instrumento topográfico. El formulario se adapta automáticamente mostrando los campos específicos necesarios para cada tipo de instrumento.

---

## 🎯 Características Principales

### 1. **Interfaz Intuitiva y Profesional**
- Diseño moderno con tarjeta centralizada
- Fondo degradado elegante
- Animación suave al cargar
- Tipografía clara y jerárquica

### 2. **Formulario Dinámico**
El formulario se adapta según el tipo de instrumento:
- **Estación Total**: Muestra campos para precisiones horizontales, verticales y de distancia
- **Nivel**: Muestra campos para precisión vertical y de distancia
- **Antena GNSS**: Muestra campos para precisiones horizontales y verticales

### 3. **Campos Comunes**
Todos los formularios incluyen:
- Nº de Certificado
- Estado del Certificado
- Fecha de Calibración
- Responsable de Calibración
- Empresa (automáticamente poblada)

### 4. **Validación de Datos**
- Campos obligatorios con mensajes de error personalizados
- Validación automática al enviar el formulario
- Mensajes de éxito o error claros

---

## 🔧 Estructura Técnica

### Componentes Involucrados

#### Archivo Principal
```
src/components/form-create-calibration-certificated.js
```

#### Archivos de Estilos
```
src/styles/certificateForm.css        # Estilos del formulario principal
src/styles/certificateSummary.css     # Estilos del componente de resumen
```

#### Componente Complementario
```
src/components/certificate-summary.js  # Resumen de certificados registrados
```

### Flujo de Datos

```
1. Usuario selecciona un hito de calibración
   ↓
2. Se obtiene información del instrumento (tipo, empresa)
   ↓
3. Se muestran campos dinámicos según tipo
   ↓
4. Usuario completa el formulario
   ↓
5. Se validan los datos
   ↓
6. Se envía POST a: /api/calibration/agregar_certificado/
   ↓
7. Se actualiza la solicitud de calibración
   ↓
8. Se muestra mensaje de éxito
```

---

## 📝 Campos por Tipo de Instrumento

### ESTACIÓN TOTAL (id_tipo = 1)

#### Campos Comunes
| Campo | Tipo | Obligatorio | Ejemplo |
|-------|------|------------|---------|
| Nº de Certificado | text | ✓ | CERT-EST-2024-001 |
| Estado | select | ✓ | Vigente |
| Fecha de Calibración | date | ✓ | 2024-03-15 |
| Responsable | text | ✓ | Ing. Carlos Mendoza |

#### Campos Específicos
| Campo | Tipo | Obligatorio | Ejemplo | Unidad |
|-------|------|------------|---------|--------|
| Precisión Angular Horizontal | text | ✓ | 2.5 | " (segundos) |
| Precisión Angular Vertical | text | ✓ | 2.5 | " (segundos) |
| Precisión en Distancia | text | ✓ | 2mm + 2ppm | mm |

---

### NIVEL (id_tipo = 2)

#### Campos Comunes
| Campo | Tipo | Obligatorio | Ejemplo |
|-------|------|------------|---------|
| Nº de Certificado | text | ✓ | CERT-NIV-2024-002 |
| Estado | select | ✓ | Vigente |
| Fecha de Calibración | date | ✓ | 2024-03-10 |
| Responsable | text | ✓ | Ing. Patricia Gonzales |

#### Campos Específicos
| Campo | Tipo | Obligatorio | Ejemplo | Unidad |
|-------|------|------------|---------|--------|
| Precisión Angular Vertical | text | ✓ | 0.5 | " (segundos) |
| Precisión en Distancia | text | ✓ | 1.5 | mm/km |

---

### ANTENA GNSS (id_tipo = 3)

#### Campos Comunes
| Campo | Tipo | Obligatorio | Ejemplo |
|-------|------|------------|---------|
| Nº de Certificado | text | ✓ | CERT-ANT-2024-003 |
| Estado | select | ✓ | Vigente |
| Fecha de Calibración | date | ✓ | 2024-03-20 |
| Responsable | text | ✓ | Ing. Roberto Fernández |

#### Campos Específicos
| Campo | Tipo | Obligatorio | Ejemplo | Unidad |
|-------|------|------------|---------|--------|
| Precisión Horizontal | text | ✓ | 5mm + 1ppm | mm |
| Precisión Vertical | text | ✓ | 10mm + 1ppm | mm |

---

## 🎨 Diseño Visual

### Paleta de Colores
- **Primario**: #0066cc (Azul profesional)
- **Fondo**: Gradiente #f5f7fa → #c3cfe2
- **Texto**: #1a1a1a (Gris oscuro)
- **Secundario**: #666 (Gris medio)

### Tipografía
- **Títulos**: Familia serif/sans-serif, peso 700
- **Texto**: Roboto, peso 400-500

### Espaciado
- **Gap entre campos**: 20px
- **Padding tarjeta**: 40px
- **Margin títulos**: 20-30px

---

## 💾 Formato de Envío JSON

```json
{
  "n_certificado": "CERT-EST-2024-001",
  "id_estado_certif": 1,
  "fecha_certif": "2024-03-15",
  "responsable": "Ing. Carlos Mendoza Silva",
  "empresa": "TopGeo Solutions",
  "id_instru_calibr": 123,
  "id_tipo_instru": 1,
  "precision_angular_horizontal": "2.5",
  "precision_angular_vertical": "2.5",
  "precision_distancia": "2mm + 2ppm"
}
```

---

## 🧪 Datos de Prueba

Consulta el archivo `MOCK_DATA_CERTIFICADOS.md` para datos ficticios de prueba listos para usar.

### Ejemplo Rápido - Estación Total
```
Nº de Certificado: CERT-EST-2024-001
Estado: Vigente
Fecha: 2024-03-15
Responsable: Ing. Carlos Mendoza Silva
Precisión H: 2.5"
Precisión V: 2.5"
Precisión D: 2mm + 2ppm
```

---

## 🔌 Integración con Backend

### Endpoints Requeridos

#### 1. Obtener Estados de Certificado
```
GET /api/certificado_estado
Response: [
  { id_estado_calibr: 1, estado_calibr: "Vigente" },
  { id_estado_calibr: 2, estado_calibr: "Vencido" },
  ...
]
```

#### 2. Obtener Hitos de Calibración
```
GET /api/instrumento/calibraciones/:id_instrumento
Response: [
  { 
    id_instru_calibr: 123,
    id_solic_calibr: "SOL-001",
    empresa: "TopGeo",
    id_tipo: 1,
    fecha_ingreso: null
  },
  ...
]
```

#### 3. Crear Certificado
```
POST /api/calibration/agregar_certificado/
Body: { ...certificateData }
Response: { success: true, id: ... }
```

#### 4. Actualizar Solicitud
```
PUT /api/calibration/solicitud/:id_instru_calibr
Body: { ...updateData }
Response: { success: true }
```

---

## 📱 Responsividad

El formulario es completamente responsive:
- **Desktop**: Grid de 3 columnas
- **Tablet**: Grid de 2 columnas
- **Móvil**: Columna única

---

## ⚠️ Mensajes de Error

| Error | Causa | Solución |
|-------|-------|----------|
| "Por favor seleccione un hito de calibración" | Campo vacío | Seleccionar un hito válido |
| "Por favor ingrese el número de certificado" | Certificado vacío | Ingresar número válido |
| "Por favor seleccione el estado" | Estado no seleccionado | Seleccionar estado |
| "Error al ingresar el certificado" | Error en backend | Verificar conexión a servidor |

---

## 🚀 Próximas Mejoras Sugeridas

1. **Importar Certificados**
   - Agregar campo para cargar PDF del certificado
   - Validación de formato

2. **Historial**
   - Ver certificados anteriores
   - Estadísticas de calibración

3. **Notificaciones**
   - Alertas de certificados próximos a vencer
   - Recordatorios de calibración

4. **Reportes**
   - Exportar certificados a PDF
   - Generación de reportes periódicos

---

## 📞 Soporte

Para reportar bugs o sugerir mejoras, contacta al equipo de desarrollo.
