import { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import { Form, Select, Card, Divider, Alert, Space } from "antd";
import FormGeneralPanelLayout from "../layouts/FormGeneralPanelLayout";
import Modal from "antd/es/modal/Modal";
import { getIdFromValueOrLabel } from "../utils/tableUtils";
import "../styles/certificateForm.css";

const FormCreateCalibrationCertificated = forwardRef((props, ref) => {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const { id_instrumento } = props;
    
    const [hitoSelected, setHitoSelected] = useState();
    const [loading, setLoading] = useState(false);
    const [dataFiltered, setDataFiltered] = useState();
    const [dataSelected, setDataSelected] = useState();
    const [optionsCalibration, setOptionsCalibration] = useState();
    const [optionsEstadoCertificado, setoptionsEstadoCertificado] = useState();
    const [tipoInstrumento, setTipoInstrumento] = useState();

    // Mapeo de tipos de instrumentos a IDs
    const instrumentTypeMap = {
        1: "Estación Total",
        2: "Nivel",
        3: "Antena GNSS"
    };

    useEffect(() => {
        fetch(`http://localhost:5000/api/certificado_estado`)
            .then(response => response.json())
            .then(data => {
                const certificadoEstado = data.map(estado => ({
                    value: estado.id_estado_calibr,
                    label: estado.estado_calibr
                }));
                setoptionsEstadoCertificado(certificadoEstado);
            })
            .catch(error => console.log("Error en la solicitud", error));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:5000/api/instrumento/calibraciones/${id_instrumento}`)
            .then(res => res.json())
            .then(response => {
                const dataRowFiltered = response.filter(
                    item => item.fecha_ingreso == null
                );
                setDataFiltered(dataRowFiltered);
                return dataRowFiltered;
            })
            .then(result => {
                const options = result.map(option => ({
                    value: option.id_instru_calibr,
                    label: `Id Hito: ${option.id_solic_calibr}`,
                }));
                setOptionsCalibration(options);
            });
    }, []);

    useEffect(() => {
        if (dataFiltered) {
            const dataSelectedByHito = dataFiltered.find(e =>
                e.id_instru_calibr === hitoSelected
            );
            setDataSelected(dataSelectedByHito);
            setTipoInstrumento(dataSelectedByHito?.id_tipo);
        }
    }, [hitoSelected]);

    useImperativeHandle(ref, () => ({
        resetFormFields: () => {
            form1.resetFields();
            setHitoSelected();
        },
        resetCertificadoFields: () => {
            form2.resetFields();
        }
    }));

    const handleChange = (e) => {
        if (e) {
            setHitoSelected(e);
        }
    };

    // Genera campos dinámicos según tipo de instrumento
    const getFieldsByInstrumentType = () => {
        const baseFields = [
            {
                type: "input",
                name: "empresa",
                label: "Empresa",
                initialValue: dataSelected?.empresa || "",
                disabled: true,
            },
            {
                type: "input",
                name: "n_certificado",
                label: "Nº de Certificado",
                initialValue: null,
                rules: [{
                    required: true,
                    message: 'Por favor ingrese el número de certificado',
                }],
                placeholder: "Ej. CERT-2024-001"
            },
            {
                type: "select",
                name: "id_estado_certif",
                label: "Estado",
                initialValue: null,
                options: optionsEstadoCertificado,
                rules: [{
                    required: true,
                    message: 'Por favor seleccione el estado',
                }],
            },
            {
                type: "date",
                name: "fecha_certif",
                label: "Fecha de Calibración",
                initialValue: null,
                rules: [{
                    required: true,
                    message: 'Por favor seleccione la fecha',
                }],
            },
            {
                type: "input",
                name: "responsable",
                label: "Responsable",
                initialValue: null,
                placeholder: "Nombre del responsable",
                rules: [{
                    required: true,
                    message: 'Por favor ingrese el responsable',
                }],
            },
        ];

        // Campos específicos por tipo de instrumento
        const precisionFields = {
            1: [ // Estación Total
                {
                    type: "input",
                    name: "precision_angular_horizontal",
                    label: "Precisión Angular Horizontal (\")",
                    initialValue: null,
                    placeholder: "Ej. 2.5",
                    rules: [{
                        required: true,
                        message: 'Ingrese la precisión angular horizontal',
                    }],
                },
                {
                    type: "input",
                    name: "precision_angular_vertical",
                    label: "Precisión Angular Vertical (\")",
                    initialValue: null,
                    placeholder: "Ej. 2.5",
                    rules: [{
                        required: true,
                        message: 'Ingrese la precisión angular vertical',
                    }],
                },
                {
                    type: "input",
                    name: "precision_distancia",
                    label: "Precisión en Distancia (mm)",
                    initialValue: null,
                    placeholder: "Ej. 2 + 2ppm",
                    rules: [{
                        required: true,
                        message: 'Ingrese la precisión en distancia',
                    }],
                },
            ],
            2: [ // Nivel
                {
                    type: "input",
                    name: "precision_angular_vertical",
                    label: "Precisión Angular Vertical (\")",
                    initialValue: null,
                    placeholder: "Ej. 0.5",
                    rules: [{
                        required: true,
                        message: 'Ingrese la precisión angular vertical',
                    }],
                },
                {
                    type: "input",
                    name: "precision_distancia",
                    label: "Precisión en Distancia (mm/km)",
                    initialValue: null,
                    placeholder: "Ej. 1.5",
                    rules: [{
                        required: true,
                        message: 'Ingrese la precisión en distancia',
                    }],
                },
            ],
            3: [ // Antena GNSS
                {
                    type: "input",
                    name: "precision_horizontal",
                    label: "Precisión Horizontal (mm)",
                    initialValue: null,
                    placeholder: "Ej. 5 + 1ppm",
                    rules: [{
                        required: true,
                        message: 'Ingrese la precisión horizontal',
                    }],
                },
                {
                    type: "input",
                    name: "precision_vertical",
                    label: "Precisión Vertical (mm)",
                    initialValue: null,
                    placeholder: "Ej. 10 + 1ppm",
                    rules: [{
                        required: true,
                        message: 'Ingrese la precisión vertical',
                    }],
                },
            ],
        };

        const typeSpecificFields = precisionFields[tipoInstrumento] || [];
        return [...baseFields, ...typeSpecificFields];
    };

    const onFinishCertificado = async (values) => {
        setLoading(true);
        const { id_instrumento, ...newValues } = values;

        newValues.empresa = dataSelected.empresa;
        newValues.id_instru_calibr = dataSelected.id_instru_calibr;
        newValues.id_tipo_instru = dataSelected.id_tipo;

        try {
            const createCertificado = await fetch(`http://localhost:5000/api/calibration/agregar_certificado/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValues),
            });

            if (createCertificado.ok) {
                const updateSolicitud = await fetch(`http://localhost:5000/api/calibration/solicitud/${newValues.id_instru_calibr}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newValues),
                });

                if (updateSolicitud.ok) {
                    Modal.success({
                        title: 'Certificado Registrado',
                        content: 'Los datos del certificado se ingresaron correctamente',
                    });
                    form2.resetFields();
                    form1.resetFields();
                    setHitoSelected();
                }
            } else {
                Modal.error({
                    title: 'Error',
                    content: 'Error al ingresar el certificado de calibración',
                });
            }
        } catch (error) {
            console.log("Error en la solicitud", error);
            Modal.error({
                title: 'Error de Conexión',
                content: 'No se pudo conectar con el servidor',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="certificate-form-container">
            <Card className="certificate-form-card">
                <div className="certificate-header">
                    <h1>Nuevo Certificado de Calibración</h1>
                    <p>Registra los datos del certificado de calibración del instrumento</p>
                </div>

                <Form
                    form={form1}
                    name="form_select_hito"
                    layout="vertical"
                    onFinish={() => console.log("Cerrando")}
                    initialValues={{}}
                >
                    <Form.Item
                        label="Seleccionar Hito de Calibración"
                        name="id_hito_calibracion"
                        rules={[
                            {
                                required: true,
                                message: "Por favor seleccione un hito de calibración",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Selecciona un hito de calibración"
                            onChange={handleChange}
                            options={optionsCalibration}
                            size="large"
                        />
                    </Form.Item>
                </Form>

                {hitoSelected && dataSelected && (
                    <>
                        <Divider />

                        <Alert
                            message={`Tipo de Instrumento: ${instrumentTypeMap[tipoInstrumento]}`}
                            type="info"
                            showIcon
                            className="instrument-type-alert"
                        />

                        <Divider />

                        <div className="certificate-form-title">
                            <h2>Datos del Certificado de Calibración</h2>
                            <p className="form-subtitle">
                                Completa todos los campos según el tipo de instrumento
                            </p>
                        </div>

                        <FormGeneralPanelLayout
                            form={form2}
                            loading={loading}
                            style={{
                                display: 'grid',
                                justifyContent: 'center',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                width: '100%',
                                gap: '20px',
                                padding: '20px 0',
                                maxWidth: '1200px',
                                margin: '0 auto',
                            }}
                            fields={getFieldsByInstrumentType()}
                            onFinish={onFinishCertificado}
                        />
                    </>
                )}
            </Card>
        </div>
    );
});

export default FormCreateCalibrationCertificated;
