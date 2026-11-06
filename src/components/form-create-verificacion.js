import { Form, Input, Button, Select, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState, useImperativeHandle, forwardRef  } from "react"
import API_URL from "../config/api";

const FormCreateVerificacion = forwardRef((props, ref) =>{
    
    const {setHitoVerificacionSource} = props
    const [form] = useForm()
    const [loading, setLoading] = useState(false)
    const [personal, setPersonal] = useState([])
    const [estadoVerif, setEstadosVerif]= useState([])
 

    useImperativeHandle(ref, () => ({
        resetFormFields: () => {
            form.resetFields();
        }
    }));
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
   

     // Solicitar marcas de instrumentos
     useEffect(()=>{
        fetch(`${API_URL}/verificaciones/estados`)
        .then(response => response.json())
        .then(data=>{
            const optionsEstadosVerif = data.map(estado=>({
                value: estado.id_estado_verif,
                label: estado.estado_verif,
            }))
            setEstadosVerif(optionsEstadosVerif)
            
        }).
        catch(error=>console.error("Error al obtener dato de Estados de Verificación", error))
    }, [])

    const onFinish = async (values)=>{
        setLoading(true)
        
        try {
            const response = await fetch(`${API_URL}/verificaciones/agregar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            
                if (response.ok){
                    const data = await response.json()
                    const updateData = await fetch(`${API_URL}/verificacion`);
                    const json = await updateData.json()
                    setHitoVerificacionSource(json)
                    message.success(`Nuevo Hito de Verificación creado con éxito: ${data.id_verificacion}`);
                    //resetear todos los campos del formulario
                    form.resetFields()
                    
                } else{
                    message.error("Error al crear el hito de verificación")
                }
            
        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally{
            setLoading(false)
        }
    }
    return (
        <div>
            <h1>Crear Hito de Verificación</h1>
            <Form 
                form={form}
                name="form_item_path" 
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    id_tipo:'',
                }}>
                <Form.Item label="Responsable" name="id_responsable"
                rules={[
                    {
                    required: true,
                    message: 'Porfavor ingrese el responsable',
                    },
                ]}>
                    
                      <Select
                    
                        options={personal}
                        />
                      
                </Form.Item>
                <Form.Item 
                    label="Estado"
                    name="id_estado_verif" 
                    rules={[
                    {
                    required: true,
                    message: 'Porfavor ingrese el estado de la verificación',
                    },
                ]}>
                    <Select
                    
                    options={estadoVerif}
                    />
                </Form.Item>
                               
                <Form.Item style={{width:200}}
                            label="Año-Trimestre" 
                            name="trim_anio"
                            rules={[
                                {
                                    required: true,
                                    message: 'Porfavor ingrese el año-trimestre',
                                },
                            ]}>
                    <Input
                    placeholder= "Ej. 2026-Q2"/>
                                
                </Form.Item>
                
                <Button type="primary" htmlType="submit" loading={loading} style={{width: '100%',background:'#0b3d63'}}>
                    Crear Hito de Verificación
                </Button>
            </Form>
        </div>
        
    )
    
})

export default FormCreateVerificacion