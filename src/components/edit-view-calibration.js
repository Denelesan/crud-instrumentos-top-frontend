import { Collapse, Button} from "antd"
import { useNavigate, useParams } from "react-router-dom"
import CalibrationInstrumentAsociation from "./calibration-instrumento-asociation";
import EditGeneralViewCalibration from "./edit-view-general-calibration";
import AvancesHitoCalibration from "./avances_hito_calibration";
import { useState } from "react";
import { CollapseLayout } from '../layouts';

const EditViewHitoCalibration = ()=>{
    const {id} = useParams()
    
    const navigate = useNavigate();
    const {Panel}= Collapse
    const [updateTrigger, setUpdateTrigger] = useState(0)

    // Función para manejar los cambios en los avances
    const handleLogUpdate = ()=>{
        setUpdateTrigger(prev=>prev+1)
    }

    const panels = [
        {
            header: "Información general",
            content: <EditGeneralViewCalibration 
                idHito={id} 
                updateTrigger={updateTrigger} 
            />
        },
        {
            header: "Avances del hito de calibración",
            content: <AvancesHitoCalibration idHito={id} onLogUpdate={handleLogUpdate}/>
        },
        {
            header: "Instrumentos asociados",
            content: <CalibrationInstrumentAsociation idHito={id}/>
        }
    ];

    return (
        <CollapseLayout
            title={`Edición de Hito de Calibración Nº${id}`}
            panels={panels}
            defaultActiveKey={['1','2','3']}
            accordion={false}
            backButtonText="Volver a la bandeja de entrada"
            backButtonWidth="15rem"
        />
    );
}

export default EditViewHitoCalibration