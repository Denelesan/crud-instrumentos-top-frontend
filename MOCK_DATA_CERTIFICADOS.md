# Datos Ficticios para Pruebas - Certificados de Calibración

## Instrucción General
Para pruebas locales con base de datos local, usa los siguientes datos inventados según el tipo de instrumento.

---

## 1. ESTACIÓN TOTAL

### Datos Básicos del Certificado
- **Nº de Certificado:** `CERT-EST-2024-001`
- **Tipo de Instrumento:** Estación Total
- **Estado:** Vigente
- **Responsable:** Ing. Carlos Mendoza Silva
- **Fecha Calibración:** 2024-03-15

### Datos de Precisión (Específicos de Estación Total)
- **Precisión Angular Horizontal:** `2.5"` (segundos de arco)
- **Precisión Angular Vertical:** `2.5"` (segundos de arco)
- **Precisión en Distancia:** `2mm + 2ppm`

### Metadata
- **Empresa:** TopGeo Solutions
- **Laboratorio Calibrador:** NIST Certified Lab
- **Norma Aplicada:** ISO 17123-3

---

## 2. NIVEL

### Datos Básicos del Certificado
- **Nº de Certificado:** `CERT-NIV-2024-002`
- **Tipo de Instrumento:** Nivel
- **Estado:** Vigente
- **Responsable:** Ing. Patricia Gonzales López
- **Fecha Calibración:** 2024-03-10

### Datos de Precisión (Específicos de Nivel)
- **Precisión Angular Vertical:** `0.5"` (segundos de arco)
- **Precisión en Distancia:** `1.5 mm/km`

### Metadata
- **Empresa:** TopGeo Solutions
- **Laboratorio Calibrador:** NIST Certified Lab
- **Norma Aplicada:** ISO 17123-2

---

## 3. ANTENA GNSS

### Datos Básicos del Certificado
- **Nº de Certificado:** `CERT-ANT-2024-003`
- **Tipo de Instrumento:** Antena GNSS
- **Estado:** Vigente
- **Responsable:** Ing. Roberto Fernández Ruiz
- **Fecha Calibración:** 2024-03-20

### Datos de Precisión (Específicos de Antena GNSS)
- **Precisión Horizontal:** `5mm + 1ppm`
- **Precisión Vertical:** `10mm + 1ppm`

### Metadata
- **Empresa:** TopGeo Solutions
- **Laboratorio Calibrador:** Trimble Calibration Center
- **Norma Aplicada:** ISO 17123-8

---

## Estados Disponibles (Comunes a todos)
1. **Vigente** - Certificado actualmente válido
2. **Vencido** - Certificado expirado, requiere recalibración
3. **En Revisión** - Certificado en proceso de evaluación
4. **Cancelado** - Certificado anulado

---

## Notas para Desarrollo

### Estructura de la Respuesta del Formulario (JSON)
```json
{
  "n_certificado": "CERT-EST-2024-001",
  "id_estado_certif": 1,
  "fecha_certif": "2024-03-15",
  "responsable": "Ing. Carlos Mendoza Silva",
  "empresa": "TopGeo Solutions",
  "id_tipo_instru": 1,
  "precision_angular_horizontal": "2.5",
  "precision_angular_vertical": "2.5",
  "precision_distancia": "2mm + 2ppm"
}
```

### Tipos de Instrumento (ID)
- **1** = Estación Total
- **2** = Nivel
- **3** = Antena GNSS

### Estados de Certificado (ID)
- **1** = Vigente
- **2** = Vencido
- **3** = En Revisión
- **4** = Cancelado
