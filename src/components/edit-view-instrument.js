import { Button, Collapse, Form, Modal, Input, Select, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"
import {ModifiedInput,ModifiedSelect} from "./fields"
import { PageLayout } from '../layouts'


const {Panel}= Collapse

const EditViewInstrument = ()=>{
    const {id} = useParams()
    const navigate = useNavigate()
    const [dataDetailInstrument, setDataDetailInstrument] = useState()
    const [form] = useForm()
    const [loading, setLoading] = useState(false) // Estado de carga durante el envío del formulario
    const [tipos, setTipos]= useState([])
    const [marcas, setMarcas] = useState([])
    const [modelos, setModelos]= useState([])
    const [selectMarca, setSelectMarca] = useState(null)
    const [personal, setPersonal] = useState([])
    const [seccion, setSeccion] = useState([])
    const [materialidad, setMaterialidad] = useState([])
    const [estadoInstrumento, setEstadoInstrumento] = useState([])
    const [touchedFields, setTouchedFields] = useState({}) // Campos que han sido modificados
    
    // Función para manejar cambios en los campos del formulario
    const handleValuesChange = (changedValues, allValues) => {
        const newTouchedFields = { ...touchedFields };
        console.log(newTouchedFields)
        console.log("changedValues", changedValues)
        Object.keys(changedValues).forEach(field => {
            newTouchedFields[field] = true;
        });
        setTouchedFields(newTouchedFields);
    };

    useEffect(()=>{
        fetch(`http://localhost:5000/api/instrumentos/${id}`)
        .then(resp=>resp.json())
        .then(data => setDataDetailInstrument(data))
        .catch(error=> console.log("Error al traer la data", error))

    }, [id])

    // Solicitar tipos de instrumentos
    useEffect(()=>{
        fetch('http://localhost:5000/api/instrumentos/tipo')
        .then(response => response.json())
        .then(data=>{
            
            const optionsTipos = data.map(tipo=>({
                value: tipo.id_tipo,
                label: tipo.tipo,
            }))
            setTipos(optionsTipos)
        }).
        catch(error=>console.error("Error al obtener dato de tipo", error))
    }, [])

    //Solicitar modelo de instrumentos según su marca
    const handleChangeMarca = (e)=>{
        console.log(e)
        const id_marca = e
        setSelectMarca(id_marca)
        fetch(`http://localhost:5000/api/instrumentos/modelo?id_marca=${id_marca}`)
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            const optionsModelos = data.map(modelo=>({
                value: modelo.id_modelo,
                label: modelo.modelo,
            }))
            setModelos(optionsModelos)
        }).
        catch(error=>console.error("Error al obtener dato de modelo", error))
    }
     // Solicitar marcas de instrumentos
     useEffect(()=>{
        fetch('http://localhost:5000/api/instrumentos/marca')
        .then(response => response.json())
        .then(data=>{
            const optionsMarcas = data.map(marca=>({
                value: marca.id_marca,
                label: marca.marca,
            }))
            setMarcas(optionsMarcas)
        }).
        catch(error=>console.error("Error al obtener dato de marca", error))
    }, [])

     // Solicitar modelos de instrumentos
     useEffect(()=>{
        fetch(`http://localhost:5000/api/instrumentos/modelos`)
        .then(response => response.json())
        .then(data=>{
            const optionsModelos = data.map(modelo=>({
                value: modelo.id_modelo,
                label: modelo.modelo,
            }))
            console.log(data)
            setModelos(optionsModelos)
        })
        .catch(error=>console.error("Error al obtener dato de modelo", error))
    }, [])

    // Solicitar personal cargo
    useEffect(()=>{
        fetch('http://localhost:5000/api/personalcargo')
        .then(response => response.json())
        .then(data=>{
            const optionsPersonal = data.map(personal=>({
                value: personal.rut_cargo,
                label: personal.nombre,
            }))
            setPersonal(optionsPersonal)
        }).
        catch(error=>console.error("Error al obtener dato de personal", error))
    }, [])

    // Solicitar Sección cargo
    useEffect(()=>{
        fetch('http://localhost:5000/api/seccioncargo')
        .then(response => response.json())
        .then(data=>{
            const optionsSeccion = data.map(seccion=>({
                value: seccion.id_seccion_depto,
                label: seccion.seccion_depto,
            }))
            setSeccion(optionsSeccion)
        }).
        catch(error=>console.error("Error al obtener dato de personal", error))
    }, [])

    // Solicitar Materialidades
    useEffect(()=>{
        fetch('http://localhost:5000/api/materialidades')
        .then(response => response.json())
        .then(data=>{
            const optionsMaterialidad = data.map(materialidad=>({
                value: materialidad.id_materialidad,
                label: materialidad.materialidad,
            }))
            setMaterialidad(optionsMaterialidad)
        }).
        catch(error=>console.error("Error al obtener dato de personal", error))
    }, [])

    // Solicitar Estados de Instrumentos
    useEffect(()=>{
        fetch('http://localhost:5000/api/estados_instrumento')
        .then(response => response.json())
        .then(data=>{
            const optionsEstadoInstrumento = data.map(estadoInstrumento=>({
                value: estadoInstrumento.id_estado_instru,
                label: estadoInstrumento.estado_instru,
            }))
            setEstadoInstrumento(optionsEstadoInstrumento)
        }).
        catch(error=>console.error("Error al obtener dato de personal", error))
    }, [])

    function getIdFromValueOrLabel(value, options) {
        // Si el value ya es un id (número), lo devolvemos
        if (typeof value === 'number') return value;
        // Si es string, buscamos el id correspondiente al label
        const found = options.find(opt => opt.label === value);
        return found ? found.value : value;
    }

    // Función que se ejecuta al enviar el formulario
    const onFinish= async (values)=>{
        setLoading(true)
        console.log("values", values)
        const {id,...newValues} = values

        // Normalizamos los campos relacionales
        newValues.id_tipo = getIdFromValueOrLabel(newValues.id_tipo, tipos);
        newValues.id_materialidad = getIdFromValueOrLabel(newValues.id_materialidad, materialidad);
        newValues.id_marca = getIdFromValueOrLabel(newValues.id_marca, marcas);
        newValues.id_modelo = getIdFromValueOrLabel(newValues.id_modelo, modelos);
        newValues.rut_cargo = getIdFromValueOrLabel(newValues.rut_cargo, personal);
        newValues.id_seccion_cargo = getIdFromValueOrLabel(newValues.id_seccion_cargo, seccion);
        newValues.id_estado_instru = getIdFromValueOrLabel(newValues.id_estado_instru, estadoInstrumento);

        console.log("NewValues", newValues)
        try {
            // Enviar datos actualizados al servidor
            const response = await fetch(`http://localhost:5000/api/instrumento/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValues),
            })
            
            if (response.ok){
                const data = await response.json()
                const updateData = await fetch(`http://localhost:5000/api/instrumentos/${id}`);
                const json = await updateData.json()
                //setHitoCalibrationSource(json)
                //console.log("data",json)
                Modal.success({
                    content: (`Instrumento Nº ${id} actualizado con éxito`),
                  });
                setTouchedFields({}) // Resetear campos modificados
                //resetear todos los campos del formulario
                //form.resetFields()
            } else{
                Modal.error({
                    title: 'Error',
                    content: 'Error al actualizar la información del instrumento',
                  });
                
            }
            
        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally{
            setLoading(false)
        }
    }
    //console.log(dataDetailInstrument)

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

    return (
        <PageLayout
            title="Edición de Instrumento Topográfico"
            onBackClick={handleBack}
            titleBanner="Sistema de Gestión"
            subtitle="Instrumentos y Accesorios Topográficos"
        >
            <Collapse 
                accordion
                defaultActiveKey={['1']}
            >
                <Panel header="Información General" key="1">
                    {dataDetailInstrument ? (
                        <Form 
                            form={form}
                            name="form_item_path" 
                            layout="vertical"
                            onFinish={onFinish}
                            onValuesChange={handleValuesChange}
                        >
                            <div style={{ 
                                display: 'grid', 
                                justifyContent: 'center',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                width: 'auto',
                                gap: '25px', 
                                marginLeft: '5em',
                            }}>
                                <ModifiedInput
                                    name="id"
                                    label="Id de Instrumento"
                                    initialValue={dataDetailInstrument.id}
                                    touchedFields={touchedFields}
                                    disabled={true}
                                    placeholder={dataDetailInstrument.id}
                                />
                                <ModifiedInput
                                    name="instrumento"
                                    label="Nombre de Instrumento"
                                    initialValue={dataDetailInstrument.instrumento}
                                    touchedFields={touchedFields}
                                />
                                <ModifiedSelect
                                    name="id_tipo"
                                    label="Tipo de Instrumento"
                                    initialValue={dataDetailInstrument.tipo}
                                    touchedFields={touchedFields}
                                    options={tipos}
                                />
                                <ModifiedSelect
                                    name="id_materialidad"
                                    label="Materialidad"
                                    initialValue={dataDetailInstrument.materialidad}
                                    touchedFields={touchedFields}
                                    options={materialidad}
                                />
                                <ModifiedSelect
                                    name="id_marca"
                                    label="Marca de Instrumento"
                                    initialValue={dataDetailInstrument.marca}
                                    touchedFields={touchedFields}
                                    options={marcas}
                                    onChange={handleChangeMarca}
                                /> 
                                <ModifiedSelect
                                    name="id_modelo"
                                    label="Modelo de Instrumento"
                                    initialValue={dataDetailInstrument.modelo}
                                    touchedFields={touchedFields}
                                    options={modelos}
                                    disabled={!selectMarca}
                                /> 
                                <ModifiedSelect
                                    name="rut_cargo"
                                    label="Cargo"
                                    initialValue={dataDetailInstrument.cargo}
                                    touchedFields={touchedFields}
                                    options={personal}
                                />
                                <ModifiedSelect
                                    name="id_seccion_cargo"
                                    label="Sección"
                                    initialValue={dataDetailInstrument.seccion}
                                    touchedFields={touchedFields}
                                    options={seccion}
                                />
                                <ModifiedInput
                                    name="ubicacion"
                                    label="Ubicación"
                                    initialValue={dataDetailInstrument.ubicacion}
                                    touchedFields={touchedFields}
                                />
                                <ModifiedSelect
                                    name="id_estado_instru"
                                    label="Estado"
                                    initialValue={dataDetailInstrument.estado}
                                    touchedFields={touchedFields}
                                    options={estadoInstrumento}
                                />
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: "center",
                                marginTop: "20px"
                            }}>
                                <Button type="primary" style={{width: "10rem"}} loading={loading} htmlType="submit">Guardar</Button>
                            </div>
                        </Form>
                    ) : (
                        <p>Cargando detalles...</p>
                    )}
                </Panel>
                
                <Panel header="Verificaciones" key="2">
                    <div style={{
                        display: 'flex',
                        justifyContent: "center",
                        marginTop: "20px"
                    }}>
                        <Button type="primary" style={{width: "auto"}} htmlType="submit">Agregar Datos de Verificación</Button>
                    </div>
                </Panel>
                
                <Panel header="Calibraciones" key="3">
                    <div style={{
                        display: 'flex',
                        justifyContent: "center",
                        marginTop: "20px"
                    }}>
                        <Button type="primary" style={{width: "auto"}} htmlType="submit">Agregar Datos de Calibración</Button>
                    </div>
                </Panel>
            </Collapse>
        </PageLayout>
    );
}


export default EditViewInstrument