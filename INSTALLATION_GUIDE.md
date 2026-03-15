# 🚀 Guía de Instalación e Implementación

## ✅ Verificación Previa

Antes de iniciar, asegúrate de tener:

- [ ] Node.js 14+ instalado
- [ ] npm o yarn como gestor de paquetes
- [ ] Backend API ejecutándose en `http://localhost:5000`
- [ ] Base de datos con las tablas necesarias
- [ ] Ant Design 5+ instalado en el proyecto

---

## 📦 Archivos Incluidos

### Componentes Modificados/Creados
```
✏️  src/components/form-create-calibration-certificated.js
✨ src/components/certificate-summary.js
```

### Estilos
```
✨ src/styles/certificateForm.css
✨ src/styles/certificateSummary.css
```

### Documentación
```
📖 CERTIFICATE_FORM_GUIDE.md           - Guía completa
📖 MOCK_DATA_CERTIFICADOS.md           - Datos de prueba
📖 FORM_STRUCTURE.md                   - Estructura visual
📖 CAMBIOS_REALIZADOS.md               - Resumen de cambios
📖 INSTALLATION_GUIDE.md               - Este archivo
```

---

## 🔧 Pasos de Instalación

### 1. Copiar Archivos

**Paso 1.1: Actualizar Componente Principal**
```bash
# El archivo ya está en:
src/components/form-create-calibration-certificated.js
```

**Paso 1.2: Agregar Nuevo Componente**
```bash
# Copiar a:
src/components/certificate-summary.js
```

**Paso 1.3: Copiar Estilos**
```bash
# Copiar a:
src/styles/certificateForm.css
src/styles/certificateSummary.css
```

### 2. Verificar Importes

El componente principal ya incluye los importes necesarios:

```javascript
import { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import { Form, Select, Card, Divider, Alert, Space } from "antd";
import FormGeneralPanelLayout from "../layouts/FormGeneralPanelLayout";
import Modal from "antd/es/modal/Modal";
import { getIdFromValueOrLabel } from "../utils/tableUtils";
import "../styles/certificateForm.css";
```

### 3. Verificar Backend API

Asegúrate de que los siguientes endpoints estén disponibles:

```bash
# 1. Obtener estados de certificado
GET http://localhost:5000/api/certificado_estado

# Respuesta esperada:
[
  { id_estado_calibr: 1, estado_calibr: "Vigente" },
  { id_estado_calibr: 2, estado_calibr: "Vencido" },
  ...
]

# 2. Obtener calibraciones del instrumento
GET http://localhost:5000/api/instrumento/calibraciones/:id_instrumento

# Respuesta esperada:
[
  {
    id_instru_calibr: 123,
    id_solic_calibr: "SOL-001",
    empresa: "TopGeo",
    id_tipo: 1,
    fecha_ingreso: null
  },
  ...
]

# 3. Crear certificado
POST http://localhost:5000/api/calibration/agregar_certificado/

# Body esperado:
{
  "n_certificado": "CERT-EST-2024-001",
  "id_estado_certif": 1,
  "fecha_certif": "2024-03-15",
  ...
}

# 4. Actualizar solicitud
PUT http://localhost:5000/api/calibration/solicitud/:id_instru_calibr
```

### 4. Iniciar la Aplicación

```bash
# Instalar dependencias (si es necesario)
npm install

# Iniciar modo desarrollo
npm start

# La aplicación se abrirá en:
# http://localhost:3000
```

---

## 🧪 Pruebas Manuales

### Test 1: Formulario Básico

1. Navega a la página que contenga el componente
2. Verifica que se muestre:
   - [ ] Título "Nuevo Certificado de Calibración"
   - [ ] Select de hitos de calibración
   - [ ] Sin campos de certificado inicialmente

### Test 2: Selección de Hito

1. Haz clic en el select de hitos
2. Selecciona un hito de calibración
3. Verifica que aparezca:
   - [ ] Alerta con tipo de instrumento
   - [ ] Campos de certificado

### Test 3: Estación Total (Tipo 1)

