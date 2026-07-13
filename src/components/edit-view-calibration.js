import { Collapse, Button} from "antd"
import { useNavigate, useParams } from "react-router-dom"
import CalibrationInstrumentAsociation from "./calibration-instrumento-asociation";
import EditGeneralViewCalibration from "./edit-view-general-calibration";
import AvancesHitoCalibration from "./avances_hito_calibration";
import { useState } from "react";
import { CollapseLayout, PageLayout } from '../layouts';
import CollapseLayout2 from "../layouts/CollapseLayout2";
import { ToolOutlined } from "@ant-design/icons";

const EditViewHitoCalibration = ()=>{
    const {id} = useParams()
    
    const navigate = useNavigate();
    //const {Panel}= Collapse
    const [updateTrigger, setUpdateTrigger] = useState(0)

    // Función para manejar los cambios en los avances
    const handleLogUpdate = ()=>{
        setUpdateTrigger(prev=>prev+1)
    }

    const panels = [
        {
            header: "Información general",
            description:"Datos generales del hito de calibración",
            icon:<ToolOutlined/>,
            lastUpdate:"Actualizado hace 3 horas",
            content: <EditGeneralViewCalibration 
                idHito={id} 
                updateTrigger={updateTrigger} 
            />
        },
        {
            header: "Avances del hito de calibración",
            description:"Registros de avances administrativos asociados al hito de calibración",
            icon:<ToolOutlined/>,
            count:"2 movimientos registrados",
            lastUpdate:"Ùltimo avance hace 6 meses",
            content: <AvancesHitoCalibration idHito={id} onLogUpdate={handleLogUpdate}/>
        },
        {
            header: "Instrumentos asociados",
            description:"Instrumentos asociados a este hito de calibración",
            icon:<ToolOutlined/>,
            count:"24 instrumentos asociados",
            lastUpdate:"Actualizado hace 3 horas",
            content: <CalibrationInstrumentAsociation idHito={id}/>
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