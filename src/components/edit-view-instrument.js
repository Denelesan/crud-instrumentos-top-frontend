import { Button, Collapse, Form, Modal, Input, Select, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import {ModifiedInput,ModifiedSelect} from "./fields"
import { PageLayout, FormGeneralPanelLayout, CollapseLayout } from '../layouts'
import EditViewInstrumentGeneral from "./edit-view-instrument-general"
import EditViewInstrumentCalibration from "./edit-view-instrument-calibration"


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
            header:<div>
                <b>Información General</b>
                <p class="panel-subtitle">Datos básicos del instrumento topográfico</p>
                </div>,
            key:"1",
            content:<EditViewInstrumentGeneral id={id} touchedFields={touchedFields} setTouchedFields={setTouchedFields}/>
        },
        {
            header:<div>
                <b>Verificaciones</b>
                <p class="panel-subtitle">Historial de verificaciones del instrumento topográfico</p>
                </div>,
            key:"2",
            content:<div style={{
                display: 'flex',
                justifyContent: "center",
                marginTop: "20px"
            }}>
                <Button type="primary" style={{width: "auto"}} htmlType="submit">Agregar Datos de Verificación</Button>
            </div>
        },
        {
            header:<div>
                <b>Calibraciones</b>
                <p class="panel-subtitle">Historial de calibraciones y certificados del instrumento topográfico</p>
                </div>,
            key:"3",
            content: <EditViewInstrumentCalibration id={id}/>
        }
    ]
        

    return (
        <CollapseLayout 
            titleBanner="Sistema de Gestión"
            subtitleBanner="Instrumentos y Accesorios Topográficos"
            title={`Edición de Instrumento Topográfico Nº${id}`}
            subtitle="Gestiona la información, calibración y verificación de los instrumentos"
            panels={panels}
            defaultActiveKey={['1']}
            onBackClick={handleBack}
            accordion={false}
            backButtonText="Volver a la bandeja de entrada"
            backButtonWidth="15rem"
        
        />
       
    );
}


export default EditViewInstrument