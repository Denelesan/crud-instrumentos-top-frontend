import FormGeneralPanelLayout from "../layouts/FormGeneralPanelLayout";
import { useState, useEffect} from "react";
import { useForm } from "antd/es/form/Form"
import Modal from "antd/es/modal/Modal";
import API_URL from "../config/api";
import { notification } from "antd";

const EditViewInstrumentGeneral = ({id, touchedFields, setTouchedFields, setUpdateTrigger}) => {

    const [dataDetailInstrument, setDataDetailInstrument] = useState()
    const [form] = useForm()
    const [loading, setLoading] = useState(false) // Estado de carga durante el envío del formulario
    const [tipos, setTipos] = useState([])
    const [marcas, setMarcas] = useState([])
    const [modelos, setModelos] = useState([])
    const [selectMarca, setSelectMarca] = useState(null)
    const [personal, setPersonal] = useState([])
    const [seccion, setSeccion] = useState([])
    const [materialidad, setMaterialidad] = useState([])
    const [estadoInstrumento, setEstadoInstrumento] = useState([])
    

    
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

    useEffect(() => {
        if (id){
            fetch(`${API_URL}/instrumentos/${id}`)
            .then(resp => resp.json())
            .then(data => {
                setDataDetailInstrument(data)
            })
            .catch(error => console.log("Error al traer la data", error))
        }
    }, [id])

    // Solicitar tipos de instrumentos
    useEffect(() => {
        fetch(`${API_URL}/instrumentos/tipo`)
            .then(response => response.json())
            .then(data => {

                const optionsTipos = data.map(tipo => ({
                    value: tipo.id_tipo,
                    label: tipo.tipo,
                }))
                setTipos(optionsTipos)
            }).
            catch(error => console.error("Error al obtener dato de tipo", error))
    }, [])

    //Solicitar modelo de instrumentos según su marca
    const handleChangeMarca = (e) => {
        console.log(e)
        const id_marca = e
        setSelectMarca(id_marca)
        fetch(`${API_URL}/instrumentos/modelo?id_marca=${id_marca}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const optionsModelos = data.map(modelo => ({
                    value: modelo.id_modelo,
                    label: modelo.modelo,
                }))
                console.log(optionsModelos)
                setModelos(optionsModelos)
            }).
            catch(error => console.error("Error al obtener dato de modelo", error))
    }
    // Solicitar marcas de instrumentos
    useEffect(() => {
        fetch(`${API_URL}/instrumentos/marca`)
            .then(response => response.json())
            .then(data => {
                const optionsMarcas = data.map(marca => ({
                    value: marca.id_marca,
                    label: marca.marca,
                }))
                setMarcas(optionsMarcas)
            }).
            catch(error => console.error("Error al obtener dato de marca", error))
    }, [])

    // Solicitar modelos de instrumentos
    useEffect(() => {
        fetch(`${API_URL}/instrumentos/modelos`)
            .then(response => response.json())
            .then(data => {
                const optionsModelos = data.map(modelo => ({
                    value: modelo.id_modelo,
                    label: modelo.modelo,
                }))
                console.log(data)
                setModelos(optionsModelos)
            })
            .catch(error => console.error("Error al obtener dato de modelo", error))
    }, [])

    // Solicitar personal cargo
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

    // Solicitar Sección cargo
    useEffect(() => {
        fetch(`${API_URL}/seccioncargo`)
            .then(response => response.json())
            .then(data => {
                const optionsSeccion = data.map(seccion => ({
                    value: seccion.id_seccion_depto,
                    label: seccion.seccion_depto,
                }))
                setSeccion(optionsSeccion)
            }).
            catch(error => console.error("Error al obtener dato de personal", error))
    }, [])

    // Solicitar Materialidades
    useEffect(() => {
        fetch(`${API_URL}/materialidades`)
            .then(response => response.json())
            .then(data => {
                const optionsMaterialidad = data.map(materialidad => ({
                    value: materialidad.id_materialidad,
                    label: materialidad.materialidad,
                }))
                setMaterialidad(optionsMaterialidad)
            }).
            catch(error => console.error("Error al obtener dato de personal", error))
    }, [])

    // Solicitar Estados de Instrumentos
    useEffect(() => {
        fetch(`${API_URL}/estados_instrumento`)
            .then(response => response.json())
            .then(data => {
                const optionsEstadoInstrumento = data.map(estadoInstrumento => ({
                    value: estadoInstrumento.id_estado_instru,
                    label: estadoInstrumento.estado_instru,
                }))
                setEstadoInstrumento(optionsEstadoInstrumento)
            }).
            catch(error => console.error("Error al obtener dato de personal", error))
    }, [])

    function getIdFromValueOrLabel(value, options) {
        console.log(value, options)
        // Si el value ya es un id (número), lo devolvemos
        if (typeof value === 'number') return value;
        // Si es string, buscamos el id correspondiente al label
        else {
            const found = options.find(opt => opt.label === value);
            console.log(found)
            return found ? found.value: value;
        }
        
    }


    // Función que se ejecuta al enviar el formulario
    const onFinish = async (values) => {
        setLoading(true)
        console.log("values", values)
        const { id, ...newValues } = values

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
            const response = await fetch(`${API_URL}/instrumento/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValues),
            })

            if (response.ok) {
                const data = await response.json()
                const updateData = await fetch(`${API_URL}/instrumentos/${id}`);
                const json = await updateData.json()
                //setHitoCalibrationSource(json)
                //console.log("data",json)
                //Modal.success({
                //    content: (`Instrumento Nº ${id} actualizado con éxito`),
                //});
                notification.success({
                    message:"Aviso",
                    description:`Instrumento Nº ${id} actualizado con éxito`,
                    duration: 3
                    //title:"Aviso",
                    //content:`Hito Nº ${idHito} actualizado con éxito`,
                    });
                setTouchedFields({}) // Resetear campos modificados

                setUpdateTrigger(prev => prev + 1)
                //resetear todos los campos del formulario
                //form.resetFields()
            } else {
                Modal.error({
                    title: 'Error',
                    content: 'Error al actualizar la información del instrumento. Revisar consistencia en campos de marca y modelo.',
                });

            }

        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally {
            setLoading(false)
        }
    }
    //console.log(dataDetailInstrument)

    return (
        <>
        {dataDetailInstrument ? (
        <FormGeneralPanelLayout
            loading={loading}
            fields={//Campos:
                 [
                    
                    {
                        type:"input",
                        name:"id",
                        label:"Id de Instrumento",
                        initialValue:dataDetailInstrument.id,
                        touchedFields:touchedFields,
                        disabled:true,
                        placeholder:dataDetailInstrument.id
                    },
                    {
                        type:"input",
                        name:"instrumento",
                        label:"Nombre de Instrumento",
                        initialValue:dataDetailInstrument.instrumento,
                        touchedFields:touchedFields
                    },
                    {
                        type:"select",
                        name:"id_estado_instru",
                        label:"Estado",
                        initialValue:dataDetailInstrument.estado,
                        touchedFields:touchedFields,
                        options: estadoInstrumento     
                    },
                    {
                        type:"select",
                        name:"id_tipo",
                        label:"Tipo de Instrumento",
                        initialValue:dataDetailInstrument.tipo,
                        touchedFields:touchedFields,
                        options: tipos
                    },
                    {
                        type:"select",
                        name:"id_materialidad",
                        label:"Materialidad",
                        initialValue:dataDetailInstrument.materialidad,
                        touchedFields:touchedFields,
                        options: materialidad
                    },
                    {
                        type:"select",
                        name:"id_marca",
                        label:"Marca de Instrumento",
                        initialValue:dataDetailInstrument.marca,
                        touchedFields:touchedFields,
                        options: marcas,
                        onChange:handleChangeMarca
                    },
                    {
                        type:"select",
                        name:"id_modelo",
                        label:"Modelo de Instrumento",
                        initialValue:dataDetailInstrument.modelo,
                        touchedFields:touchedFields,
                        options: modelos,
                        disabled:!selectMarca     
                    },
                    {
                        type:"select",
                        name:"rut_cargo",
                        label:"Cargo",
                        initialValue:dataDetailInstrument.cargo,
                        touchedFields:touchedFields,
                        options: personal     
                    },
                    {
                        type:"select",
                        name:"id_seccion_cargo",
                        label:"Sección",
                        initialValue:dataDetailInstrument.seccion,
                        touchedFields:touchedFields,
                        options: seccion      
                    },
                    {
                        type:"input",
                        name:"ubicacion",
                        label:"Ubicación",
                        initialValue:dataDetailInstrument.ubicacion,
                        touchedFields:touchedFields
                    }
                ]}
            onFinish={onFinish}
            onValuesChange={handleValuesChange}
            touchedFields={touchedFields}
        />
        ) : (
            <p>Cargando detalles...</p>
        )}
        </> 
    )
}

export default EditViewInstrumentGeneral;