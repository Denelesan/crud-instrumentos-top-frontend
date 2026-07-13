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


const {Panel}= Collapse

const EditViewInstrument = ()=>{
    const {id} = useParams()
    const navigate = useNavigate()
    const [touchedFields, setTouchedFields] = useState({}) // Campos que han sido modificados
    
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
            lastUpdate:"Actualizado hace 3 horas",
            content:<EditViewInstrumentGeneral id={id} touchedFields={touchedFields} setTouchedFields={setTouchedFields}/>
        },
        {
            header:" Verificaciones",
            description:"Historial de verificaciones del instrumento topográfico",
            count:"2 Verificaciones registradas",
            key:"2",
            lastUpdate:"Ùltima verificación hace 6 meses",
            icon:<SettingOutlined/> ,
            content:<EditViewInstrumentVerificacion id={id}/>
        },
        {
            header:" Calibraciones",
            description:"Historial de calibraciones y certificados del instrumento topográfico",
            key:"3",
            count:"2 calibraciones registradas",
            lastUpdate:"Ùltima calibración hace 6 meses",
            icon:<EnvironmentOutlined/> ,
            content: <EditViewInstrumentCalibration id={id}/>
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