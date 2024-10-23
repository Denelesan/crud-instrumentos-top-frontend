import { Form, Input, Button, Select, message } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState, useImperativeHandle, forwardRef  } from "react"


const FormCreateInstrument = forwardRef((props, ref) =>{
   
    const [form] = useForm()
    const [loading, setLoading] = useState(false)
    const [tipos, setTipos]= useState([])
    const [marcas, setMarcas] = useState([])
    const [modelos, setModelos]= useState([])

    useImperativeHandle(ref, () => ({
        resetFormFields: () => {
            form.resetFields();
        }
    }));
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

    const onFinish = async (values)=>{
        setLoading(true)
        
        try {
            const response = await fetch('http://localhost:5000/api/instrumentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            
                if (response.ok){
                    const data = await response.json()
                    console.log(data)
                    message.success(`Nuevo instrumento creado con éxito: ${data.instrumento}`);
                    //resetear todos los campos del formulario
                    form.resetFields()
                    
                } else{
                    message.error("Error al crear el instrumento")
                }
            
        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally{
            setLoading(false)
        }
    }
    return (
        <div>
            <h1>Crear Nuevo Instrumento</h1>
            <Form 
                form={form}
                name="form_item_path" 
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    id_tipo:'',
                    id_materialidad:'',
                    id_seccion_cargo:'',
                    id_marca:'',
                    id_modelo:'',
                    id_estado_instru:'',
                    rut_cargo:'',
                    instrumento:'',
                    aplica_verif:'',
                    aplica_calib:'',
                    cod_serviu:'', 
                    serial_equipo:'', 
                    ubicacion:'', 
                    obs_estado:'',
                }}>
                <Form.Item label="Tipo de Instrumento" name="id_tipo"
                rules={[
                    {
                    required: true,
                    message: 'Porfavor ingrese el tipo de instrumento',
                    },
                ]}>
                    
                      <Select
                    
                        options={tipos}
                        />
                      
                </Form.Item>
                <Form.Item 
                    label="Nombre de Instrumento"
                    name="instrumento" 
                    rules={[
                    {
                    required: true,
                    message: 'Porfavor ingrese el nombre del instrumento',
                    },
                ]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="Marca" name="id_marca"
                rules={[
                    {
                    required: true,
                    message: 'Porfavor ingrese la marca del instrumento',
                    },
                ]}>
                <Select style={{width:200}}
                    options={marcas}/>
                </Form.Item>
                <Form.Item label="Modelo" name="id_modelo"
                rules={[
                    {
                    required: true,
                    message: 'Porfavor ingrese el modelo instrumento',
                    },
                ]}>
                <Select style={{width:200}}
                    options={modelos}
                      />
                </Form.Item>
                
                <Form.Item style={{width:200}}
                            label="Nº de serie" 
                            name="serial_equipo">
                    <Input/>
                </Form.Item>
                
                <Button type="primary" htmlType="submit">
                    Crear Instrumento
                </Button>
            </Form>
        </div>
        
    )
    
})

export default FormCreateInstrument