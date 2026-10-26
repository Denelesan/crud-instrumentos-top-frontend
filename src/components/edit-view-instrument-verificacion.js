import { Button, Modal, Badge } from "antd"
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


