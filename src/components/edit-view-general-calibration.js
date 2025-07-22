import { Button, Collapse, DatePicker, Form, Input, Select, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import dayjs from "dayjs"

// Estilo CSS para el Select cuando ha sido modificado
const modifiedSelectStyle = `
    .modified-select .ant-select-selector {
        border-color: #1890ff !important;
    }
`;

/**
 * Componente para editar la información general de un hito de calibración
 * @param {string} idHito - ID del hito de calibración a editar
 */
const EditGeneralViewCalibration = ({idHito, updateTrigger}) => {

    // Estados para manejar los datos y el estado del formulario
    const [dataHitoCalibration, setDataHitoCalibration] = useState() // Datos del hito de calibración
    const [form] = useForm() // Instancia del formulario de Ant Design
    const [empresas, setEmpresas] = useState() // Lista de empresas calibradoras
    const [modelos, setModelos]= useState([])
    const [loading, setLoading] = useState(false) // Estado de carga durante el envío del formulario
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

    // Cargar datos del hito de calibración
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/calibration/${idHito}`);
                const data = await response.json();
                setDataHitoCalibration(data[0]);
                console.log("Data actualizada:", data[0]);
            } catch (error) {
                console.error("Error al traer la data:", error);
            }
        };

        fetchData();
    }, [idHito, updateTrigger]); // Se ejecutará cuando cambie updateTrigger

    // Actualizar el formulario cuando cambien los datos
    useEffect(() => {
        if (dataHitoCalibration) {
            form.setFieldsValue({
                IdHito: dataHitoCalibration["Id Hito"],
                fecha_solicitud: dataHitoCalibration["Fecha Solicitud"] ? dayjs(dataHitoCalibration["Fecha Solicitud"], "YYYY-MM-DD") : "",
                estado: dataHitoCalibration["Estado Hito"],
                orden_de_compra: dataHitoCalibration["Orden de Compra"],
                precio_oc: Math.round(dataHitoCalibration["Precio Orden de Compra"], 9),
                id_empresa: dataHitoCalibration.empresa
            });
        }
    }, [dataHitoCalibration, form]);

    // Cargar lista de empresas calibradoras
    useEffect(()=>{
        fetch('http://localhost:5000/api/calibration_empresas')
        .then(response => response.json())
        .then(data=>{
            //<console.log("data", data)
            const optionsEmpresas = data.map(empresa=>({
                value: empresa.id_empresa,
                label: empresa.empresa
            }))
            console.log(optionsEmpresas)
            setEmpresas(optionsEmpresas)
        }).catch(error=> console.error("Error al obtener las empresas calibradoras", error))
    },[])
    // Solicitar modelos de instrumentos
    useEffect(()=>{
        
        fetch('http://localhost:5000/api/instrumentos/modelo')
        .then(response => response.json())
        .then(data=>{
            const optionsModelos = data.map(modelo=>({
                value: modelo.id_modelo,
                label: modelo.modelo,
            }))
            setModelos(optionsModelos)
        }).
        catch(error=>console.error("Error al obtener dato de marca", error))
    }, [])

    //console.log(dataHitoCalibration)
    const styleInput = {
        width: 'auto'
    }

    // Función que se ejecuta al enviar el formulario
    const onFinish= async (values)=>{
        setLoading(true)
        console.log("values", values)
        const {IdHito,...newValues} = values
        
        // Manejo de fecha nula
        if (newValues.fecha_solicitud === "" || newValues.fecha_solicitud === undefined){
            newValues.fecha_solicitud = null;
        }

        // Conversión de nombre de empresa a ID
        if (newValues.id_empresa && typeof newValues.id_empresa === 'string') {
            const empresaSeleccionada = empresas.find(emp => emp.label === newValues.id_empresa);
            if (empresaSeleccionada) {
                newValues.id_empresa = empresaSeleccionada.value;
            }
        }
        
        // Conversión de precio a número si es string
        if (typeof newValues.precio_oc === "string"){
            newValues.precio_oc = parseFloat(newValues.precio_oc);
        }
        console.log("NewValues", newValues)
        try {
            // Enviar datos actualizados al servidor
            const response = await fetch(`http://localhost:5000/api/calibration/${idHito}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValues),
            })
            
            if (response.ok){
                const data = await response.json()
                const updateData = await fetch('http://localhost:5000/api/calibration');
                const json = await updateData.json()
                //setHitoCalibrationSource(json)
                //console.log("data",json)
                message.success(`Hito Nº ${idHito} actualizado con éxito`);
                setTouchedFields({}) // Resetear campos modificados
                //resetear todos los campos del formulario
                //form.resetFields()
            } else{
                message.error("Error al actualizar el Hito de Calibración")
            }
            
        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally{
            setLoading(false)
        }
    }

    return (
        <div style={{
            width: "100%"
        }}>
            <style>{modifiedSelectStyle}</style>
            {dataHitoCalibration ? (
            <Form 
            form={form}
            name="form_item_path" 
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={handleValuesChange}
                
                //disabled= "false"
                >
                <div style={{ 
                    display: 'grid', 
                    //flexWrap: 'wrap', 
                    justifyContent: 'center',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    //gridTemplateColumns: '1fr 1fr 1fr',
                    width: '80%',
                    gap: '25px', 
                    margin: '0 auto'
                    //marginLeft: '5em',
                    //marginRight: '5em'
                  }}>
                <Form.Item 
                    label="Id Hito"
                    name="IdHito" 
                >
                    <Input disabled= "false" placeholder={dataHitoCalibration["Id Hito"]} style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Fecha de Solicitud"
                    name="fecha_solicitud" 
                    initialValue={dataHitoCalibration["Fecha Solicitud"]?dayjs(dataHitoCalibration["Fecha Solicitud"], "YYYY-MM-DD"):""}
                >
                    <DatePicker disabled={true}
                        //{!dayjs(dataHitoCalibration["Fecha Solicitud"]).isValid()} 
                        style={styleInput}/>
                    
                </Form.Item>
                <Form.Item 
                    label="Estado"
                    name="estado" 
                    initialValue={dataHitoCalibration["Estado Hito"]}
                >
                   
                    <Select
                        disabled="true"
                        style={{width:"200px"}}
                        options={""}
                        />
                </Form.Item>
                <Form.Item 
                    label="Nº Orden de Compra"
                    name="orden_de_compra" 
                    initialValue={dataHitoCalibration["Orden de Compra"]}
                >
                    <Input 
                        disabled={dataHitoCalibration["Estado Hito"]==="Finalizado"?true:false}
                        style={{
                            ...styleInput,
                            borderColor: touchedFields.orden_de_compra ? '#1890ff' : undefined,
                            boxShadow: touchedFields.orden_de_compra ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : undefined
                        }}
                    />
                </Form.Item>
                <Form.Item 
                    label="Precio"
                    name="precio_oc" 
                    initialValue={Math.round(dataHitoCalibration["Precio Orden de Compra"],9)}
                >
                    <Input 
                        disabled={dataHitoCalibration["Estado Hito"]==="Finalizado"?true:false}
                        prefix="$" 
                        suffix="CLP" 
                        style={{
                            ...styleInput,
                            borderColor: touchedFields.precio_oc ? '#1890ff' : undefined,
                            boxShadow: touchedFields.precio_oc ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : undefined
                        }}
                    />
                </Form.Item> 
                <Form.Item 
                    label="Empresa"
                    name="id_empresa" 
                    initialValue={dataHitoCalibration.empresa}
                >
                    <Select 
                        disabled={dataHitoCalibration["Estado Hito"]==="Finalizado"?true:false}
                        className={touchedFields.id_empresa ? 'modified-select' : ''}
                        style={{
                            width:'200px',
                            boxShadow: touchedFields.id_empresa ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : undefined
                        }}
                        initialValue={dataHitoCalibration.empresa}
                        options={empresas}
                        optionLabelProp="label"
                        /*fieldNames={{
                            label: 'label',
                            value: 'value'
                        }}*/
                    />
                </Form.Item>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    marginTop: "20px"
                    
                }}>
                    <Button type="primary" style={{width: "10rem"}} loading={loading} htmlType="submit">Guardar</Button>
                </div>
                
                
                </Form>) : 
                <p>Cargando detalles...</p>}

        </div>
    )
}

export default EditGeneralViewCalibration