import { Modal, Form, message, Input, Select } from "antd";
import { useState, useEffect } from "react";
import API_URL from "../config/api";

const DetailCertificateInstrument = ({
  isModalVisible,
  onCancel,
  onSuccess,
  dataSelected,
  loading: initialLoading
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(initialLoading || false);
  const [tipoInstrumento, setTipoInstrumento] = useState(null);
  const [optionsEstadoCertificado, setoptionsEstadoCertificado] = useState([]);

  // Cargar opciones de estado certificado al montar el componente
  useEffect(() => {
    fetch(`${API_URL}/certificado_estado`)
      .then(response => response.json())
      .then(data => {
        const certificadoEstado = data.map(estado => ({
          value: estado.id_estado_calibr,
          label: estado.estado_calibr
        }));
        setoptionsEstadoCertificado(certificadoEstado);
      })
      .catch(error => console.log("[v0] Error en la solicitud", error));
  }, []);

  // Obtener el tipo de instrumento del dataSelected
  useEffect(() => {
    if (dataSelected && dataSelected.id_tipo) {
      setTipoInstrumento(dataSelected.id_tipo);
    }
  }, [dataSelected]);

  // Campos específicos para Estación Total (id_tipo = 1)
  const getFieldsEstacionTotal = () => [
    {
      type: "input",
      name: "precision_angular",
      label: "Precisión Angular",
      initialValue: null,
      placeholder: "Ej. ±5\"",
      rules: [{ required: true, message: 'Por favor ingrese la precisión angular' }]
    },
    {
      type: "input",
      name: "precision_distancia",
      label: "Precisión Distancia",
      initialValue: null,
      placeholder: "Ej. ±2mm + 2ppm",
      rules: [{ required: true, message: 'Por favor ingrese la precisión de distancia' }]
    },
    {
      type: "input",
      name: "rango_medicion",
      label: "Rango de Medición",
      initialValue: null,
      placeholder: "Ej. 1.5m - 10000m",
      rules: [{ required: true, message: 'Por favor ingrese el rango de medición' }]
    },
    {
      type: "input",
      name: "temperatura_operacion",
      label: "Temperatura de Operación",
      initialValue: null,
      placeholder: "Ej. -20°C a 50°C",
      rules: [{ required: true, message: 'Por favor ingrese el rango de temperatura' }]
    },
    {
      type: "input",
      name: "aumento_telescopio",
      label: "Aumento del Telescopio",
      initialValue: null,
      placeholder: "Ej. 30x",
      rules: [{ required: true, message: 'Por favor ingrese el aumento' }]
    },
    {
      type: "input",
      name: "precisión_compensador",
      label: "Precisión del Compensador",
      initialValue: null,
      placeholder: "Ej. ±1.5\"",
      rules: [{ required: true, message: 'Por favor ingrese la precisión del compensador' }]
    },
    {
      type: "input",
      name: "bateria_duracion",
      label: "Duración Batería",
      initialValue: null,
      placeholder: "Ej. 8 horas",
      rules: [{ required: true, message: 'Por favor ingrese la duración de batería' }]
    },
    {
      type: "input",
      name: "normativa_calibracion",
      label: "Normativa de Calibración",
      initialValue: null,
      placeholder: "Ej. ISO 10012:2003",
      rules: [{ required: true, message: 'Por favor ingrese la normativa' }]
    }
  ];

  // Campos específicos para Antena GNSS (id_tipo = 2)
  const getFieldsAntenaGNSS = () => [
    {
      type: "input",
      name: "frecuencias_soportadas",
      label: "Frecuencias Soportadas",
      initialValue: null,
      placeholder: "Ej. GPS, GLONASS, Galileo",
      rules: [{ required: true, message: 'Por favor ingrese las frecuencias' }]
    },
    {
      type: "input",
      name: "precision_posicion",
      label: "Precisión de Posición",
      initialValue: null,
      placeholder: "Ej. ±10mm",
      rules: [{ required: true, message: 'Por favor ingrese la precisión' }]
    },
    {
      type: "input",
      name: "tipo_conector",
      label: "Tipo de Conector",
      initialValue: null,
      placeholder: "Ej. SMA, TNC",
      rules: [{ required: true, message: 'Por favor ingrese el tipo de conector' }]
    },
    {
      type: "input",
      name: "ganancia_antena",
      label: "Ganancia de Antena",
      initialValue: null,
      placeholder: "Ej. 3.5 dBi",
      rules: [{ required: true, message: 'Por favor ingrese la ganancia' }]
    },
    {
      type: "input",
      name: "tiempo_adquisicion",
      label: "Tiempo de Adquisición",
      initialValue: null,
      placeholder: "Ej. 45 segundos",
      rules: [{ required: true, message: 'Por favor ingrese el tiempo de adquisición' }]
    },
    {
      type: "input",
      name: "impedancia_salida",
      label: "Impedancia de Salida",
      initialValue: null,
      placeholder: "Ej. 50 Ohms",
      rules: [{ required: true, message: 'Por favor ingrese la impedancia' }]
    },
    {
      type: "input",
      name: "rango_frecuencia",
      label: "Rango de Frecuencia",
      initialValue: null,
      placeholder: "Ej. 1.2-1.6 GHz",
      rules: [{ required: true, message: 'Por favor ingrese el rango' }]
    },
    {
      type: "input",
      name: "normativa_calibracion",
      label: "Normativa de Calibración",
      initialValue: null,
      placeholder: "Ej. IEC 61000-4-3",
      rules: [{ required: true, message: 'Por favor ingrese la normativa' }]
    }
  ];

  // Campos específicos para Nivel (id_tipo = 3)
  const getFieldsNivel = () => [
    {
      type: "input",
      name: "sensibilidad_tubo",
      label: "Sensibilidad del Tubo",
      initialValue: null,
      placeholder: "Ej. 2mm/2m",
      rules: [{ required: true, message: 'Por favor ingrese la sensibilidad' }]
    },
    {
      type: "input",
      name: "aumento_telescopio",
      label: "Aumento del Telescopio",
      initialValue: null,
      placeholder: "Ej. 32x",
      rules: [{ required: true, message: 'Por favor ingrese el aumento' }]
    },
    {
      type: "input",
      name: "rango_medicion",
      label: "Rango de Medición",
      initialValue: null,
      placeholder: "Ej. 1.5m - 100m",
      rules: [{ required: true, message: 'Por favor ingrese el rango' }]
    },
    {
      type: "input",
      name: "error_esfericidad",
      label: "Error de Esfericidad",
      initialValue: null,
      placeholder: "Ej. ±0.08mm/100m",
      rules: [{ required: true, message: 'Por favor ingrese el error' }]
    },
    {
      type: "input",
      name: "campo_vision",
      label: "Campo de Visión",
      initialValue: null,
      placeholder: "Ej. 1°20'",
      rules: [{ required: true, message: 'Por favor ingrese el campo de visión' }]
    },
    {
      type: "input",
      name: "distancia_minima_enfoque",
      label: "Distancia Mínima de Enfoque",
      initialValue: null,
      placeholder: "Ej. 0.5m",
      rules: [{ required: true, message: 'Por favor ingrese la distancia' }]
    },
    {
      type: "input",
      name: "tipo_compensador",
      label: "Tipo de Compensador",
      initialValue: null,
      placeholder: "Ej. Automático/Manual",
      rules: [{ required: true, message: 'Por favor ingrese el tipo' }]
    },
    {
      type: "input",
      name: "normativa_calibracion",
      label: "Normativa de Calibración",
      initialValue: null,
      placeholder: "Ej. ISO 17123-2",
      rules: [{ required: true, message: 'Por favor ingrese la normativa' }]
    }
  ];

  // Obtener campos base comunes a todos los tipos
  const getBaseFields = () => [
    {
      type: "input",
      name: "n_certificado",
      label: "Nº de Certificado",
      initialValue: null,
      placeholder: "Ej. CERT-2024-001",
      rules: [{ required: true, message: 'Por favor ingrese el número de certificado' }]
    },
    {
      type: "date",
      name: "fecha_certif",
      label: "Fecha de Certificado",
      initialValue: null,
      rules: [{ required: true, message: 'Por favor seleccione la fecha' }]
    },
    {
      type: "select",
      name: "id_estado_certif",
      label: "Estado Certificado",
      initialValue: null,
      options: optionsEstadoCertificado,
      optionLabelProp: "label",
      fieldNames: {
        label: "label",
        value: "value"
      },
      rules: [{ required: true, message: 'Por favor seleccione el estado' }]
    },
    {
      type: "input",
      name: "responsable",
      label: "Responsable Certificación",
      initialValue: null,
      placeholder: "Nombre del responsable",
      rules: [{ required: true, message: 'Por favor ingrese el responsable' }]
    }
  ];

  // Determinar qué campos mostrar según el tipo de instrumento
  const getSpecificFields = () => {
    switch (tipoInstrumento) {
      case 1:
        return getFieldsAntenaGNSS();
      case 2:
        return getFieldsEstacionTotal();
      case 3:
        return getFieldsNivel();
      default:
        return [];
    }
  };

  // Combinar campos base + específicos
  const getAllFields = () => [...getBaseFields(), ...getSpecificFields()];

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        setLoading(true);
        onSuccess(values);
        setLoading(false);
      })
      .catch(error => {
        console.log("[v0] Error de validación:", error);
        message.error("Por favor complete todos los campos requeridos");
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const getTipoInstrumentoLabel = () => {
    switch (tipoInstrumento) {
      case 1:
        return "Estación Total";
      case 2:
        return "Antena GNSS";
      case 3:
        return "Nivel";
      default:
        return "Instrumento";
    }
  };

  return (
    <Modal
      title={`Datos del Certificado de Calibración - ${getTipoInstrumentoLabel()}`}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Guardar"
      cancelText="Cancelar"
      width={900}
      className="certificate-detail-modal"
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{
          display: 'grid',
          justifyContent: 'center',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          width: '100%',
          gap: '16px',
          padding: '16px 0',
        }}
      >
        {getAllFields().map((field, index) => (
          <Form.Item
            key={index}
            name={field.name}
            label={field.label}
            rules={field.rules}
            initialValue={field.initialValue}
          >
            {field.type === 'select' ? (
              <Select
                placeholder={field.placeholder}
                options={field.options}
              />
            ) : (
              <Input
                placeholder={field.placeholder}
                type={field.inputType || 'text'}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default DetailCertificateInstrument;
