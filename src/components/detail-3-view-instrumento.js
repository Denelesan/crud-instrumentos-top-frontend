import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import {
    Modal,
    Card,
    Row,
    Col,
    Typography,
    Tag,
    Space,
    Divider,
    Statistic,
    Button,
    Table,
    Timeline,
    Empty,
    Tooltip,
    Badge,
    Descriptions,
    Collapse,
    Avatar,
    List,
    Spin,
    message
} from "antd";

import {
    ArrowLeftOutlined,
    EditOutlined,
    EnvironmentOutlined,
    PrinterOutlined,
    UserOutlined,
    ToolOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    SafetyCertificateOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DownloadOutlined,
    EyeOutlined,
    SettingOutlined,
    HistoryOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    DatabaseOutlined,
    UploadOutlined,
    FilePdfOutlined,
    AuditOutlined
} from "@ant-design/icons";

import dayjs from "dayjs";

import API_URL from "../config/api"

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;


/* ============================================================
   DATOS POR DEFECTO
   ============================================================ */

const defaultInstrument = {
    id_instrumento: 1,
    nombre_instrumento: "Estación Total Focus",
    tipo_instrumento: "Estación Total",
    numero_serie: "C933759",
    marca: "Spectra",
    modelo: 'Focus 8 2"',
    estado: "Operativo",
    materialidad: "Plástico",
    seccion: "Externo",

    responsable: "Yerko Leiva Rozas",
    rut_responsable: "12.345.678-9",

    ubicacion: "Bodega de Topografía",
    dependencia: "Sección de Georreferenciación",

    fecha_adquisicion: "2022-04-15",
    proveedor: "Proveedor Institucional",

    observaciones:
        "Instrumento utilizado para levantamientos topográficos y trabajos de control geométrico.",

    fecha_creacion: "2025-01-10T09:30:00",
    fecha_actualizacion: "2026-08-02T10:15:42",

    ultima_verificacion: "2026-08-31",
    ultima_calibracion: "2026-05-04",

    cant_verificaciones: 2,
    cant_calibraciones: 3
};


const defaultVerificaciones = [
    {
        id_verificacion: 2,
        fecha_verificacion: "2026-08-31",
        estado_verificacion: "Verificado",
        responsable: "Juan Pérez",
        trimestre: "2026-Q3",
        resultado_fisico: "Operativo",
        resultado_operativo: "Operativo",
        resultado_digital: "Actualizado",
        observaciones:
            "Instrumento verificado correctamente y disponible para operación."
    },
    {
        id_verificacion: 1,
        fecha_verificacion: "2026-05-10",
        estado_verificacion: "Verificado",
        responsable: "María González",
        trimestre: "2026-Q2",
        resultado_fisico: "Bueno",
        resultado_operativo: "Operativo",
        resultado_digital: "Pendiente",
        observaciones:
            "Se recomienda realizar actualización de información digital."
    }
];


const defaultCalibraciones = [
    {
        id_instru_calibr: 182,
        n_certificado: "CERT-2026-001",
        fecha_ingreso: "2026-04-05",
        fecha_entrega: "2026-05-30",
        fecha_certif: "2026-05-04",
        estado_certificado: "Vigente",
        responsable: "Laboratorio de Calibración",
        precio: 123000
    },
    {
        id_instru_calibr: 160,
        n_certificado: "CERT-2025-014",
        fecha_ingreso: "2025-05-02",
        fecha_entrega: "2025-06-10",
        fecha_certif: "2025-06-05",
        estado_certificado: "Vigente",
        responsable: "Laboratorio de Calibración",
        precio: 118000
    }
];


const defaultTareas = [
    {
        id: 1,
        titulo: "Revisión de batería",
        estado: "Pendiente",
        responsable: "Sección de Georreferenciación",
        fecha: "2026-09-15"
    },
    {
        id: 2,
        titulo: "Actualizar registro fotográfico",
        estado: "Completada",
        responsable: "Juan Pérez",
        fecha: "2026-08-20"
    }
];


