import { Collapse, Button, Modal} from "antd"
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
    const [touchedFields, setTouchedFields] = useState({}) // Campos que han sido modificados
    const [changeDeleteInstrument, setChangeDeleteInstrument] = useState([]);
    const [changeAddInstrument, setChangeAddInstrument] = useState([]);
    //const {Panel}= Collapse
    const [updateTrigger, setUpdateTrigger] = useState(0)

    // Función para manejar los cambios en los avances
    const handleLogUpdate = ()=>{
        setUpdateTrigger(prev=>prev+1)
    }

    const handleBack = () => {
        if (Object.values(touchedFields).some(Boolean) ||Object.values(changeDeleteInstrument).some(Boolean)||Object.values(changeAddInstrument).some(Boolean) ) {
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
    }

    const panels = [
        {
            header: "Información general",
            content: <EditGeneralViewVerificacion
                idHito={id} 
                updateTrigger={updateTrigger} 
                touchedFields={touchedFields} setTouchedFields={setTouchedFields}
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
            content: <VerificacionInstrumentAsociation idHito={id}
            changeDeleteInstrument={changeDeleteInstrument} setChangeDeleteInstrument={setChangeDeleteInstrument}
            changeAddInstrument={changeAddInstrument} setChangeAddInstrument={setChangeAddInstrument}/>
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
            onBackClick={handleBack}
        />  
        
        
    );
}

export default EditViewHitoVerificacion