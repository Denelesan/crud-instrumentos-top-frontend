import { forwardRef, useState,useImperativeHandle, useEffect  } from "react";
import { AntDesignOutlined,RollbackOutlined } from '@ant-design/icons';
import { Button, Form, Select,message,notification, Checkbox, Card,Input,Space,Tag,Badge,Popconfirm,Tooltip} from "antd";
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
    const [tareasTemporales, setTareasTemporales] = useState([]);
    const [mostrarFormTarea, setMostrarFormTarea] = useState(false);
    const [optionsCriticidad, setOptionCriticidad] = useState()
    const [optionsEstadoTarea, setOptionEstadoTarea] = useState()
    const [personal, setPersonal] = useState([])
    const [tareasEliminar, setTareasEliminar] = useState([])
    //const [formTarea] = Form.useForm();
    const [tareaForm, setTareaForm] = useState({
        titulo: "",
        descripcion:"",
        id_criticidad: undefined,
        rut_cargo: undefined,
        id_estado_tarea: 1,
        
    });

    //Para enlistar tareas asociadas al instrumento y al hito de verificacion
    useEffect(()=>{
        fetch(`${API_URL}/tareas/${itemSelected.id_instrumento}`)
        .then(res => res.json())
        .then(response=>{
            let tareasFilter = response.filter(tarea=>tarea.id_verificacion ===itemSelected.id_verificacion)
            console.log("tareasfilter", tareasFilter)
            setTareas(tareasFilter)       
        })
    },[handleUpdateHito])

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

        //Agregamos y normalizamos campos para el fetch de tareas
        const tareasConDatos = tareasTemporales.map(tareaTemporal => ({
            ...tareaTemporal,
            id_instrumento: dataFiltered[0].id_instrumento,
            id_verificacion: dataFiltered[0].id_verificacion,
            id_creado_por : getIdFromValueOrLabel(dataFiltered[0].responsable, personal)
        }));
        
        console.log("NewValues:", newValues)

        try {               
           
            
                
                const updateSolicitud = await fetch(`${API_URL}/verificacion/solicitud/${newValues.id_instru_verif}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newValues),
                })

                const addTasks = await fetch(`${API_URL}/verificacion/agregar_tareas`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tareasConDatos),
                })
                //console.log("updateSolicitud:", updateSolicitud)

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
                    setTouchedFields({}) // Resetear campos modificados
                    setTareasTemporales([])

                   // setTimeout(()=>(handleCancel()),1000)
                   
                    //form1.resetFields();
                    //form2.resetFields();
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
    
        setTareasTemporales(prev => [
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

    const eliminarTarea = (id) => { //EN ESTE CASO ANALIZAR SI MAS QUE SACAR DE LA LISTA, PUEDE SER CAMBIAR EL ESTILO A BORRADOR
        
        //setTareas(prev => prev.filter(tarea => tarea.id_tarea !== id));
        setTareasEliminar(prev=>[...prev,id])
        console.log(tareasEliminar)
    };

    const eliminarTareaTemporal = (id) => {
        setTareasTemporales(prev => prev.filter(tareaTemporal => tareaTemporal.id !== id));
    };

    const cambiarEstadoTarea = (id, checked) => {

        setTareas(prev =>
            prev.map(tarea =>
                tarea.id_tarea === id
                    ? { ...tarea, completada: checked }
                    : tarea
            )
        );
    };

    const restaurarTarea = (id) => {
        console.log(id)
        setTareasEliminar(prev =>
            prev.filter(tareaId => tareaId !== id)
        );
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
                                    touchedFields={touchedFields}
                                    options={optionsResultadoVerificacion}
                                    optionLabelProp="label"
                                    style={
                                       { //...styleInput,
                                        borderRadius: 8,
                                        borderColor: touchedFields.id_resultado_verif_fis ? '#1890ff' : undefined,
                                        boxShadow: touchedFields.id_resultado_verif_fis? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined}
                                    }
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
                                    touchedFields={touchedFields}
                                    options={optionsResultadoVerificacion}
                                    optionLabelProp="label"
                                    style={{
                                        //...styleInput,
                                        borderRadius: 8,
                                        borderColor: touchedFields.id_resultado_verif_dig ? '#1890ff' : undefined,
                                        boxShadow: touchedFields.id_resultado_verif_dig? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined}
                                    }
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
                                    touchedFields={touchedFields}
                                    disabled={false}
                                    style={{
                                        //...styleInput,
                                        borderRadius: 8,
                                        borderColor: touchedFields.obs_result ? '#1890ff' : undefined,
                                        boxShadow: touchedFields.obs_result? '0 0 0 2px rgba(24, 144, 255, 1)' : undefined}
                                    }
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
                    width: "100%",
                    
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
                            background: "#fafafa",
                            backgroundColor:"red"
                            
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
            
                            {tareas.length > 0 || tareasTemporales.length>0 ? (
            
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
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        padding: "10px 15px 10px 1px",
                        borderBottom: "1px solid #f0f0f0",
                        backgroundColor: tareasEliminar.includes(tarea.id_tarea)
                        ? "#fff2f0"
                        : "transparent",
                        borderRadius:"10px"

                    }}
                >
                    <Checkbox
                                            checked={tarea.completada}
                                            onChange={e =>
                                                cambiarEstadoTarea(
                                                    tarea.id_tarea,
                                                    e.target.checked
                                                )
                                            }
                                        >
                                            <span
                                                style={{
                                                    textDecoration:
                                                        tarea.completada
                                                            ? "line-through"
                                                            : "none"
                                                }}
                                            >
                                                {tarea.titulo}
                                            </span>
                                        </Checkbox>
            
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
            
                        <span style={{fontSize:12}}>
                            {tarea.asignado_tarea}
                        </span>
            
                        <Tag>
                            {tarea.estado_tarea}
                        </Tag>
                        {tareasEliminar.includes(tarea.id_tarea) ? (
                            <Tooltip title="Restaurar">
                            <Button
                                type="text"
                                onClick={() => restaurarTarea(tarea.id_tarea)}
                                style={{
                                    fontSize: "13px",
                                    padding: "0 4px",
                                    color:"blue"
                                }}
                            >
                                <RollbackOutlined />
                            </Button>
                            </Tooltip>
                        ) : (
                        <Popconfirm
                            title="¿Eliminar tarea temporalmente?"
                            description="La tarea será eliminada al guardar los cambios."
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => eliminarTarea(tarea.id_tarea)}
                        >
                            <Button
                                type="text"
                                danger
                                //onClick={() => eliminarTarea(tarea.id_tarea)}
                                style={{
                                    fontSize: "16px",
                                    padding: "0 4px"
                                }}
                            >
                                ×
                            </Button>
                        </Popconfirm>)}
                         
                        
                    </Space>
                </div>
            ))}
            {/* ==========================================
                    LISTADO DE TAREAS TEMPORALES
                ========================================== */}
            {tareasTemporales.map((tareaTemporal) => (
                <div
                    key={tareaTemporal.id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 15px 10px 1px",
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
                                fontSize: "35px",
                                lineHeight: 1,
                            }}
                        >
                            •
                        </span>

                        <span style={{
                            color:"grey"
                        }}>
                            {tareaTemporal.titulo}
                        </span>
                    </div>

                    <Space>
                        <Tag
                            
                        >
                            {optionsCriticidad.find(
                                criticidad => criticidad.value === tareaTemporal.id_criticidad
                            )?.label}
                        </Tag>

                        <span style={{fontSize:12,color:"grey"}}>
                            {personal.find(
                                persona => persona.value === tareaTemporal.id_responsable
                            )?.label}
                            
                        </span>

                        <Tag>
                        {optionsEstadoTarea.find(
                                estadoTareas => estadoTareas.value === tareaTemporal.id_estado_tarea
                            )?.label}
                        </Tag>
                        
                            <Button
                            type="text"
                            danger
                            onClick={() => eliminarTareaTemporal(tareaTemporal.id)}
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
                            <Badge
                                count={
                                    
                                    //fileList.length
                                    Object.keys(tareasTemporales).length || Object.keys(touchedFields).length || Object.keys(tareasEliminar)
                                    //-fileList.length
                                    ? 
                                    //fileList.length 
                                    Object.keys(tareasTemporales).length + Object.keys(touchedFields).length + Object.keys(tareasEliminar).length
                                    //-fileList.length
                                    : null 
                                    //changeAddInstrument.length + changeDeleteInstrument.length ? changeAddInstrument.length + changeDeleteInstrument.length : null
                                }
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
                            </Badge>
                        </div>
            
                    </Form>
            
                </div>
            
          
                )}
               
          
        </div>
    )})

export default FormUpdateVerificacionDatos;