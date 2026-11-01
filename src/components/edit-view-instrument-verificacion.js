import { Button, Modal, Badge,notification } from "antd"
import { PlusOutlined } from "@ant-design/icons";
import VerificacionCard from "../layouts/VerificacionCard";
import { useState, useRef, useEffect } from "react";
import FormCreateVerificacionDatos from "./form-create-verificacion-datos";

import API_URL from "../config/api";

const datos = [

    {
        id:1,
        tipo_verificacion:"Verificación Completa",
        fecha:"14/01/2024",
        responsable:"Juan Pérez",
        estado_fisico:"Excelente",
        estado_operativo:"Funcional",
        estado_digital:"Actualizado",
        observaciones:"Instrumento en perfecto estado.",
        documentos:3
    },

    {
        id:2,
        tipo_verificacion:"Verificación Rutinaria",
        fecha:"19/08/2023",
        responsable:"María González",
        estado_fisico:"Bueno",
        estado_operativo:"Funcional",
        estado_digital:"Pendiente",
        observaciones:"Requiere actualización de firmware.",
        documentos:1
    }

];

const EditViewInstrumentVerificacion = ({id,setUpdateTrigger}) => {
    const [openModalFormVerificacion, setOpenModalFormVerificacion] = useState(false);
    const [openModalFormUpdateVerificacion, setOpenModalFormUpdateVerificacion] = useState(false);
    const [datosVerificaciones, setDatosVerificaciones] = useState([])
    const [tareas, setTareas] = useState([])
    const [totalVerificacionesPendientes, setTotalVerificacionesPendientes] = useState()
    const formRef = useRef(null);
    //console.log(id)

    useEffect(()=>{
        fetch(`${API_URL}/instrumento/verificaciones/${id}`)
        .then(res => res.json())
        .then(response=>{
            
            let dataFilter = response.filter(item=>
                item.id_estado_verif === 2 && (item.resultado_fisico || item.resultado_digital || item.resultado_operativo)
            )
            console.log(response.length)
            let count = response.length-dataFilter.length
            setDatosVerificaciones(dataFilter)
            setTotalVerificacionesPendientes(count)
            
            
        })
    },[openModalFormVerificacion,openModalFormUpdateVerificacion])

    useEffect(()=>{
        fetch(`${API_URL}/tareas/${id}`)
        .then(res => res.json())
        .then(response=>{
            
            setTareas(response)
            
            
        })
    },[openModalFormVerificacion,openModalFormUpdateVerificacion])

    //Funcion que busque los archivos del hito de verificacion seleccionado
    const handleDownloadVerificacion = async (id_verificacion) => {

        try {
    
            const response = await fetch(
                `${API_URL}/verificacion/${id_verificacion}/archivos/zip`,
                {
                  method: 'GET',
                  credentials: 'include'
                }
            );
    
            if (response.ok) {            
                                
                
            // Convertimos la respuesta en Blob
            const blob = await response.blob();
    
            // Creamos una URL temporal
            const url = window.URL.createObjectURL(blob);
    
            // Creamos un enlace temporal
            const link = document.createElement("a");
            link.href = url;
            link.download = `archivos_hito_verificacion_${id_verificacion}.zip`;
    
            // Ejecutamos la descarga
            document.body.appendChild(link);
            link.click();
    
            // Limpiamos
            link.remove();
            window.URL.revokeObjectURL(url);
        }
            if (!response.ok) {
                
                const error = await response.json();
                throw new Error(error.message || 'Error al descargar los archivos');
                
            }
    
        } catch (error) {
            notification.info({
                message:"Aviso",
                description:`No existe un archivo asociado`,
                duration: 1.5
                //title:"Aviso",
                //content:`Hito Nº ${idHito} actualizado con éxito`,
                });
    
            console.error("Error al descargar archivos:", error);
    
        }
    };

    const handleCancel = () => {
        setOpenModalFormVerificacion(false);
       
        if (formRef.current) {
            if(Object.keys(formRef.current).length>1){
                formRef.current?.resetFormFields();
                formRef.current?.resetCertificadoFields()

            }else{
                formRef.current?.resetFormFields();
            }
            
        }
    };

    return (

        <div 
            style={{
                width:'90%',
                          
            }}       
        >
     <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
     <Badge
                                count={totalVerificacionesPendientes}
                            >
        <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            htmlType="submit"
            onClick={()=>setOpenModalFormVerificacion(true)}
            style={{background:'#0b3d63'}}
        >
            Agregar Resultados de Verificación
        </Button>
        </Badge>
    </div>
       
            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between",                    
                    alignItems:"center",
                    marginBottom:30
                }}
            >                         
                

            </div>

            {

                datosVerificaciones.map(item=>(
                    
                    <VerificacionCard
                        key={item.id}
                        item={item}
                        tareas={tareas.filter(tarea=>tarea.id_verificacion ===item.id_verificacion)}
                        setOpenModalFormUpdateVerificacion={setOpenModalFormUpdateVerificacion}
                        openModalFormUpdateVerificacion={openModalFormUpdateVerificacion}
                        disabledButton={item.cant_archivos==="0"?true:false}
                        handleDownloadVerificacion={()=>handleDownloadVerificacion(item.id_verificacion)}
                        //handleCancel={handleCancel}
                    />

                ))

            }
            <Modal
                open={openModalFormVerificacion}
                onCancel={handleCancel}
                width={700}
                footer={null}>
                <FormCreateVerificacionDatos
                id_instrumento={id}
                ref={formRef}
                setUpdateTrigger={setUpdateTrigger} 
                />
            </Modal>
        </div>

    );

};

export default EditViewInstrumentVerificacion;


