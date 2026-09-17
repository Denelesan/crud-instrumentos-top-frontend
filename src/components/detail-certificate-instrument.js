import { Modal, Form, message, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import API_URL from "../config/api";
import { data } from "@remix-run/router";

const DetailCertificateInstrument = ({
  isModalVisible,
  onCancel,
  onSuccess,
  dataSelected,
  setCertificateModalVisible,
  loading: initialLoading,
  setUpdateTrigger
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(initialLoading || false);
  const [tipoInstrumento, setTipoInstrumento] = useState(null);
  const [optionsEstadoCertificado, setoptionsEstadoCertificado] = useState([]);
  const [dataDetailCertificate, setDataDetailCertificate] = useState([])
  
  //console.log("Date Seleccionada",dataSelected)

  //Obtener el detalle de los certificados del instrumento ingresado a calibración
  useEffect(()=>{
    if (!isModalVisible) return;

    if (!dataSelected?.id_instrumento || !dataSelected?.n_certificado) {
      setDataDetailCertificate(null);
      return;
    }
  
    setDataDetailCertificate(null); // limpia datos viejos mientras carga nuevo
   
    fetch(`${API_URL}/instrumento/calibraciones/detalle/${dataSelected.id_instrumento}/${dataSelected.n_certificado}`)
    .then(response=> response.json())
    .then(data=>{ 

      const dataDetail = data[0] || null
      setDataDetailCertificate(dataDetail)

      if (dataDetail) {
        form.setFieldsValue({
          n_certificado: dataDetail.n_certificado,
          fecha_certif: dataDetail.fecha_certif ? dayjs(dataDetail.fecha_certif) : null,
          responsable_calibr: dataDetail.responsable_calibr,
          responsable_certif: dataDetail.responsable_certif,
          fecha_calibr: dataDetail.fecha_calibr ? dayjs(dataDetail.fecha_calibr) : null,          
          id_estado_calibr:dataDetail.id_estado_calibr,
          id_estado_certif:dataDetail.id_estado_certif,
          id_instru_calibr:dataDetail.id_instru_calibr,
          id_instrumento:dataDetail.id_instrumento,
          id_tipo:dataDetail.id_tipo,          
          prec_alt_gps:dataDetail.prec_alt_gps,
          prec_dist_cp_et:dataDetail.prec_dist_cp_et,
          prec_ang_hz_et:dataDetail.prec_ang_hz_et,
          prec_ang_vert_et:dataDetail.prec_ang_vert_et,
          prec_dist_gps:dataDetail.prec_dist_gps,
          prec_dist_sp_et:dataDetail.prec_dist_sp_et,
          prec_nivel:dataDetail.prec_nivel,

        });
      }
      console.log("DataDetail",data[0])
     
    })
    .catch(error => console.log("Error en la solicitud:", error))
    
    
  },[isModalVisible])

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
      .catch(error => console.log("Error en la solicitud", error));
  }, []);

  // Obtener el tipo de instrumento del dataSelected
  useEffect(() => {
    if (dataSelected && dataSelected.id_tipo) {
      setTipoInstrumento(dataSelected.id_tipo);
    }
  }, [dataSelected]);

  useEffect( () => {
    if (!isModalVisible) {
      setTimeout(() => {
        form.resetFields();
      }, 1000);      
    }
  }, [isModalVisible]);

  const onSuccessForm = async(certificateData) => {
    console.log("Datos del certificado a guardar:", certificateData);
    console.log("otrosdatos:",dataDetailCertificate)
    const{fecha_calibr, fecha_certif,id_estado_certif,responsable_calibr,responsable_certif,prec_dist_gps,prec_alt_gps,prec_dist_cp_et,prec_dist_sp_et,prec_ang_hz_et,prec_ang_vert_et,prec_nivel,...restDataDetail} = dataDetailCertificate
    const newValues = {...certificateData, ...restDataDetail}
    // Aquí puedes hacer la lógica de guardado adicional si es necesaria
    // O simplemente cerrar el modal tras guardar exitosamente
    // Conversión de precio a número si es string
    if (typeof newValues.prec_nivel === "string"){
      newValues.prec_nivel = parseFloat(newValues.prec_nivel);
  }
    console.log("newValues",newValues)
    try {
     // Enviar datos actualizados al servidor
     const response =await fetch(`${API_URL}/instrumento/calibraciones/certificado/${dataDetailCertificate.id_instru_calibr}`, {
         method: 'PUT',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(newValues),
     })
     if (response.ok){
      const data = await response.json()
      console.log("data",data)
      onSuccess()
      
     /* Modal.success({
        title: 'Éxito',
        content: 'Datos del certificado guardados correctamente',
        onOk: () => setCertificateModalVisible(false)
      });*/
     } else{
      message.error("Error al actualizar el certificado de calibración")
     }
     
     } catch (error) {
         console.log("Error en la solicitud", error)
     } finally{
         setLoading(false)
     }
    
    
  }
  
  // Campos específicos para Antena GNSS (id_tipo = 2)
  const getFieldsAntenaGNSS = () => [
    {
      type: "input",
      name: "prec_dist_gps",
      label: "Precisión distancia",
      initialValue: null,
      placeholder: "Ej. XXXX",
      rules: [{ required: true, message: 'Por favor ingrese la precisión de la distancia' }]
    },
    {
      type: "input",
      name: "prec_alt_gps",
      label: "Precisión en altura",
      initialValue: null,
      placeholder: "Ej. XXX",
      rules: [{ required: true, message: 'Por favor ingrese la precisión en altura'}]
    },
    {
      type: "input",
      name: "responsable_calibr",
      label: "Responsable de Calibración",
      initialValue: null,
      placeholder: "Ej. XXXXXX",
      rules: [{ required: false, message: 'Por favor ingrese el responsable de la calibración' }]
    },
    {
      type: "date",
      name: "fecha_calibr",
      label: "Fecha de Calibración",
      //initialValue: null,
      //placeholder: "Ej. -20°C a 50°C",
      rules: [{ required: true, message: 'Por favor ingrese la fecha de la calibración' }]
    }
  ];

  // Campos específicos para Estación Total (id_tipo = 1)
  const getFieldsEstacionTotal = () => [
    {
      type: "input",
      name: "prec_ang_hz_et",
      label: "Precisión angular hz",
      initialValue: null,
      placeholder: "Ej. 3.5 dBi",
      rules: [{ required: true, message: 'Por favor ingrese la precisión horizontal' }]
    },
    {
      type: "input",
      name: "prec_ang_vert_et",
      label: "Precisión angular vertical",
      initialValue: null,
      placeholder: "Ej. 45 segundos",
      rules: [{ required: true, message: 'Por favor ingrese la precisión vertical' }]
    },
    {
      type: "input",
      name: "prec_dist_cp_et",
      label: "Precisión distancia con prisma",
      initialValue: null,
      placeholder: "Ej. 50 Ohms",
      rules: [{ required: true, message: 'Por favor ingrese la precisión de la distancia' }]
    },
    {
      type: "input",
      name: "prec_dist_sp_et",
      label: "Precisión distancia sin prisma",
      initialValue: null,
      placeholder: "Ej. 1.2-1.6 GHz",
      rules: [{ required: true, message: 'Por favor ingrese la precisión de la distancia' }]
    },
    {
      type: "input",
      name: "responsable_calibr",
      label: "Responsable de Calibración",
      initialValue: null,
      placeholder: "Ej. XXXXXX",
      rules: [{ required: false, message: 'Por favor ingrese el responsable de la calibración' }]
    },
    {
      type: "date",
      name: "fecha_calibr",
      label: "Fecha de calibración",
      //initialValue: null,
      //placeholder: "Ej. IEC 61000-4-3",
      rules: [{ required: true, message: 'Por favor ingrese la fecha de la calibración' }]
    }
  ];

  // Campos específicos para Nivel (id_tipo = 3)
  const getFieldsNivel = () => [
    {
      type: "input",
      name: "prec_nivel",
      label: "Precisión",
      //initialValue: null,
      placeholder: "Ej. 2mm/2m",
      rules: [{ required: true, message: 'Por favor ingrese la precisión' }]
    },
    {
      type: "input",
      name: "responsable_calibr",
      label: "Responsable de Calibración",
      initialValue: null,
      placeholder: "Ej. XXXXXX",
      rules: [{ required: false, message: 'Por favor ingrese el responsable de la calibración' }]
    },
    {
      type: "date",
      name: "fecha_calibr",
      label: "Fecha de calibración",
      //initialValue: null,
      //placeholder: "",
      rules: [{ required: true, message: 'Por favor ingrese la fecha de calibración' }]
    }
  ];

  // Obtener campos base comunes a todos los tipos
  const getBaseFields = () => [
    {
      type: "input",
      name: "n_certificado",
      label: "Nº de Certificado",
      disabled:true,
      //placeholder: "Ej. CERT-2024-001",
      //rules: [{ required: true, message: 'Por favor ingrese el número de certificado' }]
    },
    {
      type: "date",
      name: "fecha_certif",
      label: "Fecha de Certificado",
      //initialValue: dataDetailCertificate.fecha_certif,
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
      name: "responsable_certif",
      label: "Responsable Certificación",
      //initialValue: null,
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
        //onFinish(values);
        onSuccessForm(values);
        setLoading(false);
      })
      .catch(error => {
        console.log("Error de validación:", error);
        message.error("Por favor complete todos los campos requeridos");
      });
  };

  const handleCancel = () => {
    setTimeout(() => {
      form.resetFields();
    }, 1000);  
    onCancel();
  };

  const getTipoInstrumentoLabel = () => {
    switch (tipoInstrumento) {
      case 1:
        return "Antena GNSS";
      case 2:
        return "Estación Total";
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
            ) : field.type === 'date' ? (
              <DatePicker format="DD/MM/YYYY"
              placeholder={field.placeholder}
              style={{width:'100%'}}
                disabled={field.disabled}/>
            ):(
              <Input
                placeholder={field.placeholder}
                disabled={field.disabled}
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
