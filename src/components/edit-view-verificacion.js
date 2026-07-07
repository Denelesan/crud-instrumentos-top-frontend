import { Collapse, Button} from "antd"
import { useNavigate, useParams } from "react-router-dom"
import EditGeneralViewVerificacion from "./edit-view-general-verificacion";
import JornadasHitoVerificacion from "./jornadas_hito_verificacion";
import { useState } from "react";
import { CollapseLayout, PageLayout } from '../layouts';
import VerificacionInstrumentAsociation from "./verificacion-instrumento-asociation";
import DocumentacionVerificacion from "./documentacion-verificacion";

const EditViewHitoVerificacion = ()=>{
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
            content: <EditGeneralViewVerificacion
                idHito={id} 
                updateTrigger={updateTrigger} 
            />
        },/*
        {
            header: "Documentos asociados",
            content: <DocumentacionVerificacion idHito={id}/>
        },*/
        {
            header: "Jornadas de Verificación",
            content: <JornadasHitoVerificacion idHito={id} onLogUpdate={handleLogUpdate}/>
        },
        {
            header: "Instrumentos asociados",
            content: <VerificacionInstrumentAsociation idHito={id}/>
        }
    ];

    return (
            <CollapseLayout
            titleBanner="Sistema de Gestión"
            subtitleBanner="Instrumentos y Accesorios Topográficos"
            title={`Edición de Hito de Verificación Nº${id}`}
            panels={panels}
            defaultActiveKey={['1','2','3']}
            accordion={false}
            backButtonText="Volver a la bandeja de entrada"
            backButtonWidth="15rem"
        />  
        
        
    );
}

export default EditViewHitoVerificacion