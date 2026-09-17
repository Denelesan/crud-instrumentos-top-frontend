import { Collapse, Button} from "antd"
import { useNavigate, useParams } from "react-router-dom"
import CalibrationInstrumentAsociation from "./calibration-instrumento-asociation";
import EditGeneralViewCalibration from "./edit-view-general-calibration";
import AvancesHitoCalibration from "./avances_hito_calibration";
import { useEffect,useState } from "react";
import { CollapseLayout, PageLayout } from '../layouts';
import CollapseLayout2 from "../layouts/CollapseLayout2";
import { ToolOutlined } from "@ant-design/icons";

import { timeAgo } from "../utils/tableUtils";
import API_URL from "../config/api";

const EditViewHitoCalibration = ()=>{
    const {id} = useParams()
    
    const navigate = useNavigate();
    //const {Panel}= Collapse
    const [updateTrigger, setUpdateTrigger] = useState(0)
    const [infoCalibracion, setInfoCalibracion] = useState([])

    useEffect(()=>{
        fetch(`${API_URL}/calibracion/info/${id}`)
        .then(res => res.json())
        .then(response=>{
            
            setInfoCalibracion(response[0])
            console.log(response[0])
            
            
        })
    },[updateTrigger])

    // Función para manejar los cambios en los avances
    const handleLogUpdate = ()=>{
        setUpdateTrigger(prev=>prev+1)
    }

    const panels = [
        {
            header: "Información general",
            description:"Datos generales del hito de calibración",
            icon:<ToolOutlined/>,
            lastUpdate:`Actualizado ${infoCalibracion ? timeAgo(infoCalibracion.fecha_actualizacion):"Sin información"}`,
            content: <EditGeneralViewCalibration 
                idHito={id} 
                updateTrigger={updateTrigger} 
                onLogUpdate={handleLogUpdate}
            />
        },
        {
            header: "Avances del hito de calibración",
            description:"Registros de avances administrativos asociados al hito de calibración",
            icon:<ToolOutlined/>,
            count:infoCalibracion.cant_movimientos?infoCalibracion.cant_movimientos==1?`${infoCalibracion.cant_movimientos} avance registrado`:infoCalibracion.cant_movimientos==0?"":`${infoCalibracion.cant_movimientos} avances registrados`:"",
            lastUpdate:infoCalibracion.ultimo_avance?`Último avance ${timeAgo(infoCalibracion.ultimo_avance)}`
            : "Sin avances",
            content: <AvancesHitoCalibration idHito={id} onLogUpdate={handleLogUpdate}/>
        },
        {
            header: "Instrumentos asociados",
            description:"Instrumentos asociados a este hito de calibración",
            icon:<ToolOutlined/>,
            count:infoCalibracion.cant_instrumentos?infoCalibracion.cant_instrumentos==1?`${infoCalibracion.cant_instrumentos} instrumento asociado`:infoCalibracion.cant_instrumentos==0?"":`${infoCalibracion.cant_instrumentos} instrumentos asociados`:"",
            lastUpdate:`Actualizado ${infoCalibracion ? timeAgo(infoCalibracion.actualizacion_instrumento):"Sin información"}`,
            content: <CalibrationInstrumentAsociation idHito={id} onLogUpdate={handleLogUpdate}/>
        }
    ];

    return (
            <CollapseLayout2
            titleBanner="Sistema de Gestión"
            subtitleBanner="Instrumentos y Accesorios Topográficos"
            title={`Edición de Hito de Calibración Nº${id}`}
            panels={panels}
            defaultActiveKey={[]}
            accordion={false}
            backButtonText="Volver a la bandeja de entrada"
            backButtonWidth="15rem"
        />  
        
        
    );
}

export default EditViewHitoCalibration