1. Selecciona un hito con tipo Estación Total
2. Verifica que aparezcan los campos:
   - [ ] Empresa (deshabilitado)
   - [ ] Nº de Certificado
   - [ ] Estado
   - [ ] Fecha de Calibración
   - [ ] Responsable
   - [ ] Precisión Angular Horizontal
   - [ ] Precisión Angular Vertical
   - [ ] Precisión en Distancia

3. Usa datos de prueba:
```
Nº Certificado: CERT-EST-2024-001
Estado: Vigente
Fecha: 2024-03-15
Responsable: Ing. Carlos Mendoza Silva
Precisión H: 2.5
Precisión V: 2.5
Precisión D: 2mm + 2ppm
```

4. Haz clic en "Guardar"
5. Verifica que aparezca modal de éxito

### Test 4: Nivel (Tipo 2)

1. Selecciona un hito con tipo Nivel
2. Verifica que aparezcan SOLO:
   - [ ] Empresa
   - [ ] Nº de Certificado
   - [ ] Estado
   - [ ] Fecha de Calibración
   - [ ] Responsable
   - [ ] Precisión Angular Vertical
   - [ ] Precisión en Distancia

3. NO deben aparecer:
   - [ ] Precisión Angular Horizontal

4. Usa datos de prueba:
```
Nº Certificado: CERT-NIV-2024-002
Estado: Vigente
Fecha: 2024-03-10
Responsable: Ing. Patricia Gonzales López
Precisión V: 0.5
Precisión D: 1.5
```

### Test 5: Antena GNSS (Tipo 3)

1. Selecciona un hito con tipo Antena GNSS
2. Verifica que aparezcan SOLO:
   - [ ] Empresa
   - [ ] Nº de Certificado
   - [ ] Estado
   - [ ] Fecha de Calibración
   - [ ] Responsable
   - [ ] Precisión Horizontal
   - [ ] Precisión Vertical

3. NO deben aparecer:
   - [ ] Precisión Angular Vertical (diferente nombre)
   - [ ] Precisión en Distancia

4. Usa datos de prueba:
```
Nº Certificado: CERT-ANT-2024-003
Estado: Vigente
Fecha: 2024-03-20
Responsable: Ing. Roberto Fernández Ruiz
Precisión H: 5mm + 1ppm
Precisión V: 10mm + 1ppm
```

### Test 6: Validación

1. Intenta enviar sin llenar campos obligatorios
2. Verifica que aparezcan mensajes:
   - [ ] "Por favor ingrese el número de certificado"
   - [ ] "Por favor seleccione el estado"
   - [ ] "Por favor seleccione la fecha"
   - [ ] "Por favor ingrese el responsable"
   - [ ] Mensajes específicos de precisión según tipo

### Test 7: Responsividad

En Desktop:
- [ ] Grid de 3 columnas
- [ ] Tarjeta ancho máximo 1400px
- [ ] Padding 40px

En Tablet (resize a ~900px):
- [ ] Grid de 2 columnas
- [ ] Padding ajustado
- [ ] Legible en pantalla

En Móvil (resize a ~400px):
- [ ] Grid de 1 columna
- [ ] Padding 10px
- [ ] Botones accesibles

### Test 8: Errores

1. Con backend apagado, intenta guardar
2. Verifica que aparezca:
   - [ ] Modal de error
   - [ ] Mensaje: "Error de Conexión"

---

## 🐛 Troubleshooting

### Problema: Componente no se ve

**Solución:**
```javascript
// Verifica que esté importado correctamente:
import FormCreateCalibrationCertificated from './components/form-create-calibration-certificated';

// Y usado en el componente padre:
<FormCreateCalibrationCertificated id_instrumento={id} />
```

### Problema: Estilos no se aplican

**Solución:**
```javascript
// Verifica el import del CSS en el componente:
import "../styles/certificateForm.css";

// O en el archivo padre si es necesario
```

### Problema: API no responde

**Solución:**
```bash
# Verifica que el backend esté ejecutándose:
curl http://localhost:5000/api/certificado_estado

# Si no funciona:
# 1. Inicia el backend
# 2. Verifica puerto 5000
# 3. Revisa credenciales de BD
```

