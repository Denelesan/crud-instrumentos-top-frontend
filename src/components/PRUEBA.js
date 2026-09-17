import { forwardRef, useState,useImperativeHandle, useEffect  } from "react";
import { Button, Form, Select,message,notification, Card} from "antd";
//import { useForm} from "antd/es/form/Form";
import FormGeneralPanelLayout from "../layouts/FormGeneralPanelLayout";
import Modal from "antd/es/modal/Modal";
import { json } from "react-router-dom";
import { data } from "@remix-run/router";
import {getIdFromValueOrLabel} from "../utils/tableUtils";
import { ModifiedInput, ModifiedSelect, ModifiedDate,ModifiedTextArea} from "../components/fields"

import API_URL from "../config/api";

const styleInput = {
    width: '100%'
}

const FormUpdateVerificacionDatos = forwardRef((props, ref) => {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
   
    const {itemSelected,setOpenModalFormUpdateVerificacion, handleCancel} = props
    //console.log("ITEM",itemSelected)
    const [hitoSelected, setHitoSelected] = useState()
    const [loading, setLoading] = useState(false)
    const [dataFiltered, setDataFiltered] = useState()
    const [optionsResultadoVerificacion, setoptionsResultadoVerificacion] = useState()
    const [handleUpdateHito, setHandleUpdateHito] = useState(false)
    const [touchedFields, setTouchedFields] = useState({}) // Campos que han sido modificados
    const [tareas, setTareas] = useState([]);
    const [mostrarFormTarea, setMostrarFormTarea] = useState(false);
    //const [formTarea] = Form.useForm();
    const [tareaForm, setTareaForm] = useState({
        titulo: "",
        criticidad: undefined,
        responsable: undefined,
        estado: "Pendiente"
    });
   
    // Función para manejar cambios en los campos del formulario
    const handleValuesChange = (changedValues, allValues) => {
        const newTouchedFields = { ...touchedFields };
        console.log("changedValues", changedValues)
        Object.keys(changedValues).forEach(field => {
            newTouchedFields[field] = true;
        });
        setTouchedFields(newTouchedFields);
    };

    useEffect(()=>{
        fetch(`${API_URL}/resultados_verificacion`)
        .then(response => response.json())
        .then(data =>{
            const resultadoVerificacion = data.map(estado=>({
                value:estado.id_resultado_verif,
                label: estado.resultado_verif
            }))
            setoptionsResultadoVerificacion(resultadoVerificacion)
        })
        .catch (error =>(console.log("Error en la solicitud", error)))
        .finally(()=>{
            setLoading(false)
        })

    },[])

    useEffect(()=>{
        fetch(`${API_URL}/instrumento/verificaciones/${itemSelected.id_instrumento}`)
        .then(res => res.json())
        .then(response=>{
            const dataRowFiltered = response.filter(
                item => item.id_instru_verif  == itemSelected.id_instru_verif
            )
            
            setDataFiltered(dataRowFiltered)
            
            return dataRowFiltered
        })
            
        },[handleUpdateHito])
        
    
    useImperativeHandle(ref, () => ({

        resetFormFields: () => {
            form1.resetFields();
            setHitoSelected()
        },
        resetCertificadoFields:()=>{
            form2.resetFields();
        }
    }));

    const handleChange = (e)=>{
        if (e) {
            setHitoSelected(e)
        } 
        
    }

    const onFinishCertificado = async (values) =>{
        setLoading(true)
        console.log("values:",values)
        const {id_instrumento,...newValues} = values

        //Agregamos y normalizamos campos para el fetch
        
        newValues.id_instru_verif = dataFiltered[0].id_instru_verif;
        newValues.id_tipo_instru = dataFiltered[0].id_tipo;
        newValues.id_instrumento = dataFiltered[0].id_instrumento;
        newValues.id_resultado_verif_dig = getIdFromValueOrLabel(newValues.id_resultado_verif_dig, optionsResultadoVerificacion);
        newValues.id_resultado_verif_fis = getIdFromValueOrLabel(newValues.id_resultado_verif_fis, optionsResultadoVerificacion);
        newValues.id_resultado_verif_oper = getIdFromValueOrLabel(newValues.id_resultado_verif_oper, optionsResultadoVerificacion);
        
        console.log("NewValues:", newValues)

        try {               
           
            
                
                const updateSolicitud = await fetch(`${API_URL}/verificacion/solicitud/${newValues.id_instru_verif}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newValues),
                })
                console.log("updateSolicitud:", updateSolicitud)

                if (updateSolicitud.ok){
                    
                    notification.success({
                        message:"Aviso",
                        description:`Resultados de la verificación guardados correctamente`,
                        duration: 3
                        //title:"Aviso",
                        //content:`Hito Nº ${idHito} actualizado con éxito`,
                        });
                    if(handleUpdateHito){
                        setHandleUpdateHito(false)
                    } else{
                        setHandleUpdateHito(true)
                    }
                    setTouchedFields({}) // Resetear campos modificados

                   // setTimeout(()=>(handleCancel()),1000)
                   
                    //form1.resetFields();
                    //form2.resetFields();
                }
                
                else {
                    Modal.error({
                        title: 'Error',
                        content: 'Error al ingresar el certificado de calibración',
                    });
                    }

            

        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally {
            console.log("Se termina de ejecutar")
            setLoading(false)
            
        }      
    }
    const handleChangeTarea = (campo, valor) => {

        setTareaForm(prev => ({
            ...prev,
            [campo]: valor
        }));
    
    };
    
    const agregarTarea = () => {
    
        if (!tareaForm.titulo.trim()) {
            notification.warning({
                message: "Aviso",
                description: "Ingrese el título de la tarea"
            });
    
            return;
        }
    
        if (!tareaForm.criticidad) {
            notification.warning({
                message: "Aviso",
                description: "Seleccione la criticidad"
            });
    
            return;
        }
    
        if (!tareaForm.responsable) {
            notification.warning({
                message: "Aviso",
                description: "Seleccione un responsable"
            });
    
            return;
        }
    
        const nuevaTarea = {
            id: Date.now(),
            titulo: tareaForm.titulo,
            criticidad: tareaForm.criticidad,
            responsable: tareaForm.responsable,
            estado: "Pendiente",
            //completada: false
        };
    
        setTareas(prev => [
            ...prev,
            nuevaTarea
        ]);
    
        setTareaForm({
            titulo: "",
            criticidad: undefined,
            responsable: undefined,
            estado: "Pendiente"
        });
    
        setMostrarFormTarea(false);
    
        notification.success({
            message: "Aviso",
            description: "Tarea agregada"
        });
    
    };
    
    const cancelarTarea = () => {
    
        setTareaForm({
            titulo: "",
            criticidad: undefined,
            responsable: undefined,
            estado: "Pendiente"
        });
    
        setMostrarFormTarea(false);
    
    };



    return (
        <div>
            <h1>Actualización de Verificación Hito Nº{itemSelected.id_verificacion}</h1>
            <p>Registra el resultado de la verificación al instrumento</p>
                    {dataFiltered && (
                    <div
                    style={{
                        width: "100%"
                    }}
                >
            
                    {/* ==================================================
                        FORMULARIO PRINCIPAL
                    ================================================== */}
            
                    <Form
                        form={form2}
                        layout="vertical"
                        onFinish={onFinishCertificado}
                        onValuesChange={handleValuesChange}
                    >
            
                        <div
                            style={{
                                display: "grid",
                                justifyContent: "center",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(200px, 2fr))",
                                width: "100%",
                                gap: "2px",
                                padding: "0 0",
                                maxWidth: "1200px",
                                margin: "0 auto"
                            }}
                        >
            
                            {/* Resultado Físico */}
            
                            <div>
            
                                <ModifiedSelect
                                    type="select"
                                    name="id_resultado_verif_fis"
                                    label="Resultado Físico"
                                    initialValue={itemSelected.resultado_fisico}
                                    touchedFields="touchedFields"
                                    options={optionsResultadoVerificacion}
                                    optionLabelProp="label"
                                    fieldNames={
                                        {label:"label",
                                        value:"value"}
                                            }
                                    disabled={false}
                                    rules={[{
                                        required:true,
                                        message:'Porfavor ingrese el resultado físico',}
                                            ]}
                                />
            
                            </div>
            
            
                            {/* Resultado Digital */}
            
                            <div>
            
                                <ModifiedSelect
                                    type="select"
                                    name="id_resultado_verif_dig"
                                    label="Resultado Digital"
                                    initialValue={itemSelected.resultado_digital}
                                    touchedFields="touchedFields"
                                    options={optionsResultadoVerificacion}
                                    optionLabelProp="label"
                                    fieldNames={
                                        {label:"label",
                                        value:"value"}
                                    }
                                    disabled={false}
                                    rules={[{
                                        required:true,
                                        message:'Porfavor ingrese el resultado digital',
                                    }]}
                                />
            
                            </div>
            
            
                            {/* Resultado Operativo */}
            
                            <div>
            
                                <ModifiedSelect
                                    type="select"
                                    name="id_resultado_verif_oper"
                                    label="Resultado Operativo"
                                    initialValue={itemSelected.resultado_operativo}
                                    touchedFields={touchedFields}
                                    options={optionsResultadoVerificacion}
                                    optionLabelProp="label"
                                    style={{
                                        //...styleInput,
                                        borderRadius: 8,
                                        borderColor: touchedFields.id_resultado_verif_oper ? '#1890ff' : undefined,
                                        boxShadow: touchedFields.id_resultado_verif_oper? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined
                                    }}
                                    fieldNames={{
                                        label:"label",
                                        value:"value"
                                    }}
                                    disabled={false}
                                    rules={[{
                                        required:true,
                                        message:'Porfavor ingrese el resultado operativo',
                                    }]}
                                />
            
                            </div>
            
            
                            {/* Observaciones */}
            
                            <div
                                style={{
                                    gridColumn: "1 / -1"
                                }}
                            >
            
                                <ModifiedTextArea
                                    type="textarea"
                                    name="obs_result"                                
                                    label="Observaciones"
                                    fullWidth={true}
                                    row={10}
                                    initialValue={itemSelected.obs_result}
                                    touchedFields="touchedFields"
                                    disabled={false}
                                    rules={[{
                                        required:false,
                                        message:'Porfavor ingrese el número de certificado',
                                    }]}
                                />
            
                            </div>
            
                        </div>
            
            
            
                        {/* ==================================================
                            TAREAS
                        ================================================== */}
            
                        <Card
                            title="Tareas"
                            bordered={false}
                            style={{
                                maxWidth: "1200px",
                                margin: "20px auto 0",
                                width: "100%"
                            }}
                            extra={
                                !mostrarFormTarea && (
            
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            setMostrarFormTarea(true)
                                        }
                                    >
                                        + Agregar tarea
                                    </Button>
            
                                )
                            }
                        >
            
                            {/* ==========================================
                                FORMULARIO PARA AGREGAR TAREA
            
                                NO ES UN <Form>.
                                Por lo tanto, no existe un formulario
                                anidado dentro de form2.
                            ========================================== */}
            
                            {mostrarFormTarea && (
            
                                <Card
                                    size="small"
                                    style={{
                                        marginBottom: 20,
                                        background: "#fafafa"
                                    }}
                                >
            
                                    <Form.Item
                                        label="Título de la tarea"
                                    >
            
                                        <Input
                                            value={
                                                tareaForm.titulo
                                            }
                                            onChange={e =>
                                                handleChangeTarea(
                                                    "titulo",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ej: Revisar certificado de calibración"
                                        />
            
                                    </Form.Item>
            
            
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fit, minmax(200px, 1fr))",
                                            gap: "12px"
                                        }}
                                    >
            
                                        <Form.Item
                                            label="Criticidad"
                                        >
            
                                            <Select
                                                value={
                                                    tareaForm.criticidad
                                                }
                                                onChange={value =>
                                                    handleChangeTarea(
                                                        "criticidad",
                                                        value
                                                    )
                                                }
                                                placeholder="Seleccione"
                                                options={[
                                                    {
                                                        value: "Baja",
                                                        label: "Baja"
                                                    },
                                                    {
                                                        value: "Media",
                                                        label: "Media"
                                                    },
                                                    {
                                                        value: "Alta",
                                                        label: "Alta"
                                                    },
                                                    {
                                                        value: "Crítica",
                                                        label: "Crítica"
                                                    }
                                                ]}
                                            />
            
                                        </Form.Item>
            
            
                                        <Form.Item
                                            label="Responsable"
                                        >
            
                                            <Select
                                                value={
                                                    tareaForm.responsable
                                                }
                                                onChange={value =>
                                                    handleChangeTarea(
                                                        "responsable",
                                                        value
                                                    )
                                                }
                                                placeholder="Seleccione responsable"
                                                options={[
                                                    {
                                                        value: "Daniel Paredes Villalobos",
                                                        label: "Daniel Paredes Villalobos"
                                                    },
                                                    {
                                                        value: "Responsable 2",
                                                        label: "Responsable 2"
                                                    }
                                                ]}
                                            />
            
                                        </Form.Item>
            
            
                                        <Form.Item
                                            label="Estado"
                                        >
            
                                            <Select
                                                value="Pendiente"
                                                onChange={value =>
                                                    handleChangeTarea(
                                                        "estado",
                                                        value
                                                    )
                                                }
                                                disabled={true}
                                                options={[
                                                    {
                                                        value: "Pendiente",
                                                        label: "Pendiente"
                                                    },
                                                    {
                                                        value: "En progreso",
                                                        label: "En progreso"
                                                    },
                                                    {
                                                        value: "Completada",
                                                        label: "Completada"
                                                    }
                                                ]}
                                            />
            
                                        </Form.Item>
            
                                    </div>
            
            
                                    <Space>
            
                                        <Button
                                            type="primary"
                                            onClick={agregarTarea}
                                        >
                                            Agregar tarea
                                        </Button>
            
                                        <Button
                                            onClick={cancelarTarea}
                                        >
                                            Cancelar
                                        </Button>
            
                                    </Space>
            
                                </Card>
            
                            )}
            
            
                            {/* ==========================================
                                LISTADO DE TAREAS
                            ========================================== */}
            
                            {tareas.length > 0 ? (
            
                                <Space
                                    direction="vertical"
                                    style={{
                                        width: "100%"
                                    }}
                                >
            
            {tareas.map((tarea) => (
                <div
                    key={tarea.id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 15px",
                        borderBottom: "1px solid #f0f0f0",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                        }}
                    >
                        <span
                            style={{
                                fontSize: "18px",
                                lineHeight: 1,
                            }}
                        >
                            •
                        </span>
            
                        <span>
                            {tarea.titulo}
                        </span>
                    </div>
            
                    <Space>
                        <Tag
                            color={
                                tarea.criticidad === "Crítica"
                                    ? "red"
                                    : tarea.criticidad === "Alta"
                                        ? "orange"
                                        : tarea.criticidad === "Media"
                                            ? "gold"
                                            : "green"
                            }
                        >
                            {tarea.criticidad}
                        </Tag>
            
                        <span>
                            {tarea.responsable}
                        </span>
            
                        <Tag>
                            {tarea.estado}
                        </Tag>
                    </Space>
                </div>
            ))}
            
                                </Space>
            
                            ) : (
            
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "25px",
                                        color: "#999"
                                    }}
                                >
                                    No hay tareas asociadas.
                                </div>
            
                            )}
            
                        </Card>
            
            
                        {/* ==================================================
                            BOTÓN GUARDAR
                        ================================================== */}
            
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px"
                            }}
                        >
            
                            <Button
                                type="primary"
                                style={{
                                    width: "10rem"
                                }}
                                loading={loading}
                                htmlType="submit"
                            >
                                Guardar
                            </Button>
            
                        </div>
            
                    </Form>
            
                </div>
            
          
                )}
               
          
        </div>
    )})

export default FormUpdateVerificacionDatos;











import { forwardRef, useState,useImperativeHandle, useEffect  } from "react";
import { Button, Form, Select,message,notification} from "antd";
//import { useForm} from "antd/es/form/Form";
import FormGeneralPanelLayout from "../layouts/FormGeneralPanelLayout";
import Modal from "antd/es/modal/Modal";
import { json } from "react-router-dom";
import { data } from "@remix-run/router";
import {getIdFromValueOrLabel} from "../utils/tableUtils";

import API_URL from "../config/api";

const styleInput = {
    width: '100%'
}

const FormUpdateVerificacionDatos = forwardRef((props, ref) => {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
   
    const {itemSelected,setOpenModalFormUpdateVerificacion, handleCancel} = props
    //console.log("ITEM",itemSelected)
    const [hitoSelected, setHitoSelected] = useState()
    const [loading, setLoading] = useState(false)
    const [dataFiltered, setDataFiltered] = useState()
    const [optionsResultadoVerificacion, setoptionsResultadoVerificacion] = useState()
    const [handleUpdateHito, setHandleUpdateHito] = useState(false)
    const [touchedFields, setTouchedFields] = useState({}) // Campos que han sido modificados
   
    // Función para manejar cambios en los campos del formulario
    const handleValuesChange = (changedValues, allValues) => {
        const newTouchedFields = { ...touchedFields };
        console.log("changedValues", changedValues)
        Object.keys(changedValues).forEach(field => {
            newTouchedFields[field] = true;
        });
        setTouchedFields(newTouchedFields);
    };

    useEffect(()=>{
        fetch(`${API_URL}/resultados_verificacion`)
        .then(response => response.json())
        .then(data =>{
            const resultadoVerificacion = data.map(estado=>({
                value:estado.id_resultado_verif,
                label: estado.resultado_verif
            }))
            setoptionsResultadoVerificacion(resultadoVerificacion)
        })
        .catch (error =>(console.log("Error en la solicitud", error)))
        .finally(()=>{
            setLoading(false)
        })

    },[])

    useEffect(()=>{
        fetch(`${API_URL}/instrumento/verificaciones/${itemSelected.id_instrumento}`)
        .then(res => res.json())
        .then(response=>{
            const dataRowFiltered = response.filter(
                item => item.id_instru_verif  == itemSelected.id_instru_verif
            )
            
            setDataFiltered(dataRowFiltered)
            
            return dataRowFiltered
        })
            
        },[handleUpdateHito])
        
    
    useImperativeHandle(ref, () => ({

        resetFormFields: () => {
            form1.resetFields();
            setHitoSelected()
        },
        resetCertificadoFields:()=>{
            form2.resetFields();
        }
    }));

    const handleChange = (e)=>{
        if (e) {
            setHitoSelected(e)
        } 
        
    }

    const onFinishCertificado = async (values) =>{
        setLoading(true)
        console.log("values:",values)
        const {id_instrumento,...newValues} = values

        //Agregamos y normalizamos campos para el fetch
        
        newValues.id_instru_verif = dataFiltered[0].id_instru_verif;
        newValues.id_tipo_instru = dataFiltered[0].id_tipo;
        newValues.id_instrumento = dataFiltered[0].id_instrumento;
        newValues.id_resultado_verif_dig = getIdFromValueOrLabel(newValues.id_resultado_verif_dig, optionsResultadoVerificacion);
        newValues.id_resultado_verif_fis = getIdFromValueOrLabel(newValues.id_resultado_verif_fis, optionsResultadoVerificacion);
        newValues.id_resultado_verif_oper = getIdFromValueOrLabel(newValues.id_resultado_verif_oper, optionsResultadoVerificacion);
        
        console.log("NewValues:", newValues)

        try {               
           
            
                
                const updateSolicitud = await fetch(`${API_URL}/verificacion/solicitud/${newValues.id_instru_verif}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newValues),
                })
                console.log("updateSolicitud:", updateSolicitud)

                if (updateSolicitud.ok){
                    
                    notification.success({
                        message:"Aviso",
                        description:`Resultados de la verificación guardados correctamente`,
                        duration: 3
                        //title:"Aviso",
                        //content:`Hito Nº ${idHito} actualizado con éxito`,
                        });
                    if(handleUpdateHito){
                        setHandleUpdateHito(false)
                    } else{
                        setHandleUpdateHito(true)
                    }
                    setTouchedFields({}) // Resetear campos modificados

                   // setTimeout(()=>(handleCancel()),1000)
                   
                    //form1.resetFields();
                    //form2.resetFields();
                }
                
                else {
                    Modal.error({
                        title: 'Error',
                        content: 'Error al ingresar el certificado de calibración',
                    });
                    }

            

        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally {
            console.log("Se termina de ejecutar")
            setLoading(false)
            
        }      
    }



    return (
        <div>
            <h1>Actualización de Verificación Hito Nº{itemSelected.id_verificacion}</h1>
            <p>Registra el resultado de la verificación al instrumento</p>
                    {dataFiltered && (
                    <FormGeneralPanelLayout
                    form={form2}
                    loading={loading}
                    onValuesChange={handleValuesChange}
                    
                    style={{
                        display: 'grid',
                        justifyContent: 'center',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 2fr))',
                        width: '100%',
                        gap: '2px',
                        padding: '0 0',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                    fields={
                         [
                            {
                                type:"select",
                                name:"id_resultado_verif_fis",
                                label:"Resultado Físico",
                                initialValue:itemSelected.resultado_fisico,
                                touchedFields:"touchedFields",
                                options:optionsResultadoVerificacion,
                                optionLabelProp:"label",
                                style:{
                                    //...styleInput,
                                    borderRadius: 8,
                                    borderColor: touchedFields.id_resultado_verif_fis ? '#1890ff' : undefined,
                                    boxShadow: touchedFields.id_resultado_verif_fis? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined
                                },
                                fieldNames:{
                                    label:"label",
                                    value:"value"
                                },
                                disabled:false,
                                rules:[{
                                    required:true,
                                    message:'Porfavor ingrese el resultado físico',
                                }]
                                //placeholder:"dataDetailInstrument.id"
                            },
                            {
                                type:"select",
                                name:"id_resultado_verif_dig",
                                label:"Resultado Digital",
                                initialValue:itemSelected.resultado_digital,
                                touchedFields:"touchedFields",
                                options:optionsResultadoVerificacion,
                                optionLabelProp:"label",
                                style:{
                                    //...styleInput,
                                    borderRadius: 8,
                                    borderColor: touchedFields.id_resultado_verif_dig ? '#1890ff' : undefined,
                                    boxShadow: touchedFields.id_resultado_verif_dig? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined
                                },
                                fieldNames:{
                                    label:"label",
                                    value:"value"
                                },
                                disabled:false,
                                rules:[{
                                    required:true,
                                    message:'Porfavor ingrese el resultado digital',
                                }]
                                //placeholder:"dataDetailInstrument.id"
                            },
                            {
                                type:"select",
                                name:"id_resultado_verif_oper",
                                label:"Resultado Operativo",
                                initialValue:itemSelected.resultado_operativo,
                                touchedFields:"touchedFields",
                                options:optionsResultadoVerificacion,
                                optionLabelProp:"label",
                                style:{
                                    //...styleInput,
                                    borderRadius: 8,
                                    borderColor: touchedFields.id_resultado_verif_oper ? '#1890ff' : undefined,
                                    boxShadow: touchedFields.id_resultado_verif_oper? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined
                                },
                                fieldNames:{
                                    label:"label",
                                    value:"value"
                                },
                                disabled:false,
                                rules:[{
                                    required:true,
                                    message:'Porfavor ingrese el resultado operativo',
                                }]
                                //placeholder:"dataDetailInstrument.id"
                            },
                            {
                                type:"textarea",
                                name:"obs_result",                                
                                label:"Observaciones",
                                fullWidth:true,
                                row:10,
                                initialValue:itemSelected.obs_result,
                                touchedFields:"touchedFields",
                                disabled:false,
                                style:{
                                    //...styleInput,
                                    borderRadius: 8,
                                    borderColor: touchedFields.obs_result ? '#1890ff' : undefined,
                                    boxShadow: touchedFields.obs_result? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined
                                },
                                rules:[{
                                    required:false,
                                    message:'Porfavor ingrese el número de certificado',
                                }],
                                
                                
                            },
                            
                        ]}
                    onFinish={onFinishCertificado}
                    //onValuesChange={"handleValuesChange"}
                />
                )}
               
          
        </div>
    )})

export default FormUpdateVerificacionDatos;

