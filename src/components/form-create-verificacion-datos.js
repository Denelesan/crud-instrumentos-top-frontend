import { forwardRef, useState,useImperativeHandle, useEffect  } from "react";
import {
    Button,
    Form,
    Select,
    message,
    notification,
    Input,
    Checkbox,
    Card,
    Space,
    Tag,
    Divider
} from "antd";
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

const FormCreateVerificacionDatos = forwardRef((props, ref) => {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
   
    const {id_instrumento, handleUpdateInput,setUpdateTrigger} = props
    //console.log(id_instrumento)
    const [hitoSelected, setHitoSelected] = useState()
    const [loading, setLoading] = useState(false)
    const [dataFiltered, setDataFiltered] = useState()
    const [dataSelected, setDataSelected] = useState()
    const [optionsVerificacion, setOptionsVerificacion] = useState()
    const [optionsResultadoVerificacion, setoptionsResultadoVerificacion] = useState()
    const [handleUpdateHito, setHandleUpdateHito] = useState(false)
    const [tareas, setTareas] = useState([]);
    const [mostrarFormTarea, setMostrarFormTarea] = useState(false);
    const [optionsCriticidad, setOptionCriticidad] = useState()
    const [optionsEstadoTarea, setOptionEstadoTarea] = useState()
    const [personal, setPersonal] = useState([])
    //const [formTarea] = Form.useForm();
    const [tareaForm, setTareaForm] = useState({
        titulo: "",
        descripcion:"",
        id_criticidad: undefined,
        rut_cargo: undefined,
        id_estado_tarea: 1,
        
    });
   

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
        fetch(`${API_URL}/criticidad_tarea`)
        .then(response => response.json())
        .then(data =>{
            const opcionesCriticidad = data.map(criticidad=>({
                value:criticidad.id_criticidad,
                label: criticidad.criticidad
            }))
            setOptionCriticidad(opcionesCriticidad)
        })
        .catch (error =>(console.log("Error en la solicitud", error)))
        .finally(()=>{
            setLoading(false)
        })

    },[])

    useEffect(()=>{
        fetch(`${API_URL}/estado_tarea`)
        .then(response => response.json())
        .then(data =>{
            const opcionesEstadoTareas = data.map(estadoTareas=>({
                value:estadoTareas.id_estado_tarea,
                label: estadoTareas.estado_tarea
            }))
            setOptionEstadoTarea(opcionesEstadoTareas)
        })
        .catch (error =>(console.log("Error en la solicitud", error)))
        .finally(()=>{
            setLoading(false)
        })

    },[])

    // Solicitar personal responsable
    useEffect(() => {
        fetch(`${API_URL}/personalcargo`)
            .then(response => response.json())
            .then(data => {
                const optionsPersonal = data.map(personal => ({
                    value: personal.rut_cargo,
                    label: personal.nombre,
                }))
                setPersonal(optionsPersonal)
            }).
            catch(error => console.error("Error al obtener dato de personal", error))
    }, [])

    

    useEffect(()=>{
        fetch(`${API_URL}/instrumento/verificaciones/${id_instrumento}`)
        .then(res => res.json())
        .then(response=>{
            const dataRowFiltered = response.filter(
                item => item.resultado_fisico == null && item.estado_verif === "Verificado"
            )
            
            setDataFiltered(dataRowFiltered)
            console.log(dataFiltered)
            return dataRowFiltered
        })
        .then(result =>{
            //console.log(result)
            const options = result.map(option=>({
                value: option.id_instru_verif,
                label: `Id Hito: ${option.id_verificacion}`,
            }))
            setOptionsVerificacion(options)
            
        })


    },[handleUpdateHito])

    useEffect(()=>{
        if (dataFiltered) {
            const dataSelectedByHito = dataFiltered.find(e=>
                e.id_instru_verif === hitoSelected
            )
            setDataSelected(dataSelectedByHito)
        } 
        
        

    }, [hitoSelected])
    
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
        
        newValues.id_instru_verif = dataSelected.id_instru_verif;
        newValues.id_tipo_instru = dataSelected.id_tipo;
        newValues.id_instrumento = dataSelected.id_instrumento;
        //newValues.id_estado_certif = getIdFromValueOrLabel(newValues.estado_certif, optionsEstadoCertificado);

        //Agregamos y normalizamos campos para el fetch de tareas
        const tareasConDatos = tareas.map(tarea => ({
            ...tarea,
            id_instrumento: dataSelected.id_instrumento,
            id_verificacion: dataSelected.id_verificacion,
            id_creado_por : getIdFromValueOrLabel(dataSelected.responsable, personal)
        }));
        
         
        //id_instrumento, id_instru_verif,titulo,descripcion, id_criticidad, id_estado_tarea, id_creado_por,id_responsable

        //console.log("NewValues:", newValues)
        //console.log("Tareas:", tareasConDatos)

        try {               
           
            
                
                const updateSolicitud = await fetch(`${API_URL}/verificacion/solicitud/${newValues.id_instru_verif}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newValues),
                })
                console.log("updateSolicitud:", updateSolicitud)

                const addTasks = await fetch(`${API_URL}/verificacion/agregar_tareas`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tareasConDatos),
                })

                if (updateSolicitud.ok && addTasks.ok){
                    
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
                    setUpdateTrigger(prev => prev + 1)
                    setTareas([])
                   
                    form1.resetFields();
                    form2.resetFields();
                }
                
                else {
                    Modal.error({
                        title: 'Error',
                        content: 'Error al ingresar los resultados de la verificación',
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
    
        if (!tareaForm.id_criticidad) {
            notification.warning({
                message: "Aviso",
                description: "Seleccione la criticidad"
            });
    
            return;
        }
    
        if (!tareaForm.rut_cargo) {
            notification.warning({
                message: "Aviso",
                description: "Seleccione un responsable"
            });
    
            return;
        }
    
        const nuevaTarea = {
            id: Date.now(),
            titulo: tareaForm.titulo,
            descripcion:tareaForm.descripcion,
            id_criticidad: tareaForm.id_criticidad,
            id_responsable: tareaForm.rut_cargo,
            id_estado_tarea: tareaForm.id_estado_tarea,
            //completada: false
        };
    
        setTareas(prev => [
            ...prev,
            nuevaTarea
        ]);
    
        setTareaForm({
            titulo: "",
            id_criticidad: undefined,
            rut_cargo: undefined,
            id_estado_tarea:1
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

    const eliminarTarea = (id) => {
        setTareas(prev => prev.filter(tarea => tarea.id !== id));
    };



    return (
        

<div>

<h1>Nueva Verificación</h1>

<p>
    Registra el resultado de la verificación al instrumento
</p>

{/* ==================================================
    SELECCIÓN DEL HITO
================================================== */}

<Form
    form={form1}
    name="form_item_path"
    layout="vertical"
    initialValues={{}}
>

    <Form.Item
        label="Hito de Verificación"
        name="id_hito_verificacion"
        rules={[
            {
                required: true,
                message:
                    "Por favor seleccione un hito de verificación"
            }
        ]}
    >

        <Select
            placeholder="Selecciona un hito de verificación"
            onChange={handleChange}
            style={{
                width: "200px"
            }}
            options={optionsVerificacion}
        />

    </Form.Item>

</Form>


{hitoSelected && (

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
                        initialValue={null}
                        touchedFields="touchedFields"
                        options={optionsResultadoVerificacion}
                        optionLabelProp="label"
                        fieldNames={{
                            label: "label",
                            value: "value"
                        }}
                        disabled={false}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Porfavor ingrese el resultado físico",
                            }
                        ]}
                    />

                </div>


                {/* Resultado Digital */}

                <div>

                    <ModifiedSelect
                        type="select"
                        name="id_resultado_verif_dig"
                        label="Resultado Digital"
                        initialValue={null}
                        touchedFields="touchedFields"
                        options={optionsResultadoVerificacion}
                        optionLabelProp="label"
                        fieldNames={{
                            label: "label",
                            value: "value"
                        }}
                        disabled={false}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Porfavor ingrese el resultado digital",
                            }
                        ]}
                    />

                </div>


                {/* Resultado Operativo */}

                <div>

                    <ModifiedSelect
                        type="select"
                        name="id_resultado_verif_oper"
                        label="Resultado Operativo"
                        initialValue={null}
                        touchedFields="touchedFields"
                        options={optionsResultadoVerificacion}
                        optionLabelProp="label"
                        fieldNames={{
                            label: "label",
                            value: "value"
                        }}
                        disabled={false}
                        rules={[
                            {
                                required: true,
                                message:
                                    "Porfavor ingrese el resultado operativo",
                            }
                        ]}
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
                        initialValue={null}
                        touchedFields="touchedFields"
                        disabled={false}
                        rules={[
                            {
                                required: false,
                                message:
                                    "Porfavor ingrese el número de certificado",
                            }
                        ]}
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
                        <Form.Item
                            label="Descripción de la tarea"
                        >

                            <Input
                                value={
                                    tareaForm.descripcion
                                }
                                onChange={e =>
                                    handleChangeTarea(
                                        "descripcion",
                                        e.target.value
                                    )
                                }
                                placeholder="Ej: La sujeción del trípode se encuentra suelta, y al momento de ..."
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
                                        tareaForm.id_criticidad
                                    }
                                    onChange={value =>
                                        handleChangeTarea(
                                            "id_criticidad",
                                            value
                                        )
                                    }
                                    placeholder="Seleccione"
                                    options={optionsCriticidad}
                                />

                            </Form.Item>


                            <Form.Item
                                label="Responsable"
                            >

                                <Select
                                    value={
                                        tareaForm.rut_cargo
                                    }
                                    onChange={value =>
                                        handleChangeTarea(
                                            "rut_cargo",
                                            value
                                        )
                                    }
                                    placeholder="Seleccione responsable"
                                    options={personal}
                                />

                            </Form.Item>


                            <Form.Item
                                label="Estado"
                            >

                                <Select
                                    value={1}
                                    onChange={value =>
                                        handleChangeTarea(
                                            "id_estado_tarea",
                                            value
                                        )
                                    }
                                    disabled={true}
                                    options={optionsEstadoTarea}
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
                    tarea.id_criticidad === 4
                        ? "red"
                        : tarea.id_criticidad === 3
                            ? "orange"
                            : tarea.id_criticidad === 2
                                ? "gold"
                                : "green"
                }
            >
                {optionsCriticidad.find(
                    criticidad => criticidad.value === tarea.id_criticidad
                )?.label}
            </Tag>

            <span>
                {personal.find(
                    persona => persona.value === tarea.id_responsable
                )?.label}
                
            </span>

            <Tag>
            {optionsEstadoTarea.find(
                    estadoTareas => estadoTareas.value === tarea.id_estado_tarea
                )?.label}
            </Tag>
            <Button
                type="text"
                danger
                onClick={() => eliminarTarea(tarea.id)}
                style={{
                    fontSize: "16px",
                    padding: "0 4px"
                }}
            >
                ×
            </Button>
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
);
})

export default FormCreateVerificacionDatos;