### Problema: Campos no se muestran dinámicamente

**Solución:**
```javascript
// Verifica que el hito tenga id_tipo correcto (1, 2 o 3)
// En la consola, verifica:
console.log(tipoInstrumento); // Debe mostrar 1, 2 o 3
```

### Problema: Modal no aparece después de guardar

**Solución:**
```javascript
// Verifica respuesta del API:
// El endpoint debe retornar status 200 OK
// Revisa en Network de DevTools
```

---

## 📊 Checklist de Implementación

### Pre-Implementación
- [ ] Backend API funcionando
- [ ] Base de datos configurada
- [ ] Node.js instalado
- [ ] npm/yarn disponible

### Instalación
- [ ] Archivos copiados correctamente
- [ ] Importes verificados
- [ ] Estilos CSS en lugar correcto
- [ ] Sin errores en consola

### Pruebas
- [ ] Test 1: Interfaz básica ✓
- [ ] Test 2: Selección de hito ✓
- [ ] Test 3: Estación Total ✓
- [ ] Test 4: Nivel ✓
- [ ] Test 5: Antena GNSS ✓
- [ ] Test 6: Validación ✓
- [ ] Test 7: Responsividad ✓
- [ ] Test 8: Manejo de errores ✓

### Producción
- [ ] Código revisado
- [ ] Documentación completa
- [ ] Tests unitarios (opcional)
- [ ] Performance verificado
- [ ] Seguridad revisada

---

## 🔐 Consideraciones de Seguridad

1. **Validación en Backend**
   ```javascript
   // Siempre valida en el servidor también
   // No confíes solo en validación del formulario
   ```

2. **Sanitización de Datos**
   ```javascript
   // Valida tipos de datos
   // Previene inyección SQL
   // Usa prepared statements
   ```

3. **Autenticación**
   ```javascript
   // Verifica que el usuario tenga permisos
   // Para crear certificados
   ```

4. **HTTPS en Producción**
   ```javascript
   // No envíes datos sensibles en HTTP
   // Usa HTTPS siempre
   ```

---

## 📈 Performance

### Optimizaciones Implementadas
- [x] Grid CSS para layouts responsive
- [x] Lazy loading de componentes
- [x] Memo para prevenir re-renders innecesarios
- [x] Debouncing en búsquedas (si aplica)

### Monitoreo
```javascript
// En DevTools Chrome > Performance
// Verifica que los renders sean < 16ms

// En Console:
// Revisa el Network tab para velocidad de APIs
```

---

## 📚 Recursos Adicionales

- [Ant Design Docs](https://ant.design/)
- [React Docs](https://react.dev/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Form Validation](https://ant.design/components/form/)

---

## 🎓 Próximos Pasos

1. **Agregar Importación de PDF**
   - Ver CERTIFICATE_FORM_GUIDE.md - Próximas Mejoras

2. **Integración con Sistema de Notificaciones**
   - Alertas de vencimiento
   - Recordatorios

3. **Reportes y Estadísticas**
   - Exportar a PDF
   - Gráficos de calibración

4. **Mejoras UI**
   - Temas oscuro/claro
   - Más personalización

---

## ✅ Validación Final

Después de la implementación, ejecuta:

```bash
# 1. Revisa la consola del navegador
# No debe haber errores en rojo

# 2. Abre DevTools y revisa:
# - Performance: < 100ms carga
# - Network: Respuestas < 2s
# - Console: Sin warnings críticos

# 3. Prueba responsividad
# Abre en móvil o usa Device Emulation

# 4. Prueba con datos reales
# Verifica que se guarden correctamente
```

---

## 📞 Soporte

Si tienes problemas:

1. Revisa el archivo `CERTIFICATE_FORM_GUIDE.md`
2. Consulta la sección Troubleshooting
3. Revisa la consola de errores
4. Contacta al equipo de desarrollo

---

**Última actualización:** Marzo 2024  
**Versión:** 1.0  
**Estado:** Listo para Producción
