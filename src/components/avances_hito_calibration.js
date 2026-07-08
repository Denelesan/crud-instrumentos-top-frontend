import { Form, Input, Button, DatePicker, Select, Table, Flex } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import 'dayjs/locale/es' // para español
import API_URL from "../config/api";
import {createDateRenderer} from '../utils/tableUtils';
dayjs.locale('es')

// Estilos globales para el DatePicker
const datePickerStyles = `
    .ant-picker-input > input {
        text-align: center !important;
    }
`;

/**
 * Componente para editar la información general de un hito de calibración
 * @param {string} idHito - ID del hito de calibración a editar
 */

const AvancesHitoCalibration = ({idHito, onLogUpdate}) => {
    //console.log(onLogUpdate)
    const [form] = Form.useForm();
    const {TextArea} = Input;
    const [dataSource, setDataSource] = useState()
    const [etapas, setEtapas] = useState()
    const [medios, setMedios] = useState()
    const [initialData, setInitialData] = useState(null)
    //const [columns, setColumns] = useState()
    const columns = [{
        title: 'Id',
        dataIndex: 'id_log_calibr'
    },
    {
        title: 'Etapa',
        dataIndex: 'etapa_calibr'
    },
    {
        title: 'Medio',
        dataIndex: 'medio'
    },
    {
        title: 'Fecha',
        dataIndex: 'fecha_log',
        render: createDateRenderer()
    },
    {
        title: 'Detalle',
        dataIndex: 'descrip_log'
    }]
    
    // Cargar lista de empresas calibradoras
    useEffect(()=>{
        fetch(`${API_URL}/calibration_etapas`)
        .then(response => response.json())
        .then(data=>{
            const optionsEtapas = data.map(empresa=>({
                value: empresa.id_etapa_calibr,
                label: empresa.etapa_calibr
            }))
            setEtapas(optionsEtapas)
            // Si quieres establecer la primera etapa como valor por defecto
            if (optionsEtapas.length > 0) {
                form.setFieldsValue({
                    id_etapa: optionsEtapas[0].value
                });
            }
        }).catch(error=> console.error("Error al obtener las etapas de un hito de calibración", error))
    },[])

     // Cargar lista de medio para log 
     useEffect(()=>{
        fetch(`${API_URL}/calibration_medio`)
        .then(response => response.json())
        .then(data=>{
            //<console.log("data", data)
            const optionsMedios = data.map(empresa=>({
                value: empresa.id_medio,
                label: empresa.medio
            }))
            console.log(optionsMedios)
            setMedios(optionsMedios)
        }).catch(error=> console.error("Error al obtener los medios de comunicación para un hito de calibración", error))
    },[])

    // Cargar datos iniciales del registro
    useEffect(() => {
        if (idHito) {
            fetch(`${API_URL}/calibration/${idHito}`)
                .then(response => response.json())
                .then(data => {
                    setInitialData(data);
                    // Esperamos a que las etapas y medios estén cargados
                    if (etapas && medios) {
                        form.setFieldsValue({
                            id_etapa: data.id_etapa_calibr,
                            id_medio: data.id_medio,
                            fecha: dayjs(data.fecha),
                            detalle: data.detalle
                        });
                    }
                })
                .catch(error => console.error("Error al obtener los datos del hito:", error));
                
                //Cargar datos de log
                fetch(`${API_URL}/calibration/log/${idHito}`)
                    .then(res => res.json())
                    .then(data_log=>{  
                        setDataSource(data_log);
                    })
                    .catch(error => console.error("Error al cargar el log del hito de calibración", error))
                
        }

    }, [idHito, form, etapas, medios]);

    const onFinish = async (values) =>{
        try {
            const formattedValues = {
                id_calibration: parseInt(idHito),
                ...values,
                fecha_log: values.fecha_log.format('YYYY-MM-DD')
            };
            
            const response = await fetch(`${API_URL}/calibration/agregar_log`,{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedValues),
            });

            if (response.ok) {
                // Resetear el formulario manteniendo solo la fecha actual
                form.setFieldsValue({
                    fecha_log: dayjs()
                });
                form.resetFields(['id_etapa', 'id_medio', 'detalle_log']);
                
                // Actualizar la tabla con los nuevos datos
                const updatedData = await fetch(`${API_URL}/calibration/log/${idHito}`)
                    .then(res => res.json());
                setDataSource(updatedData);
                //Notificamos al componente padre que hubo una actualización exitosa. En esta notificación se ejecuta la función que gatilla el cambio del estado para ejecutar el useEffect de actualización de la vista general.
                if(onLogUpdate){
                    onLogUpdate()
                }
            } else {
                console.error('Error al agregar el log:', await response.text());
            }
        } catch (error) {
            console.error('Error en la operación:', error);
        }
    }
    
    return (
        <div style={{width: "100%"}}>
            <style>{datePickerStyles}</style>
            <Form 
                form={form}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '90%',
                    margin: '0 auto',
                    gap: '15px'
                }}
                onFinish={onFinish}
            >
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '15',
                    width: '100%'
                }}>
                    <Form.Item 
                        name="id_etapa" 
                        label="Etapa"
                        rules={[{ required: true, message: 'Por favor seleccione una etapa' }]}
                    >
                        <Select
                            options={etapas}
                            fieldNames={{
                                label: 'label',
                                value: 'value'
                            }}
                            optionFilterProp="label"
                        />
                    </Form.Item>
                    <Form.Item 
                        name="id_medio" 
                        label="Medio"
                        rules={[{ required: true, message: 'Por favor seleccione un medio' }]}
                    >
                        <Select
                            options={medios}
                        />      
                    </Form.Item>
                    <Form.Item 
                        name="detalle_log" 
                        label="Detalle"
                        rules={[{ required: true, message: 'Por favor ingrese un detalle' }]}
                    >
                        <TextArea autoSize={{ minRows: 1, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item 
                    //style={{ display: 'flex', justifyContent: 'center' }} 
                        name="fecha_log" 
                        label="Fecha"
                        rules={[{ required: true, message: 'Por favor seleccione una fecha' }]}
                        initialValue={dayjs()}
                    >
                        <DatePicker 
                            style={{
                                width: '100%'
                            }}
                            inputStyle={{
                                textAlign: 'center'
                            }}
                            className="centered-datepicker"
                        />
                    </Form.Item> 
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    marginTop: '1px',
                    marginBottom:'15px'
                }}>
                    <Button type="primary" htmlType="submit">Agregar avance</Button>
                </div>
            </Form>
            <div style={{
                width: 'auto',
                display: 'flex',
                justifyContent:'center'
            }}>
                <Table size="large" columns={columns} dataSource={dataSource}>

                </Table>
            </div>
        </div>
    )
}


export default AvancesHitoCalibration;