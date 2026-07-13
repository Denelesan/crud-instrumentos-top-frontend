import { Collapse, Button, Modal} from "antd"
import { useNavigate, useParams } from "react-router-dom"
import EditGeneralViewVerificacion from "./edit-view-general-verificacion";
import JornadasHitoVerificacion from "./jornadas_hito_verificacion";
import { useState } from "react";
import { CollapseLayout, PageLayout } from '../layouts';
import VerificacionInstrumentAsociation from "./verificacion-instrumento-asociation";
import DocumentacionVerificacion from "./documentacion-verificacion";
import CollapseLayout2 from "../layouts/CollapseLayout2";
import { ToolOutlined } from "@ant-design/icons";

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
            description:"Datos generales del hito de verificación",
            icon:<ToolOutlined/>,
            lastUpdate:"Actualizado hace 3 horas",
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
            description:"Registros de jornadas realizadas para cumplir con este hito de verificación",
            icon:<ToolOutlined/>,
            count:"2 jornadas registradas",
            lastUpdate:"Ùltima jornada hace 6 meses",
            content: <JornadasHitoVerificacion idHito={id} onLogUpdate={handleLogUpdate}/>
        },
        {
            header: "Instrumentos asociados",
            description:"Instrumentos asociados a este hito de verificación",
            icon:<ToolOutlined/>,
            count:"24 instrumentos asociados",
            lastUpdate:"Actualizado hace 3 horas",
            content: <VerificacionInstrumentAsociation idHito={id}
            changeDeleteInstrument={changeDeleteInstrument} setChangeDeleteInstrument={setChangeDeleteInstrument}
            changeAddInstrument={changeAddInstrument} setChangeAddInstrument={setChangeAddInstrument}/>
        }
    ];

    return (
            <CollapseLayout2
            titleBanner="Sistema de Gestión"
            subtitleBanner="Instrumentos y Accesorios Topográficos"
            title={`Edición de Hito de Verificación Nº${id}`}
            panels={panels}
            defaultActiveKey={[]}
            accordion={false}
            backButtonText="Volver a la bandeja de entrada"
            backButtonWidth="15rem"
            onBackClick={handleBack}
        />  
        
        
    );
}

export default EditViewHitoVerificacion