const defaultArchivos = [
    {
        id: 1,
        nombre: "Certificado_Calibracion_2026.pdf",
        tipo: "Certificado",
        fecha: "2026-05-04"
    },
    {
        id: 2,
        nombre: "Informe_Verificacion_Q3.pdf",
        tipo: "Informe",
        fecha: "2026-08-31"
    }
];


/* ============================================================
   FUNCIONES AUXILIARES
   ============================================================ */

const formatDate = (date) => {
    if (!date) return "-";

    const d = dayjs(date);

    if (!d.isValid()) return "-";

    return d.format("DD/MM/YYYY");
};


const formatDateTime = (date) => {
    if (!date) return "-";

    const d = dayjs(date);

    if (!d.isValid()) return "-";

    return d.format("DD/MM/YYYY HH:mm");
};


const relativeDate = (date) => {

    if (!date) return "-";

    const target = dayjs(date);
    const now = dayjs();

    if (!target.isValid()) return "-";

    const minutes = now.diff(target, "minute");
    const hours = now.diff(target, "hour");
    const days = now.diff(target, "day");
    const months = now.diff(target, "month");
    const years = now.diff(target, "year");

    if (minutes < 1) return "hace unos segundos";
    if (minutes < 60) return `hace ${minutes} min`;
    if (hours < 24) return `hace ${hours} h`;
    if (days < 30) return `hace ${days} día${days !== 1 ? "s" : ""}`;
    if (months < 12) return `hace ${months} mes${months !== 1 ? "es" : ""}`;

    return `hace ${years} año${years !== 1 ? "s" : ""}`;
};


const getStatusColor = (status) => {

    switch (status) {

        case "Operativo":
        case "Verificado":
        case "Vigente":
        case "Completada":
        case "Actualizado":
        case "Sin problemas":   
        case "Apto para mediciones": 
            return "green";

        case "Pendiente":
        case "Revisión":
            return "orange";

        case "Robado":
        case "Cancelado":
        case "No operativo":
        case "Calibracion":
        case "No apto para mediciones":
            return "red";

        case "Mantenimiento":
        case "Mantencion":
            return "gold";

        default:
            return "blue";
    }
};


/* ============================================================
   COMPONENTE
   ============================================================ */


