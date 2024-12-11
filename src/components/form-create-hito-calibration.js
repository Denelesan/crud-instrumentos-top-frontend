import { Button, DatePicker, Form} from "antd"
import { useForm } from "antd/es/form/Form"
import { useState } from "react"




const FormCreateHitoCalibration = () =>{

    const [loading, setLoading] = useState(false)
    const [form] = useForm()

    return (
        <div>
            <h1>Crear nuevo hito de calibración</h1>
            <Form
                form={form}
                name="form-create-hito-calibration"
                layout="vertical"
                /*onFinish={Finish}*/
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
                    <DatePicker placeholder="Fecha de Solicitud" />

                </Form.Item>
                <Form.Item label="Número OFPA" name="num_ofpa---">

                </Form.Item>
                <Form.Item label="Orden de Compra" name="orden_compra">

                </Form.Item>
                <Form.Item label="Precio Orden de Compra" name="precio_oc">

                </Form.Item>
                <Form.Item label="Empresa" name="empresa">

                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading} style={{width: '100%'}}
                >Crear</Button>
            </Form>

        </div>

    )
}

export default FormCreateHitoCalibration