import { Button, Collapse, DatePicker, Form, Input, Select, message,Upload, Modal,Badge } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import API_URL from "../config/api";
import { InboxOutlined,UploadOutlined,FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FileImageOutlined,
    FileZipOutlined,
    FileUnknownOutlined } from "@ant-design/icons";
import { notification } from "antd";
const { Dragger } = Upload;

// Estilo CSS para el Select cuando ha sido modificado
const modifiedSelectStyle = `
    .modified-select .ant-select-selector {
        border-color: #1890ff !important;
    }
`;

/**
 * Componente para editar la información general de un hito de calibración
 * @param {string} idHito - ID del hito de verificacion a editar
 */
const EditGeneralViewVerificacion = ({idHito, updateTrigger}) => {

    // Estados para manejar los datos y el estado del formulario
    const [dataHitoVerificacion, setDataHitoVerificacion] = useState() // Datos del hito de calibración
    const [form] = useForm() // Instancia del formulario de Ant Design
    const [estadoVerificacion, setEstadoVerificacion] = useState() // Lista de estados de Verificacion
    const [personal, setPersonal] = useState([])
    const [loading, setLoading] = useState(false) // Estado de carga durante el envío del formulario
    const [touchedFields, setTouchedFields] = useState({}) // Campos que han sido modificados
    const [fileList, setFileList] = useState([]); //estado de los archivos
    const [actualizarArchivos, setObtenerArchivos] = useState(true)
    
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
        console.log(touchedFields)
        
    };

    // Solicitar Estados de las Verificaciones
    useEffect(() => {
        fetch(`${API_URL}/estados_verificacion`)
            .then(response => response.json())
            .then(data => {
                const optionsEstadoVerificacion = data.map(estadoVerificacion => ({
                    value: estadoVerificacion.id_estado_verif,
                    label: estadoVerificacion.estado_verif,
                }))
                setEstadoVerificacion(optionsEstadoVerificacion)
            }).
            catch(error => console.error("Error al obtener dato de estado de verificacion", error))
    }, [])

    // Cargar datos del hito de verificacion
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/verificacion/${idHito}`);
                const data = await response.json();
                setDataHitoVerificacion(data[0]);
                console.log("Data actualizada:", data[0]);
            } catch (error) {
                console.error("Error al traer la data:", error);
            }
        };

        fetchData();
    }, [idHito, updateTrigger]); // Se ejecutará cuando cambie updateTrigger

    // Actualizar el formulario cuando cambien los datos
    useEffect(() => {
        if (dataHitoVerificacion) {
            form.setFieldsValue({
                id_verificacion: dataHitoVerificacion["id_verificacion"],
                //fecha_solicitud: dataHitoVerificacion["Fecha Solicitud"] ? dayjs(dataHitoVerificacion["Fecha Solicitud"], "YYYY-MM-DD") : "",
                id_estado_verif: dataHitoVerificacion.estado_verif,
                trim_anio: dataHitoVerificacion["trim_anio"],
                //precio_oc: Math.round(dataHitoVerificacion["Precio Orden de Compra"], 9),
                id_responsable: dataHitoVerificacion.responsable
            });
        }
    }, [dataHitoVerificacion, form]);

    // Solicitar personal cargo
    useEffect(() => {
        fetch(`${API_URL}/personalcargo`)
            .then(response => response.json())
            .then(data => {
                const optionsPersonal = data.map(personal => ({
                    value: personal.rut_cargo,
                    label: personal.nombre,
                }))
                setPersonal(optionsPersonal)
            }).
            catch(error => console.error("Error al obtener dato de personal", error))
    }, [])

    const styleInput = {
        width: 'auto'
    }

    useEffect(()=>{
        fetch(`${API_URL}/verificacion/${idHito}/archivos`)
        .then(res=>res.json())
        .then(data=>{
            setFileList(
                data.map(file=>({
                uid:file.id_archivo,
                name:file.nombre_original,
                status:'done',
                type:file.tipo,
                url: `${API_URL}/verificacion/archivo/${file.id_archivo}`
            }))
            ) 
        })
        },[idHito,actualizarArchivos])

    //Funcion para ejecutar la eliminación del archivo:

    const eliminarArchivo = async (id_archivo) => {
        try {
    
            const response = await fetch(
                `${API_URL}/verificacion/archivo/${id_archivo}`,
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

    // Función que se ejecuta al enviar el formulario
    const onFinish= async (values)=>{
        setLoading(true)
        //console.log("values", values)
        const {IdHito,...newValues} = values
        const formData = new FormData();
        
        
        // Manejo de fecha nula
       /* if (newValues.fecha_solicitud === "" || newValues.fecha_solicitud === undefined){
            newValues.fecha_solicitud = null;
        }*/

        // Conversión de nombre de responsable a ID
        if (newValues.id_responsable && typeof newValues.id_responsable === 'string') {
            const responsableSeleccionado = personal.find(per => per.label === newValues.id_responsable);
            if (responsableSeleccionado) {
                newValues.id_responsable = responsableSeleccionado.value;
            }
        }

        // Conversión de nombre de estado a ID
        if (newValues.id_estado_verif && typeof newValues.id_estado_verif === 'string') {
            const estadoSeleccionado = estadoVerificacion.find(est => est.label === newValues.id_estado_verif);
            if (estadoSeleccionado) {
                newValues.id_estado_verif = estadoSeleccionado.value;
            }
        }

        Object.keys(newValues).forEach(key=>{
            formData.append(key,newValues[key]);
        });
        
        
        fileList.forEach(file=>{
            formData.append(
                "archivos",
                file
            );
        });

        //console.log(formData)

        if(
            newValues.id_estado_verif===2
            &&
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
                content:"Para completar el Hito de Verificación debe adjuntar documentación asociada a la labor realizada",
                
                });
             setLoading(false)
             return;
            }
 
        /*
        // Conversión de precio a número si es string
        if (typeof newValues.precio_oc === "string"){
            newValues.precio_oc = parseFloat(newValues.precio_oc);
        }*/
        //console.log("NewValues", newValues)
        try {
            // Enviar datos actualizados al servidor
            const response = await fetch(`${API_URL}/verificacion/${idHito}`, {
                method: 'PUT',
                /*headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValues),*/
                body:formData
            })
            
            if (response.ok){
                const data = await response.json()
                const updateData = await fetch(`${API_URL}/verificacion`);
                const json = await updateData.json()
                //setHitoCalibrationSource(json)
                //console.log("data",json)
                /*let secondsToGo = 5
                
                const modal = Modal.success({
                    title: "Aviso",
                    content: `Hito Nº ${idHito} actualizado con éxito`,
                    okText: `Aceptar ${secondsToGo}`,
                });
                const timer = setInterval(() => {
                    secondsToGo -= 1;
                    modal.update({
                        okText: `Aceptar ${secondsToGo}`,
                      });
                  }, 1000);
                setTimeout(() => {
                    clearInterval(timer);
                    modal.destroy();
                }, 5000); // 5 segundos
                */
                notification.success({
                    message:"Aviso",
                    description:`Hito Nº ${idHito} actualizado con éxito`,
                    duration: 3
                    //title:"Aviso",
                    //content:`Hito Nº ${idHito} actualizado con éxito`,
                    });

                setTouchedFields({}) // Resetear campos modificados
                obtenerArchivos();
                
                //resetear todos los campos del formulario
                //form.resetFields()
            } else{
                message.error("Error al actualizar el Hito de Verificacion")
            }
            
        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally{
            setLoading(false)
        }
    }

    return (
        <div style={{
            width: "100%"
        }}>
            <style>{modifiedSelectStyle}</style>
            {dataHitoVerificacion ? (
            <Form 
            form={form}
            name="form_item_path" 
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={handleValuesChange}
                
                //disabled= "false"
                >
                <div style={{ 
                    display: 'grid', 
                    //flexWrap: 'wrap', 
                    justifyContent: 'center',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    //gridTemplateColumns: '1fr 1fr 1fr',
                    width: '80%',
                    gap: '25px', 
                    margin: '0 auto'
                    //marginLeft: '5em',
                    //marginRight: '5em'
                  }}>
                <Form.Item 
                    label="Nº Hito Verificación"
                    name="id_verificacion" 
                >
                    <Input disabled= "false" placeholder={dataHitoVerificacion["id_verificacion"]} style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Responsable"
                    name="id_responsable" 
                    initialValue={dataHitoVerificacion.responsable}
                    
                >
                    <Select 
                        //disabled={dataHitoCalibration["Estado Hito"]==="Finalizado"?true:false}
                        className={touchedFields.id_responsable ? 'modified-select' : ''}
                        style={{
                            width:'200px',
                            boxShadow: touchedFields.id_responsable ? '0 0 0 3px rgba(24, 144, 255, 0.5)' : undefined,
                            borderRadius:'5px'
                        }}
                        initialValue={dataHitoVerificacion.responsable}
                        options={personal}
                        optionLabelProp="label"
                        
                        /*fieldNames={{
                            label: 'label',
                            value: 'value'
                        }}*/
                    />
                </Form.Item>
                <Form.Item 
                    label="Estado Verificación"
                    name="id_estado_verif" 
                    initialValue={dataHitoVerificacion.estado_verif}
                >
                   
                    <Select
                        //disabled="true"
                        //style={{width:"200px"}}
                        style={{
                            ...styleInput,
                            width:"200px",
                            borderColor: touchedFields.id_estado_verif ? '#1890ff' : undefined,
                            boxShadow: touchedFields.id_estado_verif ? '0 0 0 3px rgba(24, 144, 255, 0.5)' : undefined,
                            borderRadius:'5px'
                        }}
                        options={estadoVerificacion}
                        initialValue={dataHitoVerificacion.estado_verif}
                        />
                </Form.Item>
                <Form.Item 
                    label="Año-trimestre"
                    name="trim_anio" 
                    initialValue={dataHitoVerificacion["trim_anio"]}
                >
                    <Input 
                        //disabled={dataHitoCalibration["Estado Hito"]==="Finalizado"?true:false}
                        style={{
                            ...styleInput,
                            borderColor: touchedFields.trim_anio ? '#1890ff' : undefined,
                            boxShadow: touchedFields.trim_anio ? '0 0 0 3px rgba(24, 144, 255, 0.5)' : undefined
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Documentos asociados"
                    name="archivos"
                >
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
                        multiple
                        fileList={fileList}
                        /*onChange={(info)=>{

                            setFileList(info.fileList)
                        
                        }}*/
                        
                        onPreview={(file)=>{

                            window.open(file.url);
                    
                        }}
                        beforeUpload={(file)=>{
                            setFileList(prev => [...prev, file]);
                            return false;
                        }}
                        onRemove={(file)=>{
                            
                            Modal.confirm({

                                title:"Eliminar documento",
                                
                                content:"¿Desea eliminar este documento?",
                                
                                onOk(){
                                    setFileList(prev => 
                                        prev.filter(item => item.uid !== file.uid)
                                    );
                                    console.log(file)
                                    if (file.url){
                                        eliminarArchivo(file.uid)
                                    } else {
                                        delete touchedFields.archivos
                                        setTouchedFields(touchedFields)
                                        notification.success({
                                            message:"Aviso",
                                            description:`El archivo ha sido eliminado`,
                                            duration: 3
                                            //title:"Aviso",
                                            //content:`Hito Nº ${idHito} actualizado con éxito`,
                                            });
                                    }
                                    
                                    //eliminarDocumento(file.id_archivo);
                                
                                }
                                
                                })
                        }}
                    >

                        
                        <Button type="primary" icon={<UploadOutlined />}>
                        Upload
                        </Button>
                        

                        <p className="ant-upload-hint">
                            Puedes cargar informes, formularios u otros documentos asociados al Hito de Verificación.
                        </p>

                    </Upload>
                </Form.Item>
               
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    marginTop: "20px"
                    
                }}>
                    <Badge
                    count={
                        
                        //fileList.length
                        Object.keys(touchedFields).length
                        //-fileList.length
                        ? 
                        //fileList.length 
                        Object.keys(touchedFields).length
                        //-fileList.length
                        : null 
                        //changeAddInstrument.length + changeDeleteInstrument.length ? changeAddInstrument.length + changeDeleteInstrument.length : null
                    }
                >
                    <Button type="primary" style={{width: "10rem"}} loading={loading} htmlType="submit">Guardar</Button>
                    </Badge>
                </div>
                
                
                </Form>) : 
                <p>Cargando detalles...</p>}

        </div>
    )
}

export default EditGeneralViewVerificacion