const FichaInstrumento = ({
    
    onBack,
    onEdit
}) => {
    const { id } = useParams()
    const [loading, setLoading] = useState(false);

    const [instrumento, setInstrumento] =
        useState(defaultInstrument);

    const [verificaciones, setVerificaciones] =
        useState(defaultVerificaciones);

    const [calibraciones, setCalibraciones] =
        useState(defaultCalibraciones);

    const [tareas, setTareas] =
        useState(defaultTareas);

    const [archivos, setArchivos] =
        useState(defaultArchivos);
    
    const navigate = useNavigate();

    const [archivoPreview, setArchivoPreview] = useState(null);
    
    const [openPreview, setOpenPreview] = useState(false);

    const handlePreview = (archivo) => {

    setArchivoPreview(archivo);
    setOpenPreview(true);

    };

 /* =====================================================
       IMPRESIÓN
       ===================================================== */

       const handlePrint = () => {

        window.print();

    };
    /* ========================================================
       API
       ======================================================== */

    useEffect(() => {

        const cargarDatos = async () => {

            setLoading(true);

            try {

                /*
                 * Cuando tengas las API definitivas puedes
                 * reemplazar estos endpoints.
                 */

                const response = await fetch(
                    `${API_URL}/instrumentos/${id}`
                );

                if (response.ok) {

                    const data = await response.json();

                    /*
                     * Se mantiene el dato por defecto si alguna
                     * propiedad todavía no viene desde la API.
                     */
                    //console.log("DATA", data)
                    setInstrumento({
                        ...defaultInstrument,
                        ...(Array.isArray(data)
                            ? data[0]
                            : data)
                    });

                }


                /*
                 * Verificaciones
                 */
                const responseVerificaciones =
                    await fetch(
                        `${API_URL}/instrumento/verificaciones/${id}`
                    );

                if (responseVerificaciones.ok) {
                    
                    

                    const dataRow =
                        await responseVerificaciones.json();

                    const dataFilter = await dataRow.filter(item=>
                            item.estado_verif === "Verificado" ///&& (item.resultado_fisico || item.resultado_digital || item.resultado_operativo)
                        )
                        console.log(dataFilter)
                    if (Array.isArray(dataFilter)) {
                        setVerificaciones(dataFilter);
                    }
                }


                /*
                 * Calibraciones
                 */

                const responseCalibraciones =
                    await fetch(
                        `${API_URL}/instrumento/calibraciones/${id}`
                    );

                if (responseCalibraciones.ok) {

                    const data =
                        await responseCalibraciones.json();

                    if (Array.isArray(data)) {
                        setCalibraciones(data);
                    }
                }


                /*
                 * Tareas
                 */

                const responseTareas =
                    await fetch(
                        `${API_URL}/instrumento/${id}/tareas`
                    );

                if (responseTareas.ok) {

                    const data =
                        await responseTareas.json();

                    if (Array.isArray(data)) {
                        setTareas(data);
                    }
                }


                /*
                 * Archivos
                 */
                
                const responseArchivos =
                    await fetch(
                        `${API_URL}/instrumentos/${id}/archivos`
                    );

                if (responseArchivos.ok) {

                    const data =
                        await responseArchivos.json();

                    if (Array.isArray(data)) {
                        setArchivos(data);
                    }
                }

            } catch (error) {

                console.error(
                    "Error al cargar ficha del instrumento:",
                    error
                );

                message.warning(
                    "No fue posible obtener toda la información. Se muestran datos disponibles."
                );

            } finally {

                setLoading(false);

            }

        };


        cargarDatos();

    }, [id]);


    /* ========================================================
       ESTILOS
       ======================================================== */

    const styles = {

        page: {
            minHeight: "100vh",
            background: "#f5f7fa",
            paddingBottom: 50
        },

        header: {
            background:
                "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
            color: "#fff",
            padding: "32px 42px",
            boxShadow: "0 4px 18px rgba(0,0,0,.08)"
        },

        content: {
            maxWidth: 1400,
            margin: "0 auto",
            padding: "30px 32px"
        },

        sectionCard: {
            borderRadius: 14,
            border: "1px solid #edf0f5",
            boxShadow: "0 3px 14px rgba(0,0,0,.035)",
            marginBottom: 24
        },

        sectionTitle: {
            marginBottom: 4,
            fontSize: 19
        },

        sectionSubtitle: {
            color: "#8c8c8c",
            fontSize: 13
        },

        label: {
            color: "#8c8c8c",
            fontSize: 12,
            marginBottom: 4
        },

        value: {
            color: "#1f2937",
            fontSize: 15,
            fontWeight: 500
        },

        statCard: {
            borderRadius: 12,
            border: "1px solid #edf0f5",
            height: "100%"
        }

    };


    /* ========================================================
       TABLA VERIFICACIONES
       ======================================================== */

    const verificationColumns = [

        {
            title: "Fecha",
            dataIndex: "fecha_fin_verif",
            render: value => (
                <Space>
                    <CalendarOutlined />
                    {value}
                </Space>
            )
        },

        {
            title: "Trimestre",
            dataIndex: "trim_anio",
            render: value => (
                <Tag color="blue">
                    {value || "-"}
                </Tag>
            )
        },

        {
            title: "Estado",
            dataIndex: "estado_verif",
            render: value => (
                <Tag color={getStatusColor(value)}>
                    {value || "-"}
                </Tag>
            )
        },

        {
            title: "Responsable",
            dataIndex: "responsable",
            render: value => (
                <Space>
                    <UserOutlined />
                    {value || "-"}
                </Space>
            )
        },

        {
            title: "Resultado físico",
            dataIndex: "resultado_fisico",
            render: value => (
                <Tag color={getStatusColor(value)}>
                    {value || "-"}
                </Tag>
            )
        },

        {
            title: "Resultado operativo",
            dataIndex: "resultado_operativo",
            render: value => (
                <Tag color={getStatusColor(value)}>
                    {value || "-"}
                </Tag>
            )
        },

        {
            title: "Resultado digital",
            dataIndex: "resultado_digital",
            render: value => (
                <Tag color={getStatusColor(value)}>
                    {value || "-"}
                </Tag>
            )
        }

    ];


    /* ========================================================
       TABLA CALIBRACIONES
       ======================================================== */

    const calibrationColumns = [

        {
            title: "Certificado",
            dataIndex: "n_certificado",
            render: value => (
                <Text strong>
                    {value || "-"}
                </Text>
            )
        },

        {
            title: "Ingreso",
            dataIndex: "fecha_ingreso",
            render: value => formatDate(value)
        },

        {
            title: "Certificación",
            dataIndex: "fecha_certif",
            render: value => formatDate(value)
        },

        {
            title: "Entrega",
            dataIndex: "fecha_entrega",
            render: value => formatDate(value)
        },

        {
            title: "Estado",
            dataIndex: "estado_calibr",
            render: value => (
                <Tag color={getStatusColor(value)}>
                    {value || "-"}
                </Tag>
            )
        },

        {
            title: "Empresa",
            dataIndex: "empresa",
            render: value=>(
                <Space>
                    <AuditOutlined />
                    {value || "-"}
                </Space>
                 
            )
        },

        {
            title: "Precio",
            dataIndex: "precio_calibr_instru",
            render: value =>
                value
                    ? `$${Number(value).toLocaleString("es-CL")}`
                    : "-"
        }

    ];


    /* ========================================================
       RENDER
       ======================================================== */

    return (

        <div style={styles.page}>

            {/* =================================================
                HEADER
            ================================================= */}

            <div style={styles.header}>

                <div
                    style={{
                        maxWidth: 1400,
                        margin: "0 auto"
                    }}
                >

                    <Space
                        direction="vertical"
                        size={4}
                        style={{ width: "100%" }}
                    >

                        <Space
                            align="center"
                            style={{
                                width: "100%",
                                justifyContent:
                                    "space-between"
                            }}
                        >

                            

                        </Space>


                        <Space
                            align="center"
                            size={16}
                        >
                            <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={()=>navigate("/")}
                        >
                            Volver
                        </Button>

                        <Divider
                            type="vertical"
                            style={{ height: 30 }}
                        />

                            <Avatar
                                size={64}
                                icon={<ToolOutlined />}
                                style={{
                                    background:
                                        "rgba(255,255,255,.18)"
                                }}
                            />

                            <div>

                                <Text
                                    style={{
                                        color:
                                            "rgba(255,255,255,.75)",
                                        fontSize: 13
                                    }}
                                >
                                    FICHA DE INSTRUMENTO
                                </Text>

                                <Title
                                    level={2}
                                    style={{
                                        color: "#fff",
                                        margin:
                                            "2px 0 4px"
                                    }}
                                >
                                    {instrumento.instrumento}
                                </Title>

                                <Space size={8}>

                                    <Tag
                                        color={
                                            getStatusColor(
                                                instrumento.estado
                                            )
                                        }
                                    >
                                        {instrumento.estado}
                                    </Tag>

                                    <Text
                                        style={{
                                            color:
                                                "rgba(255,255,255,.85)"
                                        }}
                                    >
                                        ID #
                                        {
                                            instrumento.id
                                        }
                                    </Text>

                                </Space>

                            </div>
                            <div>
                        <Space>

                            <Button
                                icon={<EditOutlined />}
                                type="primary"
                                onClick={() => onEdit?.(instrumento)}
                            >
                                Editar Instrumento
                            </Button>


                            <Button
                                icon={<PrinterOutlined />}
                                onClick={handlePrint}
                            >
                                Imprimir ficha
                            </Button>

                            </Space>
                        </div>

                        </Space>
                        
                                        
                    </Space>
                    

                </div>
                                        
            </div>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <div style={styles.content}>

                {loading && (

                    <div
                        style={{
                            textAlign: "center",
                            padding: 20
                        }}
                    >
                        <Spin />
                    </div>

                )}


                {/* =================================================
                    RESUMEN
                ================================================= */}

                <Row
                    gutter={[16, 16]}
                    style={{
                        marginBottom: 24
                    }}
                >

                    <Col xs={24} sm={12} md={6}>

                        <Card style={styles.statCard}>

                            <Statistic
                                title="Verificaciones"
                                value={
                                    //instrumento.cant_verificaciones
                                    //??
                                    verificaciones.length
                                }
                                prefix={
                                    <CheckCircleOutlined />
                                }
                            />

                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12
                                }}
                            >
                                Última{" "}
                                {relativeDate(
                                    instrumento.ultima_verificacion
                                )}
                            </Text>

                        </Card>

                    </Col>


                    <Col xs={24} sm={12} md={6}>

                        <Card style={styles.statCard}>

                            <Statistic
                                title="Calibraciones"
                                value={
                                   // instrumento.cant_calibraciones
                                   // ??
                                    calibraciones.length
                                }
                                prefix={
                                    <SafetyCertificateOutlined />
                                }
                            />

                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12
                                }}
                            >
                                Última{" "}
                                {relativeDate(
                                    instrumento.ultima_calibracion
                                )}
                            </Text>

                        </Card>

                    </Col>


                    <Col xs={24} sm={12} md={6}>

                        <Card style={styles.statCard}>

                            <Statistic
                                title="Última actualización"
                                value={
                                    relativeDate(
                                        instrumento.fecha_update
                                    )
                                }
                                prefix={
                                    <HistoryOutlined />
                                }
                            />

                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12
                                }}
                            >
                                {formatDateTime(
                                    instrumento.fecha_update
                                )}
                            </Text>

                        </Card>

                    </Col>


                    <Col xs={24} sm={12} md={6}>

                        <Card style={styles.statCard}>

                            <Statistic
                                title="Documentos"
                                value={
                                    archivos.length
                                }
                                prefix={
                                    <FileTextOutlined />
                                }
                            />

                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12
                                }}
                            >
                                Archivos asociados
                            </Text>

                        </Card>

                    </Col>

                </Row>


                {/* =================================================
                    INFORMACIÓN GENERAL
                ================================================= */}

                <Card
                    style={styles.sectionCard}
                    title={

                        <Space>

                            <InfoCircleOutlined />

                            <div>

                                <div
                                    style={
                                        styles.sectionTitle
                                    }
                                >
                                    Información General
                                </div>

                                <div
                                    style={
                                        styles.sectionSubtitle
                                    }
                                >
                                    Identificación y características
                                    principales del instrumento
                                </div>

                            </div>

                        </Space>

                    }
                >

                    <Descriptions
                        column={{
                            xs: 1,
                            sm: 2,
                            md: 3
                        }}
                        size="middle"
                    >

                        <Descriptions.Item label="ID Instrumento">
                            <Text strong>
                                #{instrumento.id}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Nombre">
                            {instrumento.instrumento}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tipo">
                            {instrumento.tipo}
                        </Descriptions.Item>

                        <Descriptions.Item label="Número de serie">
                            <Text code>
                                {instrumento.serie}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Marca">
                            {instrumento.marca}
                        </Descriptions.Item>

                        <Descriptions.Item label="Modelo">
                            {instrumento.modelo}
                        </Descriptions.Item>

                    </Descriptions>

                </Card>


                {/* =================================================
                    UBICACIÓN Y RESPONSABLE
                ================================================= */}

                <Row gutter={[24, 24]}>

                    <Col xs={24} lg={12}>

                        <Card
                            style={{
                                ...styles.sectionCard,
                                height: "100%"
                            }}
                            title={

                                <Space>

                                    <EnvironmentOutlined />

                                    <span>
                                        Ubicación
                                    </span>

                                </Space>

                            }
                        >

                            <Descriptions
                                column={1}
                                size="small"
                            >

                                <Descriptions.Item label="Ubicación">
                                    {instrumento.ubicacion}
                                </Descriptions.Item>

                                <Descriptions.Item label="Sección / Departamento">
                                    {instrumento.seccion}
                                </Descriptions.Item>

                                <Descriptions.Item label="Dependencia">
                                    {instrumento.seccion}
                                </Descriptions.Item>

                            </Descriptions>

                        </Card>

                    </Col>


                    <Col xs={24} lg={12}>

                        <Card
                            style={{
                                ...styles.sectionCard,
                                height: "100%"
                            }}
                            title={

                                <Space>

                                    <UserOutlined />

                                    <span>
                                        Responsable
                                    </span>

                                </Space>

                            }
                        >

                            <Space
                                align="start"
                                size={16}
                            >

                                <Avatar
                                    size={52}
                                    icon={
                                        <UserOutlined />
                                    }
                                />

                                <div>

                                    <Text strong>
                                        {
                                            instrumento.cargo
                                        }
                                    </Text>

                                    <br />

                                    <Text
                                        type="secondary"
                                    >
                                        RUT:{" "}
                                        {
                                            instrumento.rut_responsable
                                        }
                                    </Text>

                                    <br />

                                    <Text
                                        type="secondary"
                                    >
                                        {
                                            instrumento.seccion
                                        }
                                    </Text>

                                </div>

                            </Space>

                        </Card>

                    </Col>

                </Row>


                {/* =================================================
                    ESPECIFICACIONES
                ================================================= */}

                <Card
                    style={{
                        ...styles.sectionCard,
                        height: "100%",
                        marginTop:"24px"
                    }}
                    title={

                        <Space>

                            <SettingOutlined />

                            <span>
                                Especificaciones
                            </span>

                        </Space>

                    }
                >

                    <Row gutter={[32, 24]}>

                        <Col xs={24} sm={12} md={6}>

                            <Text style={styles.label}>
                                Marca
                            </Text>

                            <div style={styles.value}>
                                {instrumento.marca}
                            </div>

                        </Col>


                        <Col xs={24} sm={12} md={6}>

                            <Text style={styles.label}>
                                Modelo
                            </Text>

                            <div style={styles.value}>
                                {instrumento.modelo}
                            </div>

                        </Col>


                        <Col xs={24} sm={12} md={6}>

                            <Text style={styles.label}>
                                Materialidad
                            </Text>

                            <div style={styles.value}>
                                {instrumento.materialidad}
                            </div>

                        </Col>


                        <Col xs={24} sm={12} md={6}>

                            <Text style={styles.label}>
                                Fecha adquisición
                            </Text>

                            <div style={styles.value}>
                                {
                                    formatDate(
                                        instrumento.fecha_adquisicion
                                    )
                                }
                            </div>

                        </Col>

                    </Row>

                </Card>


                {/* =================================================
                    ESTADO Y OBSERVACIONES
                ================================================= */}

                <Card
                    style={styles.sectionCard}
                    title={

                        <Space>

                            <ExclamationCircleOutlined />

                            <span>
                                Estado y Observaciones
                            </span>

                        </Space>

                    }
                >

                    <Space
                        direction="vertical"
                        size={12}
                        style={{
                            width: "100%"
                        }}
                    >

                        <Space>

                            <Text strong>
                                Estado actual:
                            </Text>

                            <Tag
                                color={
                                    getStatusColor(
                                        instrumento.estado
                                    )
                                }
                            >
                                {instrumento.estado}
                            </Tag>

                        </Space>


                        <Paragraph
                            style={{
                                margin: 0,
                                color: "#595959"
                            }}
                        >
                            {
                                instrumento.obs_estado
                                ||
                                "Sin observaciones registradas."
                            }
                        </Paragraph>

                    </Space>

                </Card>


                {/* =================================================
                    VERIFICACIONES
                ================================================= */}

                <Card
                    style={styles.sectionCard}
                    title={

                        <Space>

                            <CheckCircleOutlined />

                            <div>

                                <div>
                                    Historial de Verificaciones
                                </div>

                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 12
                                    }}
                                >
                                    {
                                        verificaciones.length
                                    }{" "}
                                    registros
                                </Text>

                            </div>

                        </Space>

                    }
                >

                    {verificaciones.length > 0 ? (

                        <Table
                            rowKey="id_verificacion"
                            columns={
                                verificationColumns
                            }
                            dataSource={
                                verificaciones
                            }
                            pagination={false}
                            scroll={{
                                x: 900
                            }}
                        />

                    ) : (

                        <Empty
                            description={
                                "Sin verificaciones registradas"
                            }
                        />

                    )}

                </Card>


                {/* =================================================
                    CALIBRACIONES
                ================================================= */}

                <Card
                    style={styles.sectionCard}
                    title={

                        <Space>

                            <SafetyCertificateOutlined />

                            <div>

                                <div>
                                    Historial de Calibraciones
                                </div>

                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 12
                                    }}
                                >
                                    {
                                        calibraciones.length
                                    }{" "}
                                    registros
                                </Text>

                            </div>

                        </Space>

                    }
                >

                    {calibraciones.length > 0 ? (

                        <Table
                            rowKey="id_instru_calibr"
                            columns={
                                calibrationColumns
                            }
                            dataSource={
                                calibraciones
                            }
                            pagination={false}
                            scroll={{
                                x: 900
                            }}
                        />

                    ) : (

                        <Empty
                            description={
                                "Sin calibraciones registradas"
                            }
                        />

                    )}

                </Card>


                {/* =================================================
                    DOCUMENTOS
                ================================================= */}

                <Card
                    style={styles.sectionCard}
                    title={

                        <Space>

                            <FileTextOutlined />

                            <span>
                                Documentos asociados
                            </span>

                        </Space>

                    }
                    
                >

                    {archivos.length > 0 ? (

                        <List

                            itemLayout="horizontal"

                            dataSource={
                                archivos
                            }

                            renderItem={
                                archivo => (

                                    <List.Item

                                        actions={[

                                            <Tooltip
                                                title="Visualizar"
                                            >

                                                <Button
                                                    type="text"
                                                    icon={
                                                        <EyeOutlined />
                                                    }
                                                    onClick={() => handlePreview(archivo)}
                                                />

                                            </Tooltip>,

                                            <Tooltip
                                                title="Descargar"
                                            >

                                                <Button
                                                    type="text"
                                                    icon={
                                                        <DownloadOutlined />
                                                    }
                                                    onClick={()=> window.open(`${API_URL}/verificacion/archivo/${archivo.id_archivo}`)}
                                                />

                                            </Tooltip>

                                        ]}

                                    >

                                        <List.Item.Meta

                                            avatar={
                                                <Avatar
                                                    icon={
                                                        <FilePdfOutlined />
                                                    }
                                                />
                                            }

                                            title={
                                                archivo.nombre_original
                                            }

                                            description={

                                                <Space>

                                                    <Tag>
                                                        {
                                                            archivo.tipo
                                                        }
                                                    </Tag>

                                                    <Text
                                                        type="secondary"
                                                    >
                                                        {
                                                            formatDate(
                                                                archivo.fecha_subida
                                                            )
                                                        }
                                                    </Text>

                                                </Space>

                                            }

                                        />

                                    </List.Item>

                                )

                            }

                        />

                    ) : (

                        <Empty
                            description={
                                "Sin documentos asociados"
                            }
                        />

                    )}

                </Card>

                {/*MODAL PARA VISUALIZAR ARCHIVIOS
                */}
                <Modal
                    title={archivoPreview?.nombre_original}
                    open={openPreview}
                    onCancel={() => {
                        setOpenPreview(false);
                        setArchivoPreview(null);
                    }}
                    footer={null}
                    width={1000}
                    centered
                >
                    {archivoPreview?.tipo?.startsWith("image/") ? (

                        <img
                            src={`${API_URL}/verificacion/archivo/${archivoPreview.id_archivo}`}
                            alt={archivoPreview.nombre_original}
                            style={{
                                width: "100%",
                                maxHeight: "70vh",
                                objectFit: "contain"
                            }}
                        />

                    ) : archivoPreview?.tipo === "application/pdf" ? (

                        <iframe
                            src={`${API_URL}/verificacion/archivo/${archivoPreview.id_archivo}/visualizar`}
                            title={archivoPreview.nombre_original}
                            style={{
                                width: "100%",
                                height: "70vh",
                                border: "none"
                            }}
                        />

                    ) : (

                        <Empty
                            description="Este tipo de archivo no puede visualizarse directamente"
                        />

                    )}

                </Modal>


                {/* =================================================
                    TAREAS
                ================================================= */}

                <Card
                    style={styles.sectionCard}
                    title={

                        <Space>

                            <ClockCircleOutlined />

                            <span>
                                Tareas Asociadas
                            </span>

                        </Space>

                    }
                    extra={

                        <Badge
                            count={
                                tareas.filter(
                                    tarea =>
                                        tarea.estado ===
                                        "Pendiente"
                                ).length
                            }
                        >

                            <Button>
                                Ver tareas
                            </Button>

                        </Badge>

                    }
                >

                    {tareas.length > 0 ? (

                        <Timeline>

                            {tareas.map(tarea => (

                                <Timeline.Item

                                    key={tarea.id}

                                    color={
                                        tarea.estado ===
                                        "Completada"
                                            ? "green"
                                            : "blue"
                                    }

                                >

                                    <Space
                                        direction="vertical"
                                        size={2}
                                    >

                                        <Text strong>
                                            {
                                                tarea.titulo
                                            }
                                        </Text>

                                        <Space>

                                            <Tag
                                                color={
                                                    getStatusColor(
                                                        tarea.estado
                                                    )
                                                }
                                            >
                                                {
                                                    tarea.estado
                                                }
                                            </Tag>

                                            <Text
                                                type="secondary"
                                            >
                                                {
                                                    formatDate(
                                                        tarea.fecha
                                                    )
                                                }
                                            </Text>

                                        </Space>

                                        <Text
                                            type="secondary"
                                        >
                                            Responsable:{" "}
                                            {
                                                tarea.responsable
                                            }
                                        </Text>

                                    </Space>

                                </Timeline.Item>

                            ))}

                        </Timeline>

                    ) : (

                        <Empty
                            description={
                                "Sin tareas asociadas"
                            }
                        />

                    )}

                </Card>


                {/* =================================================
                    AUDITORÍA
                ================================================= */}

                <Card
                    style={styles.sectionCard}
                    title={

                        <Space>

                            <DatabaseOutlined />

                            <span>
                                Información del registro
                            </span>

                        </Space>

                    }
                >

                    <Row gutter={[32, 20]}>

                        <Col xs={24} md={12}>

                            <Space
                                align="start"
                            >

                                <HistoryOutlined />

                                <div>

                                    <Text
                                        type="secondary"
                                    >
                                        Última actualización
                                    </Text>

                                    <br />

                                    <Text strong>
                                        {
                                            formatDateTime(
                                                instrumento.fecha_update
                                            )
                                        }
                                    </Text>

                                    <br />

                                    <Text
                                        type="secondary"
                                    >
                                        {
                                            relativeDate(
                                                instrumento.fecha_update
                                            )
                                        }
                                    </Text>

                                </div>

                            </Space>

                        </Col>


                        <Col xs={24} md={12}>

                            <Space
                                align="start"
                            >

                                <CalendarOutlined />

                                <div>

                                    <Text
                                        type="secondary"
                                    >
                                        Registro creado
                                    </Text>

                                    <br />

                                    <Text strong>
                                        {
                                            formatDateTime(
                                                instrumento.fecha_creacion
                                            )
                                        }
                                    </Text>

                                </div>

                            </Space>

                        </Col>

                    </Row>

                </Card>


                {/* =================================================
                    PIE
                ================================================= */}

                <div
                    style={{
                        textAlign: "center",
                        marginTop: 35,
                        color: "#8c8c8c"
                    }}
                >

                    <Text
                        type="secondary"
                    >
                        Ficha de Instrumento Topográfico
                        {" · "}
                        ID #
                        {
                            instrumento.id
                        }
                    </Text>

                </div>

            </div>

        </div>
    );
};


export default FichaInstrumento;