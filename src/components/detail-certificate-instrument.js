import { Modal, Form, message,
  notification, Input, Select, DatePicker,Upload, Button, Badge} from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import API_URL from "../config/api";
import { data } from "@remix-run/router";
import { InboxOutlined,UploadOutlined,FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FileUnknownOutlined } from "@ant-design/icons";
const { Dragger } = Upload;

// Estilo CSS para el Select cuando ha sido modificado
const modifiedSelectStyle = `
    .modified-select .ant-select-selector {
        border-color: #1890ff !important;
    }
`;

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
  const [fileList, setFileList] = useState([]); //estado de los archivos
  const [actualizarArchivos, setObtenerArchivos] = useState(true)
  const [touchedFields, setTouchedFields] = useState({}) // Campos que han sido modificados

 

  const [messageApi, contextHolder] = message.useMessage();
  
  //console.log("Date Seleccionada",dataSelected)

  const obtenerArchivos = ()=>{
    if (actualizarArchivos){
        setObtenerArchivos(false)
    }else{
        setObtenerArchivos(true)
    }
}

// Función para manejar cambios en los campos del formulario
const handleValuesChange = (changedValues, allValues) => {
  const newTouchedFields = { ...touchedFields };
  //console.log("changedValues", changedValues)
  Object.keys(changedValues).forEach(field => {
      newTouchedFields[field] = true;
  });
  setTouchedFields(newTouchedFields);
  //console.log("TOUCH",touchedFields)
  
};

  //Obtener el detalle de los certificados del instrumento ingresado a calibración
  useEffect(()=>{
    if (!isModalVisible) return;

    if (!dataSelected?.id_instrumento || !dataSelected?.n_certificado) {
      setDataDetailCertificate(null);
      return;
    }
  
    setDataDetailCertificate(null); // limpia datos viejos mientras carga nuevo
   //console.log("DATA DETAL", dataDetailCertificate)
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

  //Soicitar listado de archivos
  useEffect(()=>{
    if (!isModalVisible) return;

    if (!dataSelected?.id_instrumento || !dataSelected?.n_certificado) {
      setFileList(null);
      return;
    }
    setFileList(null); // limpia datos viejos mientras carga nuevo
    fetch(`${API_URL}/calibracion/${dataSelected.n_certificado}/archivos`)
    .then(res=>res.json())
    .then(data=>{
        setFileList(
            data.map(file=>({
            uid:file.id_archivo,
            name:file.nombre_original,
            status:'done',
            type:file.tipo,
            url: `${API_URL}/calibracion/archivo/${file.id_archivo}`
        }))
        ) 
    })
    //console.log("FileList",fileList)
    },[isModalVisible, actualizarArchivos])


  //Funcion para ejecutar la eliminación del archivo:

  const eliminarArchivo = async (id_archivo) => {
    try {

        const response = await fetch(
            `${API_URL}/calibracion/archivo/${id_archivo}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok)
            throw new Error();

        //message.success("Archivo eliminado");
        notification.success({
            message:"Aviso",
            description:`El archivo ha sido eliminado`,
            duration: 3
            //title:"Aviso",
            //content:`Hito Nº ${idHito} actualizado con éxito`,
            });

        // Volver a consultar archivos
        obtenerArchivos();
        delete touchedFields.archivos
        setTouchedFields(touchedFields)
        
        

    } catch {

        message.error("No fue posible eliminar el archivo");

    }

};

  const onSuccessForm = async(certificateData) => {
    console.log("Datos del certificado a guardar:", certificateData);
    console.log("otrosdatos:",dataDetailCertificate)
    const{fecha_calibr, fecha_certif,id_estado_certif,responsable_calibr,responsable_certif,prec_dist_gps,prec_alt_gps,prec_dist_cp_et,prec_dist_sp_et,prec_ang_hz_et,prec_ang_vert_et,prec_nivel,...restDataDetail} = dataDetailCertificate
    const newValues = {...certificateData, ...restDataDetail}
    const formData = new FormData();
        
    // Aquí puedes hacer la lógica de guardado adicional si es necesaria
    // O simplemente cerrar el modal tras guardar exitosamente
    // Conversión de precio a número si es string
    if (typeof newValues.prec_nivel === "string"){
      newValues.prec_nivel = parseFloat(newValues.prec_nivel);
  }
    console.log("newValues",newValues)

    //Dado que estoy enviando archivos, es necesario crear un objeto de formData
    Object.entries(newValues).forEach(([key, value]) => {
      formData.append(
          key,
          value === null || value === undefined
              ? ""
              : value
      );
  });
  
  fileList.forEach(file=>{
      formData.append(
          "archivos",
          file
      );
      formData.append("n_certificado", dataDetailCertificate.n_certificado)
  });

  console.log(formData)

  if(
      
      fileList.length===0
      
      
      )
      {
        
       /*message.error(
       "Debe adjuntar documentación"
       )*/
       Modal.error({
          //message:"Aviso",
          //description:`Hito Nº ${idHito} actualizado con éxito`,
          
          title:"Aviso",
          content:"Para completar el certificado de calibración debe adjuntar el certificado emitido",
          
          });
       setLoading(false)
       return;
      }
    try {
     // Enviar datos actualizados al servidor
     const response =await fetch(`${API_URL}/instrumento/calibraciones/certificado/${dataDetailCertificate.id_instru_calibr}`, {
         method: 'PUT',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(newValues),
     })

     const responseArchivo = await fetch(`${API_URL}/calibraciones/archivos/${dataDetailCertificate.n_certificado}`, {
      method: 'PUT',
      body:formData,
  })

     if (response.ok && responseArchivo.ok){
      const data = await response.json()
      console.log("data",data)
      //onSuccessForm()
      notification.success({
        message:"Aviso",
        description:`Resultados de la calibración guardados correctamente`,
        duration: 3
        //title:"Aviso",
        //content:`Hito Nº ${idHito} actualizado con éxito`,
        });
        setTouchedFields({}) // Resetear campos modificados
        obtenerArchivos();
      
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
      rules: [{ required: true, message: 'Por favor ingrese la precisión de la distancia' }],
      style:{borderColor: touchedFields.prec_dist_gps ? '#1890ff' : undefined,
      boxShadow: touchedFields.prec_dist_gps ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "input",
      name: "prec_alt_gps",
      label: "Precisión en altura",
      initialValue: null,
      placeholder: "Ej. XXX",
      rules: [{ required: true, message: 'Por favor ingrese la precisión en altura'}],
      style:{borderColor: touchedFields.prec_alt_gps ? '#1890ff' : undefined,
      boxShadow: touchedFields.prec_alt_gps ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "input",
      name: "responsable_calibr",
      label: "Responsable de Calibración",
      initialValue: null,
      placeholder: "Ej. XXXXXX",
      rules: [{ required: false, message: 'Por favor ingrese el responsable de la calibración' }],
      style:{borderColor: touchedFields.responsable_calibr ? '#1890ff' : undefined,
      boxShadow: touchedFields.responsable_calibr ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "date",
      name: "fecha_calibr",
      label: "Fecha de Calibración",
      //initialValue: null,
      //placeholder: "Ej. -20°C a 50°C",
      rules: [{ required: true, message: 'Por favor ingrese la fecha de la calibración' }],
      style:{borderColor: touchedFields.fecha_calibr ? '#1890ff' : undefined,
      boxShadow: touchedFields.fecha_calibr ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px', width:'100%'}
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
      rules: [{ required: true, message: 'Por favor ingrese la precisión horizontal' }],
      style:{borderColor: touchedFields.prec_ang_hz_et ? '#1890ff' : undefined,
      boxShadow: touchedFields.prec_ang_hz_et ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "input",
      name: "prec_ang_vert_et",
      label: "Precisión angular vertical",
      initialValue: null,
      placeholder: "Ej. 45 segundos",
      rules: [{ required: true, message: 'Por favor ingrese la precisión vertical' }],
      style:{borderColor: touchedFields.prec_ang_vert_et ? '#1890ff' : undefined,
      boxShadow: touchedFields.prec_ang_vert_et ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "input",
      name: "prec_dist_cp_et",
      label: "Precisión distancia con prisma",
      initialValue: null,
      placeholder: "Ej. 50 Ohms",
      rules: [{ required: true, message: 'Por favor ingrese la precisión de la distancia' }],
      style:{borderColor: touchedFields.prec_dist_cp_et ? '#1890ff' : undefined,
      boxShadow: touchedFields.prec_dist_cp_et ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "input",
      name: "prec_dist_sp_et",
      label: "Precisión distancia sin prisma",
      initialValue: null,
      placeholder: "Ej. 1.2-1.6 GHz",
      rules: [{ required: true, message: 'Por favor ingrese la precisión de la distancia' }],
      style:{borderColor: touchedFields.prec_dist_sp_et ? '#1890ff' : undefined,
      boxShadow: touchedFields.prec_dist_sp_et ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "input",
      name: "responsable_calibr",
      label: "Responsable de Calibración",
      initialValue: null,
      placeholder: "Ej. XXXXXX",
      rules: [{ required: false, message: 'Por favor ingrese el responsable de la calibración' }],
      style:{borderColor: touchedFields.responsable_calibr ? '#1890ff' : undefined,
      boxShadow: touchedFields.responsable_calibr ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "date",
      name: "fecha_calibr",
      label: "Fecha de calibración",
      //initialValue: null,
      //placeholder: "Ej. IEC 61000-4-3",
      rules: [{ required: true, message: 'Por favor ingrese la fecha de la calibración' }],
      style:{borderColor: touchedFields.fecha_calibr ? '#1890ff' : undefined,
      boxShadow: touchedFields.fecha_calibr ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px', width:'100%'}
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
      rules: [{ required: true, message: 'Por favor ingrese la precisión' }],
      style:{borderColor: touchedFields.prec_nivel ? '#1890ff' : undefined,
      boxShadow: touchedFields.prec_nivel ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "input",
      name: "responsable_calibr",
      label: "Responsable de Calibración",
      initialValue: null,
      placeholder: "Ej. XXXXXX",
      rules: [{ required: false, message: 'Por favor ingrese el responsable de la calibración' }],
      style:{borderColor: touchedFields.responsable_calibr ? '#1890ff' : undefined,
      boxShadow: touchedFields.responsable_calibr ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "date",
      name: "fecha_calibr",
      label: "Fecha de calibración",
      //initialValue: null,
      //placeholder: "",
      rules: [{ required: true, message: 'Por favor ingrese la fecha de calibración' }],
      style:{borderColor: touchedFields.fecha_calibr ? '#1890ff' : undefined,
      boxShadow: touchedFields.fecha_calibr ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px', width:'100%'}
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
      rules: [{ required: true, message: 'Por favor seleccione la fecha' }],
      style:{borderColor: touchedFields.fecha_certif ? '#1890ff' : undefined,
      boxShadow: touchedFields.fecha_certif ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px', width:'100%'}
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
      rules: [{ required: true, message: 'Por favor seleccione el estado' }],
      style:{borderColor: touchedFields.id_estado_certif ? '#1890ff' : undefined,
      boxShadow: touchedFields.id_estado_certif ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
    },
    {
      type: "input",
      name: "responsable_certif",
      label: "Responsable Certificación",
      //initialValue: null,
      placeholder: "Nombre del responsable",
      rules: [{ required: true, message: 'Por favor ingrese el responsable' }],
      style:{borderColor: touchedFields.responsable_certif ? '#1890ff' : undefined,
      boxShadow: touchedFields.responsable_certif ? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined,
      borderRadius:'5px'}
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
        //console.log("Error de validación:", error);
        //message.error("Por favor complete todos los campos requeridos");
      });
  };

  const handleCancel = () => {
    setTimeout(() => {
      form.resetFields();
    }, 1000);  
    onCancel();
    setFileList([])
    setTouchedFields([])
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
      footer={[
        <Button
            key="cancel"
            onClick={handleCancel}
        >
            Cancelar
        </Button>,

        <Badge
            key="save"
            count={
                        
              Object.keys(touchedFields || {}).length
              //changeAddInstrument.length + changeDeleteInstrument.length ? changeAddInstrument.length + changeDeleteInstrument.length : null
          }
            offset={[-5, 5]}
        >
            <Button
                type="primary"
                style={{background:'#0b3d63'}}
                onClick={handleOk}
            >
                Guardar
            </Button>
        </Badge>
    ]}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
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
            //style={field.style}
            
            initialValue={field.initialValue}
          >
            {field.type === 'select' ? (
              <Select
                placeholder={field.placeholder}
                options={field.options}
                style={field.style}
              />
            ) : field.type === 'date' ? (
              <DatePicker format="DD/MM/YYYY"
              placeholder={field.placeholder}
              style={field.style}
                disabled={field.disabled}/>
            ):(
              <Input
                placeholder={field.placeholder}
                disabled={field.disabled}
                type={field.inputType || 'text'}
                style={field.style}
              />
            )}
          </Form.Item>
        ))}
        <Form.Item
                    label={<span><span style={{"color":"red"}}>* </span>Certificado de Calibración</span>}
                    name="archivos"
                   
                    
                >
                  <>{contextHolder}
                    <Upload
                    
                        iconRender={(file)=>{
                            const extension = file.name
                                ?.split(".")
                                .pop()
                                ?.toLowerCase();
                    
                            switch(extension){
                    
                                case "pdf":
                                    return <FilePdfOutlined style={{color:"#cf1322"}} />;
                    
                                case "doc":
                    
                                case "docx":
                                    return <FileWordOutlined style={{color:"#1677ff"}} />;
                    
                                case "xls":
                    
                                case "xlsx":
                                    return <FileExcelOutlined style={{color:"#52c41a"}} />;
                    
                                case "png":
                    
                                case "jpg":
                    
                                case "jpeg":
                                    return <FileImageOutlined />;
                    
                                case "zip":
                                    return <FileZipOutlined />;
                    
                                default:
                                    return <FileUnknownOutlined />;
                            }
                    
                        }}
                       //iconRender={()=>{return <FilePdfOutlined style={{color:"red"}} />}}
                        
                        fileList={fileList}
                        //rules={{required:true,message: 'Por favor ingrese el Certificado de Calibración'}}
                        /*onChange={(info)=>{

                            setFileList(info.fileList)
                        
                        }}*/
                        
                        onPreview={(file)=>{

                            window.open(file.url);
                    
                        }}
                        beforeUpload={(file)=>{
                            setFileList(prev => [...prev, file]);

                            setTouchedFields(prev => ({
                              ...prev,
                              archivos: true
                          }));

                            messageApi.success(
                              `Archivo "${file.name}" cargado satisfactoriamente`
                          );
                            return false;
                        }}
                        onRemove={(file)=>{
                              setTouchedFields(prev => ({
                                ...prev,
                                archivos: true
                            }));
                            
                            Modal.confirm({

                                title:"Eliminar documento",
                                
                                content:"¿Desea eliminar este documento?",
                                
                                onOk(){
                                    setFileList(prev => 
                                        prev.filter(item => item.uid !== file.uid)
                                    );

                                    
                                    //console.log(file)
                                    if (file.url){
                                        eliminarArchivo(file.uid)
                                    } else {
                                        setTouchedFields(prev => {
                                            const nuevo = { ...prev };
                                            delete nuevo.archivos;
                                            return nuevo;
                                        });
                                        notification.success({
                                            message:"Aviso",
                                            description:`El archivo ha sido eliminado`,
                                            duration: 3
                                            //title:"Aviso",
                                            //content:`Hito Nº ${idHito} actualizado con éxito`,
                                            });
                                    }
                                    
                                    //eliminarDocumento(file.id_archivo);
                                
                                },
                                onCancel(){
                                  setTouchedFields(prev => {
                                    const nuevo = { ...prev };
                                    delete nuevo.archivos;
                                    return nuevo;
                                });
                                }
                                
                                })
                        }}
                    >

                        
                        <Button type="primary" style={{background:'#0b3d63'}}icon={<UploadOutlined />}>
                        Upload
                        </Button>
                        

                        <p className="ant-upload-hint">
                            
                        </p>

                    </Upload>
                    </>
                </Form.Item>
      </Form>
      
    </Modal>
  );
};

export default DetailCertificateInstrument;
