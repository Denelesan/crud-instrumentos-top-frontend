import { Button, Collapse, Form, Modal, Input, Select, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import {ModifiedInput,ModifiedSelect} from "./fields"
import { PageLayout, FormGeneralPanelLayout, CollapseLayout } from '../layouts'
import EditViewInstrumentGeneral from "./edit-view-instrument-general"
import EditViewInstrumentCalibration from "./edit-view-instrument-calibration"
import EditViewInstrumentVerificacion from "./edit-view-instrument-verificacion"
import { ToolOutlined,SettingOutlined,EnvironmentOutlined } from "@ant-design/icons"
import CollapseLayout2 from "../layouts/CollapseLayout2"

import API_URL from "../config/api";
import { timeAgo } from "../utils/tableUtils"
const {Panel}= Collapse

const EditViewInstrument = ()=>{
    const {id} = useParams()
    const navigate = useNavigate()
    const [touchedFields, setTouchedFields] = useState({}) // Campos que han sido modificados
    const [infoInstrumentos, setInfoInstrumentos] = useState([])
    const [updateTrigger, setUpdateTrigger] = useState(0)

    useEffect(()=>{
        fetch(`${API_URL}/instrumentos/info/${id}`)
        .then(res => res.json())
        .then(response=>{
            
            setInfoInstrumentos(response[0])
            //console.log(response[0])
            
            
        })
    },[updateTrigger])

    
  
    
    const handleBack = () => {
        if (Object.values(touchedFields).some(Boolean)) {
            Modal.confirm({
                title: 'Cambios no guardados',
                content: 'Tienes cambios sin guardar. ¿Estás seguro que quieres salir?',
                okText: 'Salir sin guardar',
                cancelText: 'Cancelar',
                onOk: () => navigate("/"),
            });
        } else {
            navigate("/");
        }
    };

    const panels = [
        {
            header: "Información General", 
               
            description:"Datos básicos del instrumento topográfico",
            key:"1",
            
            icon:<ToolOutlined/>,
            lastUpdate: `Actualizado ${infoInstrumentos ? timeAgo(infoInstrumentos.fecha_actualizacion):"Sin información"}`,
            content:<EditViewInstrumentGeneral 
                id={id} 
                touchedFields={touchedFields} 
                setTouchedFields={setTouchedFields}
                setUpdateTrigger={setUpdateTrigger}
                />
        },
        {
            header:" Verificaciones",
            description:"Historial de verificaciones del instrumento topográfico",
            count:infoInstrumentos.cant_verificaciones?infoInstrumentos.cant_verificaciones==1?`${infoInstrumentos.cant_verificaciones} verificación registrada`:infoInstrumentos.cant_verificaciones==0?"":`${infoInstrumentos.cant_verificaciones} verificaciones registradas`:"",
            key:"2",
            lastUpdate:infoInstrumentos.ultima_verificacion?`Última verificación ${timeAgo(infoInstrumentos.ultima_verificacion)}`
                : "Sin verificaciones",
            icon:<SettingOutlined/> ,
            content:<EditViewInstrumentVerificacion id={id} setUpdateTrigger={setUpdateTrigger}/>
        },
        {
            header:" Calibraciones",
            description:"Historial de calibraciones y certificados del instrumento topográfico",
            key:"3",
            count:infoInstrumentos.cant_calibraciones==1?`${infoInstrumentos.cant_calibraciones} calibración registrada`:infoInstrumentos.cant_calibraciones==0?"":`${infoInstrumentos.cant_calibraciones} calibraciones registradas`,
            lastUpdate:infoInstrumentos.ultima_calibracion?`Última calibración ${timeAgo(infoInstrumentos.ultima_calibracion)}`
                : "Sin calibraciones",
            icon:<EnvironmentOutlined/> ,
            content: <EditViewInstrumentCalibration id={id} setUpdateTrigger={setUpdateTrigger}/>
        }
    ]
        

    return (
        <CollapseLayout2 
            titleBanner="Sistema de Gestión"
            subtitleBanner="Instrumentos y Accesorios Topográficos"
            title={`Edición de Instrumento Topográfico Nº${id}`}
            subtitle="Gestiona la información, calibración y verificación de los instrumentos"
            panels={panels}
            defaultActiveKey={[]}
            onBackClick={handleBack}
            accordion={false}
            backButtonText="Volver a la bandeja de entrada"
            backButtonWidth="15rem"
            style={
                {//display: 'flex',
                justifyContent: "center",
                marginTop: "20px"
            }}
        
        />
       
    );
}


export default EditViewInstrument