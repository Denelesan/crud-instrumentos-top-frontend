import { Form, Input, Button, DatePicker, Select, Table, Flex } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import 'dayjs/locale/es' // para español
import API_URL from "../config/api";
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

const JornadasHitoVerificacion = ({idHito, onLogUpdate}) => {
    //console.log(onLogUpdate)
    const [form] = Form.useForm();
    const {TextArea} = Input;
    const [dataSource, setDataSource] = useState()
    const [personal, setPersonal] = useState([])
    //const [initialData, setInitialData] = useState(null)
    //const [columns, setColumns] = useState()
    const columns = [{
        title: 'ID Jornada',
        dataIndex: 'id_jornada_verif'
    },
    {
        title: 'Responsable de Jornada',
        dataIndex: 'responsable'
    },
    {
        title: 'Lugar de Verificación',
        dataIndex: 'lugar_verif'
    },
    {
        title: 'Fecha de Jornada',
        dataIndex: 'fecha_verif',
        render: (valor) => {
            if (valor === null || valor === undefined) {
                return <span>No data</span>;
            }
            if (typeof valor === 'string') {
                const isoDateMatch = valor.match(/^\d{4}-\d{2}-\d{2}/);
                if (isoDateMatch) {
                    const date = dayjs(valor);
                    if (date.isValid()) {
                        return <span>{date.format("D [de] MMMM [del] YYYY")}</span>;
                    }
                }
            }
            return <span>{String(valor)}</span>;
        }
    }]
    
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


    // Cargar datos iniciales del registro
    useEffect(() => {
        if (idHito) {
            /*fetch(`${API_URL}/calibration/${idHito}`)
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
                .catch(error => console.error("Error al obtener los datos del hito:", error));*/
                
                //Cargar datos de las jornadas
                fetch(`${API_URL}/verificacion/jornadas/${idHito}`)
                    .then(res => res.json())
                    .then(data_jornadas=>{  
                        setDataSource(data_jornadas);
                    })
                    .catch(error => console.error("Error al cargar las jornadas del hito de verificacion", error))
                
        }

    }, [idHito, form]);

    const onFinish = async (values) =>{
        // Conversión de nombre de responsable a ID
        if (values.id_responsable && typeof values.id_responsable === 'string') {
            const responsableSeleccionado = personal.find(per => per.label === values.id_responsable);
            if (responsableSeleccionado) {
                values.id_responsable = responsableSeleccionado.value;
            }
        }
        try {
            const formattedValues = {
                id_verificacion: parseInt(idHito),
                ...values,
                fecha_verif: values.fecha_verif.format('YYYY-MM-DD')
            };
            
            const response = await fetch(`${API_URL}/verificacion/agregar_jornada`,{
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
                form.resetFields(['id_responsable', 'lugar_verif', 'fecha_verif']);
                
                // Actualizar la tabla con los nuevos datos
                const updatedData = await fetch(`${API_URL}/verificacion/jornadas/${idHito}`)
                    .then(res => res.json());
                setDataSource(updatedData);
                //Notificamos al componente padre que hubo una actualización exitosa. En esta notificación se ejecuta la función que gatilla el cambio del estado para ejecutar el useEffect de actualización de la vista general.
                if(onLogUpdate){
                    onLogUpdate()
                }
            } else {
                console.error('Error al agregar las jornadas:', await response.text());
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
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '15',
                    width: '100%'
                }}>
                    <Form.Item 
                        name="id_responsable" 
                        label="Responsable de Jornada"
                        rules={[{ required: true, message: 'Por favor seleccione un responsable de la Jornada' }]}
                    >
                        <Select
                            options={personal}
                            fieldNames={{
                                label: 'label',
                                value: 'value'
                            }}
                            optionFilterProp="label"
                        />
                    </Form.Item>
                    <Form.Item 
                        name="lugar_verif" 
                        label="Lugar de Verificación"
                        rules={[{ required: true, message: 'Por favor ingrese el lugar de la jornada' }]}
                    >
                        <TextArea autoSize={{ minRows: 1, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item 
                    //style={{ display: 'flex', justifyContent: 'center' }} 
                        name="fecha_verif" 
                        label="Fecha de Jornada"
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
                    <Button type="primary" htmlType="submit">Agregar Jornada de Verificación</Button>
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


export default JornadasHitoVerificacion;