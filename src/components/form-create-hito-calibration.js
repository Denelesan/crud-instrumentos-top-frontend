import { Button, DatePicker, Form, Input, Select, message} from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState,forwardRef,useImperativeHandle } from "react"




const FormCreateHitoCalibration = forwardRef((props, ref) =>{

    const {setHitoCalibrationSource} = props
    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [empresas, setEmpresas]= useState()

    useImperativeHandle(ref, () => ({
        resetFormFields: () => {
            form.resetFields();
        }
    }));

    useEffect(()=>{
        fetch('http://localhost:5000/api/calibration/empresas')
        .then(response => response.json())
        .then(data=>{
            const optionsEmpresas = data.map(empresa=>({
                value: empresa.id_empresa,
                label: empresa.empresa
            }))
            setEmpresas(optionsEmpresas)
        }).catch(error=> console.error("Error al obtener las empresas calibradoras", error))
    },[])

    const onFinish = async (values)=>{
        setLoading(true)
        
        try {
            const response = await fetch('http://localhost:5000/api/calibration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            
                if (response.ok){
                    const data = await response.json()
                    const updateData = await fetch('http://localhost:5000/api/calibration');
                    const json = await updateData.json()
                    setHitoCalibrationSource(json)
                    console.log("data",json)
                    message.success(`Nuevo Hito de Calibración creado con éxito: ${data.fecha_solicitud}`);
                    //resetear todos los campos del formulario
                    form.resetFields()
                    
                } else{
                    message.error("Error al crear el Hito de Calibración")
                }
            
        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally{
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Crear nuevo hito de calibración</h1>
            <Form
                form={form}
                name="form-create-hito-calibration"
                layout="vertical"
                onFinish={onFinish}
                >
                <Form.Item 
                    label="Fecha de Solicitud"
                    name="fecha_solicitud"
                    rules={[
                        {
                        required: true,
                        message: 'Porfavor ingrese la fecha de solicitud',
                        },
                    ]}>
                    <DatePicker style={{width:200}} placeholder="Fecha de Solicitud" />

                </Form.Item>
                <Form.Item label="Número OFPA" name="num_ofpa">
                    <Input style={{width:200}}/>
                </Form.Item>
                <Form.Item label="Orden de Compra" name="orden_compra">
                    <Input style={{width:200}}/>
                </Form.Item>
                <Form.Item label="Precio Orden de Compra" name="precio_oc">
                    <Input prefix="$" suffix="CLP" style={{width:200}}/>
                </Form.Item>
                <Form.Item label="Empresa" name="id_empresa">
                    <Select style={{width:200}}
                        options={empresas}/>
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading} style={{width: '100%'}}
                >Crear</Button>
            </Form>

        </div>

    )
})

export default FormCreateHitoCalibration