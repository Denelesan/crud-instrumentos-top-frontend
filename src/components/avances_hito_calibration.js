import { Form, Input, Button, DatePicker, Select } from "antd";
import dayjs from "dayjs";

const AvancesHitoCalibration = () => {
    return (
        <div style={{width: "100%"}}>
            <Form style={{
                display: 'grid',  
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                
            }}>
                <Form.Item name="detalle" label="Detalle">
                    <Input />
                </Form.Item>
                <Form.Item name="fecha" label="Fecha">
                    <DatePicker 
                    defaultValue={dayjs()}
                    />
                </Form.Item>
                <Form.Item name="estado" label="Estado">
                    <Select>
                        <Select.Option value="pendiente">Pendiente</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Agregar avance</Button>
                </Form.Item>
            </Form>
        </div>
    )
}


export default AvancesHitoCalibration;