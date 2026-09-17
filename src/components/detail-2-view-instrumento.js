import React, { useEffect, useMemo, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Col,
    Collapse,
    Descriptions,
    Divider,
    Row,
    Space,
    Statistic,
    Tag,
    Timeline,
    Typography,
    Empty
} from "antd";

import {
    ArrowLeftOutlined,
    EditOutlined,
    PrinterOutlined,
    EnvironmentOutlined,
    UserOutlined,
    ToolOutlined,
    SafetyCertificateOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    HistoryOutlined,
    PushpinOutlined,
    SettingOutlined,
    AuditOutlined,
    ProfileOutlined,
    CheckOutlined
} from "@ant-design/icons";

import API_URL from "../config/api";

const { Title, Text } = Typography;
const { Panel } = Collapse;


/* =========================================================
   DATOS POR DEFECTO
   ========================================================= */

const defaultInstrumento = {
    id_instrumento: 5,
    nombre_instrumento: "Estación Total Focus 8",
    tipo_instrumento: "Estación Total",
    marca: "Spectra",
    modelo: 'Focus 8"',
    numero_serie: "FOC8-2024-001",
    estado: "Operativo",
    materialidad: "Plástico",
    seccion: "Externo",
    ubicacion: "Bodega Central",
    responsable: "Juan Pérez",
    cargo_responsable: "Ingeniero Geomensor",
    empresa: "SERVIU Metropolitano",
    observaciones:
        "Instrumento operativo y disponible para trabajos topográficos.",
    fecha_adquisicion: "15/03/2024",
    fecha_actualizacion: "02/08/2026 10:15",
    ultima_verificacion: "31/08/2026",
    cant_verificaciones: 2,
    ultima_calibracion: "04/05/2026",
    cant_calibraciones: 3
};

const defaultVerificaciones = [
    {
        id_verificacion: 1,
        fecha: "31/08/2026",
        responsable: "Juan Pérez",
        estado_fisico: "Excelente",
        estado_operativo: "Operativo",
        estado_digital: "Actualizado",
        observaciones: "Instrumento en perfecto estado."
    },
    {
        id_verificacion: 2,
        fecha: "19/08/2025",
        responsable: "María González",
        estado_fisico: "Bueno",
        estado_operativo: "Operativo",
        estado_digital: "Pendiente",
        observaciones: "Requiere actualización de firmware."
    }
];

const defaultCalibraciones = [
    {
        id_instru_calibr: 182,
        fecha_ingreso: "05/04/2026",
        fecha_entrega: "30/05/2026",
        n_certificado: "XX-DD-1",
        tipo: "Calibración Estación Total",
        estado: "Vigente",
        responsable: "Juan Pérez"
    },
    {
        id_instru_calibr: 145,
        fecha_ingreso: "10/02/2025",
        fecha_entrega: "25/03/2025",
        n_certificado: "CERT-2025-014",
        tipo: "Calibración Estación Total",
        estado: "Vigente",
        responsable: "María González"
    }
];

const defaultDocumentos = [
    {
        id: 1,
        nombre: "Certificado de calibración XX-DD-1.pdf",
        tipo: "Certificado",
        fecha: "30/05/2026"
    },
    {
        id: 2,
        nombre: "Informe de verificación 2026-Q3.pdf",
        tipo: "Informe",
        fecha: "31/08/2026"
    }
];

const defaultTareas = [
    {
        id: 1,
        titulo: "Realizar verificación periódica",
        estado: "Pendiente",
        prioridad: "Alta",
        fecha_vencimiento: "15/09/2026",
        responsable: "Juan Pérez"
    },
    {
        id: 2,
        titulo: "Revisar documentación de calibración",
        estado: "En proceso",
        prioridad: "Media",
        fecha_vencimiento: "30/09/2026",
        responsable: "María González"
    },
    {
        id: 3,
        titulo: "Actualizar registro del instrumento",
        estado: "Completada",
        prioridad: "Baja",
        fecha_vencimiento: "02/08/2026",
        responsable: "Juan Pérez"
    }
];

const defaultAuditoria = [
    {
        fecha: "02/08/2026 10:15",
        usuario: "Juan Pérez",
        accion: "Actualización de información general"
    },
    {
        fecha: "31/08/2026 09:20",
        usuario: "María González",
        accion: "Registro de nueva verificación"
    },
    {
        fecha: "30/05/2026 16:45",
        usuario: "Juan Pérez",
        accion: "Registro de certificado de calibración"
    }
];


/* =========================================================
   FUNCIONES AUXILIARES
   ========================================================= */

const getStatusColor = (valor) => {
    if (!valor) return "default";

    const value = valor.toLowerCase();

    if (
        value.includes("operativo") ||
        value.includes("excelente") ||
        value.includes("vigente") ||
        value.includes("actualizado") ||
        value.includes("complet")
    ) {
        return "green";
    }

    if (
        value.includes("pendiente") ||
        value.includes("mantenimiento") ||
        value.includes("bueno") ||
        value.includes("proceso")
    ) {
        return "orange";
    }

    if (
        value.includes("robado") ||
        value.includes("cancelado") ||
        value.includes("vencido")
    ) {
        return "red";
    }

    return "blue";
};

const getPriorityColor = (prioridad) => {
    switch (prioridad) {
        case "Alta":
            return "red";
        case "Media":
            return "orange";
        case "Baja":
            return "blue";
        default:
            return "default";
    }
};


/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

const FichaInstrumento = ({
    id = 5,
    onBack,
    onEdit
}) => {

    const [instrumento, setInstrumento] = useState(defaultInstrumento);
    const [verificaciones, setVerificaciones] = useState(defaultVerificaciones);
    const [calibraciones, setCalibraciones] = useState(defaultCalibraciones);
    const [documentos, setDocumentos] = useState(defaultDocumentos);
    const [tareas, setTareas] = useState(defaultTareas);
    const [auditoria, setAuditoria] = useState(defaultAuditoria);

    const [loading, setLoading] = useState(false);


    /* =====================================================
       CONSULTAS API
       ===================================================== */

    useEffect(() => {

        const cargarDatos = async () => {

            setLoading(true);

            try {

                const [
                    instrumentoResponse,
                    verificacionesResponse,
                    calibracionesResponse,
                    documentosResponse,
                    tareasResponse
                ] = await Promise.all([

                    fetch(`${API_URL}/instrumento/${id}`),

                    fetch(`${API_URL}/instrumento/${id}/verificaciones`),

                    fetch(`${API_URL}/instrumento/${id}/calibraciones`),

                    fetch(`${API_URL}/instrumento/${id}/archivos`),

                    fetch(`${API_URL}/instrumento/${id}/tareas`)
                ]);


                if (instrumentoResponse.ok) {
                    const data = await instrumentoResponse.json();

                    if (data) {
                        setInstrumento(
                            Array.isArray(data)
                                ? data[0]
                                : data
                        );
                    }
                }


                if (verificacionesResponse.ok) {
                    const data = await verificacionesResponse.json();

                    if (Array.isArray(data) && data.length > 0) {
                        setVerificaciones(data);
                    }
                }


                if (calibracionesResponse.ok) {
                    const data = await calibracionesResponse.json();

                    if (Array.isArray(data) && data.length > 0) {
                        setCalibraciones(data);
                    }
                }


                if (documentosResponse.ok) {
                    const data = await documentosResponse.json();

                    if (Array.isArray(data) && data.length > 0) {
                        setDocumentos(data);
                    }
                }


                if (tareasResponse.ok) {
                    const data = await tareasResponse.json();

                    if (Array.isArray(data) && data.length > 0) {
                        setTareas(data);
                    }
                }

            } catch (error) {

                console.error(
                    "Error al obtener información del instrumento:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };


        cargarDatos();

    }, [id]);


    /* =====================================================
       TAREAS
       ===================================================== */

    const tareasPendientes = useMemo(() => {

        return tareas.filter(
            tarea =>
                tarea.estado !== "Completada" &&
                tarea.estado !== "Finalizada"
        );

    }, [tareas]);


    /* =====================================================
       IMPRESIÓN
       ===================================================== */

    const handlePrint = () => {

        window.print();

    };


    /* =====================================================
       ESTILOS
       ===================================================== */

    const sectionCardStyle = {
        borderRadius: 16,
        border: "1px solid #edf0f5",
        boxShadow: "0 4px 18px rgba(0,0,0,.04)",
        marginBottom: 22
    };


    const sectionTitleStyle = {
        margin: 0,
        fontSize: 18,
        fontWeight: 600
    };


    /* =====================================================
       RENDER
       ===================================================== */

    return (

        <div
            style={{
                background: "#f5f7fa",
                minHeight: "100vh",
                paddingBottom: 50
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    background: "#fff",
                    borderBottom: "1px solid #e8ebf0",
                    padding: "18px 40px",
                    position: "sticky",
                    top: 0,
                    zIndex: 10
                }}
            >

                <div
                    style={{
                        maxWidth: 1400,
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 20
                    }}
                >

                    <Space size={14}>

                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={onBack}
                        >
                            Volver
                        </Button>

                        <Divider
                            type="vertical"
                            style={{ height: 30 }}
                        />

                        <div>

                            <Text
                                type="secondary"
                                style={{ fontSize: 12 }}
                            >
                                FICHA DE INSTRUMENTO
                            </Text>

                            <Title
                                level={3}
                                style={{
                                    margin: 0,
                                    marginTop: 2
                                }}
                            >
                                {instrumento.nombre_instrumento}
                            </Title>

                        </div>

                    </Space>


                    <Space>

                        {/* TAREAS */}

                        <Badge
                            count={tareasPendientes.length}
                            offset={[-4, 4]}
                        >

                            <Button
                                icon={<CheckCircleOutlined />}
                                onClick={() => {
                                    document
                                        .getElementById("seccion-tareas")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                }}
                            >
                                Tareas
                            </Button>

                        </Badge>


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

            </div>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <div
                style={{
                    maxWidth: 1400,
                    margin: "30px auto",
                    padding: "0 30px"
                }}
            >


                {/* =================================================
                    RESUMEN
                ================================================= */}

                <Card
                    bordered={false}
                    style={{
                        borderRadius: 18,
                        marginBottom: 25,
                        boxShadow: "0 5px 25px rgba(0,0,0,.05)"
                    }}
                >

                    <Row gutter={[24, 24]} align="middle">

                        <Col
                            xs={24}
                            md={8}
                        >

                            <Space>

                                <div
                                    style={{
                                        width: 58,
                                        height: 58,
                                        borderRadius: 14,
                                        background: "#eaf3ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 26,
                                        color: "#1677ff"
                                    }}
                                >
                                    <ToolOutlined />
                                </div>

                                <div>

                                    <Text type="secondary">
                                        ID Instrumento
                                    </Text>

                                    <Title
                                        level={3}
                                        style={{ margin: 0 }}
                                    >
                                        #{instrumento.id_instrumento}
                                    </Title>

                                </div>

                            </Space>

                        </Col>


                        <Col xs={12} md={4}>

                            <Statistic
                                title="Verificaciones"
                                value={
                                    instrumento.cant_verificaciones ??
                                    verificaciones.length
                                }
                                prefix={<CheckCircleOutlined />}
                            />

                        </Col>


                        <Col xs={12} md={4}>

                            <Statistic
                                title="Calibraciones"
                                value={
                                    instrumento.cant_calibraciones ??
                                    calibraciones.length
                                }
                                prefix={
                                    <SafetyCertificateOutlined />
                                }
                            />

                        </Col>


                        <Col xs={24} md={8}>

                            <div>

                                <Text type="secondary">
                                    Estado actual
                                </Text>

                                <div style={{ marginTop: 6 }}>

                                    <Tag
                                        color={getStatusColor(
                                            instrumento.estado
                                        )}
                                        style={{
                                            borderRadius: 20,
                                            padding: "4px 14px",
                                            fontSize: 14
                                        }}
                                    >
                                        {instrumento.estado}
                                    </Tag>

                                </div>

                            </div>

                        </Col>

                    </Row>

                </Card>


                {/* =================================================
                    INFORMACIÓN GENERAL
                ================================================= */}

                <Card
                    bordered={false}
                    style={sectionCardStyle}
                    title={
                        <Space>

                            <ProfileOutlined />

                            <span style={sectionTitleStyle}>
                                Información General
                            </span>

                        </Space>
                    }
                >

                    <Descriptions
                        column={{
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 2
                        }}
                        bordered
                        size="small"
                    >

                        <Descriptions.Item label="ID Instrumento">
                            {instrumento.id_instrumento}
                        </Descriptions.Item>

                        <Descriptions.Item label="Nombre">
                            {instrumento.nombre_instrumento}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tipo">
                            {instrumento.tipo_instrumento}
                        </Descriptions.Item>

                        <Descriptions.Item label="Estado">
                            <Tag
                                color={getStatusColor(
                                    instrumento.estado
                                )}
                            >
                                {instrumento.estado}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Empresa">
                            {instrumento.empresa}
                        </Descriptions.Item>

                        <Descriptions.Item label="Fecha adquisición">
                            {instrumento.fecha_adquisicion}
                        </Descriptions.Item>

                    </Descriptions>

                </Card>


                {/* =================================================
                    ESPECIFICACIONES
                ================================================= */}

                <Card
                    bordered={false}
                    style={sectionCardStyle}
                    title={
                        <Space>

                            <SettingOutlined />

                            <span style={sectionTitleStyle}>
                                Especificaciones
                            </span>

                        </Space>
                    }
                >

                    <Descriptions
                        column={{
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 2
                        }}
                        bordered
                        size="small"
                    >

                        <Descriptions.Item label="Marca">
                            {instrumento.marca}
                        </Descriptions.Item>

                        <Descriptions.Item label="Modelo">
                            {instrumento.modelo}
                        </Descriptions.Item>

                        <Descriptions.Item label="Número de serie">
                            {instrumento.numero_serie}
                        </Descriptions.Item>

                        <Descriptions.Item label="Materialidad">
                            {instrumento.materialidad}
                        </Descriptions.Item>

                        <Descriptions.Item label="Sección">
                            {instrumento.seccion}
                        </Descriptions.Item>

                    </Descriptions>

                </Card>


                {/* =================================================
                    UBICACIÓN Y RESPONSABLE
                ================================================= */}

                <Card
                    bordered={false}
                    style={sectionCardStyle}
                    title={
                        <Space>

                            <EnvironmentOutlined />

                            <span style={sectionTitleStyle}>
                                Ubicación y Responsable
                            </span>

                        </Space>
                    }
                >

                    <Descriptions
                        column={{
                            xs: 1,
                            sm: 2,
                            md: 2
                        }}
                        bordered
                        size="small"
                    >

                        <Descriptions.Item label="Ubicación">
                            <Space>

                                <EnvironmentOutlined />

                                {instrumento.ubicacion}

                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="Responsable">
                            <Space>

                                <UserOutlined />

                                {instrumento.responsable}

                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="Cargo Responsable">
                            {instrumento.cargo_responsable}
                        </Descriptions.Item>

                    </Descriptions>

                </Card>


                {/* =================================================
                    ESTADO Y OBSERVACIONES
                ================================================= */}

                <Card
                    bordered={false}
                    style={sectionCardStyle}
                    title={
                        <Space>

                            <AuditOutlined />

                            <span style={sectionTitleStyle}>
                                Estado y Observaciones
                            </span>

                        </Space>
                    }
                >

                    <div
                        style={{
                            background: "#fafafa",
                            padding: 18,
                            borderRadius: 12
                        }}
                    >

                        <Text
                            type="secondary"
                            style={{ display: "block" }}
                        >
                            Observaciones
                        </Text>

                        <Text>
                            {instrumento.observaciones ||
                                "Sin observaciones registradas."}
                        </Text>

                    </div>

                </Card>


                {/* =================================================
                    VERIFICACIONES
                ================================================= */}

                <Card
                    bordered={false}
                    style={sectionCardStyle}
                    title={
                        <Space>

                            <CheckCircleOutlined />

                            <span style={sectionTitleStyle}>
                                Verificaciones
                            </span>

                            <Badge
                                count={verificaciones.length}
                                color="#1677ff"
                            />

                        </Space>
                    }
                >

                    <Collapse
                        bordered={false}
                        ghost
                    >

                        {verificaciones.map(
                            (verificacion) => (

                                <Panel
                                    key={
                                        verificacion.id_verificacion
                                    }
                                    header={
                                        <Space>

                                            <Text strong>
                                                Verificación Nº{" "}
                                                {
                                                    verificacion.id_verificacion
                                                }
                                            </Text>

                                            <Text type="secondary">
                                                {
                                                    verificacion.fecha
                                                }
                                            </Text>

                                        </Space>
                                    }
                                >

                                    <Row
                                        gutter={[
                                            20,
                                            20
                                        ]}
                                    >

                                        <Col xs={24} md={8}>

                                            <Text type="secondary">
                                                Estado Físico
                                            </Text>

                                            <div>
                                                <Tag
                                                    color={getStatusColor(
                                                        verificacion.estado_fisico
                                                    )}
                                                >
                                                    {
                                                        verificacion.estado_fisico
                                                    }
                                                </Tag>
                                            </div>

                                        </Col>


                                        <Col xs={24} md={8}>

                                            <Text type="secondary">
                                                Estado Operativo
                                            </Text>

                                            <div>
                                                <Tag
                                                    color={getStatusColor(
                                                        verificacion.estado_operativo
                                                    )}
                                                >
                                                    {
                                                        verificacion.estado_operativo
                                                    }
                                                </Tag>
                                            </div>

                                        </Col>


                                        <Col xs={24} md={8}>

                                            <Text type="secondary">
                                                Estado Digital
                                            </Text>

                                            <div>
                                                <Tag
                                                    color={getStatusColor(
                                                        verificacion.estado_digital
                                                    )}
                                                >
                                                    {
                                                        verificacion.estado_digital
                                                    }
                                                </Tag>
                                            </div>

                                        </Col>

                                    </Row>


                                    <Divider />

                                    <Descriptions
                                        column={2}
                                        size="small"
                                    >

                                        <Descriptions.Item label="Responsable">
                                            {
                                                verificacion.responsable
                                            }
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Fecha">
                                            {
                                                verificacion.fecha
                                            }
                                        </Descriptions.Item>

                                        <Descriptions.Item
                                            label="Observaciones"
                                            span={2}
                                        >
                                            {
                                                verificacion.observaciones ||
                                                "-"
                                            }
                                        </Descriptions.Item>

                                    </Descriptions>

                                </Panel>

                            )
                        )}

                    </Collapse>

                </Card>


                {/* =================================================
                    CALIBRACIONES
                ================================================= */}

                <Card
                    bordered={false}
                    style={sectionCardStyle}
                    title={
                        <Space>

                            <SafetyCertificateOutlined />

                            <span style={sectionTitleStyle}>
                                Calibraciones
                            </span>

                            <Badge
                                count={calibraciones.length}
                                color="#1677ff"
                            />

                        </Space>
                    }
                >

                    <Collapse
                        bordered={false}
                        ghost
                    >

                        {calibraciones.map(
                            (calibracion) => (

                                <Panel
                                    key={
                                        calibracion.id_instru_calibr
                                    }
                                    header={
                                        <Space>

                                            <Text strong>
                                                Certificado{" "}
                                                {
                                                    calibracion.n_certificado
                                                }
                                            </Text>

                                            <Tag
                                                color={getStatusColor(
                                                    calibracion.estado
                                                )}
                                            >
                                                {
                                                    calibracion.estado
                                                }
                                            </Tag>

                                        </Space>
                                    }
                                >

                                    <Descriptions
                                        bordered
                                        size="small"
                                        column={{
                                            xs: 1,
                                            sm: 2,
                                            md: 2
                                        }}
                                    >

                                        <Descriptions.Item label="Tipo">
                                            {
                                                calibracion.tipo
                                            }
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Certificado">
                                            {
                                                calibracion.n_certificado
                                            }
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Fecha ingreso">
                                            {
                                                calibracion.fecha_ingreso
                                            }
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Fecha entrega">
                                            {
                                                calibracion.fecha_entrega
                                            }
                                        </Descriptions.Item>

                                        <Descriptions.Item label="Responsable">
                                            {
                                                calibracion.responsable
                                            }
                                        </Descriptions.Item>

                                    </Descriptions>

                                </Panel>

                            )
                        )}

                    </Collapse>

                </Card>


                {/* =================================================
                    DOCUMENTOS
                ================================================= */}

                <Card
                    bordered={false}
                    style={sectionCardStyle}
                    title={
                        <Space>

                            <FileTextOutlined />

                            <span style={sectionTitleStyle}>
                                Documentos Asociados
                            </span>

                            <Badge
                                count={documentos.length}
                                color="#1677ff"
                            />

                        </Space>
                    }
                >

                    <Row gutter={[16, 16]}>

                        {documentos.length > 0 ? (

                            documentos.map(documento => (

                                <Col
                                    xs={24}
                                    md={12}
                                    lg={8}
                                    key={documento.id}
                                >

                                    <Card
                                        size="small"
                                        bordered
                                        style={{
                                            borderRadius: 12
                                        }}
                                    >

                                        <Space>

                                            <FileTextOutlined
                                                style={{
                                                    fontSize: 24,
                                                    color: "#1677ff"
                                                }}
                                            />

                                            <div>

                                                <Text strong>
                                                    {
                                                        documento.nombre
                                                    }
                                                </Text>

                                                <br />

                                                <Text type="secondary">
                                                    {
                                                        documento.tipo
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        documento.fecha
                                                    }
                                                </Text>

                                            </div>

                                        </Space>

                                    </Card>

                                </Col>

                            ))

                        ) : (

                            <Col span={24}>

                                <Empty
                                    description="No existen documentos asociados"
                                />

                            </Col>

                        )}

                    </Row>

                </Card>


                {/* =================================================
                    TAREAS
                ================================================= */}

                <div id="seccion-tareas">

                    <Card
                        bordered={false}
                        style={{
                            ...sectionCardStyle,
                            border:
                                tareasPendientes.length > 0
                                    ? "1px solid #ffe58f"
                                    : "1px solid #edf0f5"
                        }}
                        title={

                            <Space>

                                <CheckCircleOutlined
                                    style={{
                                        color:
                                            tareasPendientes.length > 0
                                                ? "#faad14"
                                                : "#52c41a"
                                    }}
                                />

                                <span style={sectionTitleStyle}>
                                    Tareas
                                </span>

                                <Badge
                                    count={
                                        tareasPendientes.length
                                    }
                                    color={
                                        tareasPendientes.length > 0
                                            ? "#faad14"
                                            : "#52c41a"
                                    }
                                    showZero
                                />

                                <Text type="secondary">
                                    {tareasPendientes.length > 0
                                        ? "Tareas pendientes"
                                        : "Sin tareas pendientes"}
                                </Text>

                            </Space>

                        }
                    >

                        {tareas.length > 0 ? (

                            <Timeline>

                                {tareas.map(tarea => {

                                    const completada =
                                        tarea.estado ===
                                            "Completada" ||
                                        tarea.estado ===
                                            "Finalizada";

                                    return (

                                        <Timeline.Item
                                            key={tarea.id}
                                            color={
                                                completada
                                                    ? "green"
                                                    : tarea.prioridad ===
                                                      "Alta"
                                                    ? "red"
                                                    : "blue"
                                            }
                                            dot={
                                                completada
                                                    ? <CheckOutlined />
                                                    : <ClockCircleOutlined />
                                            }
                                        >

                                            <Card
                                                size="small"
                                                bordered
                                                style={{
                                                    borderRadius: 12
                                                }}
                                            >

                                                <Row
                                                    gutter={[
                                                        16,
                                                        12
                                                    ]}
                                                    align="middle"
                                                >

                                                    <Col
                                                        xs={24}
                                                        md={12}
                                                    >

                                                        <Text strong>
                                                            {
                                                                tarea.titulo
                                                            }
                                                        </Text>

                                                    </Col>


                                                    <Col
                                                        xs={12}
                                                        md={4}
                                                    >

                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                display:
                                                                    "block"
                                                            }}
                                                        >
                                                            Estado
                                                        </Text>

                                                        <Tag
                                                            color={getStatusColor(
                                                                tarea.estado
                                                            )}
                                                        >
                                                            {
                                                                tarea.estado
                                                            }
                                                        </Tag>

                                                    </Col>


                                                    <Col
                                                        xs={12}
                                                        md={3}
                                                    >

                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                display:
                                                                    "block"
                                                            }}
                                                        >
                                                            Prioridad
                                                        </Text>

                                                        <Tag
                                                            color={getPriorityColor(
                                                                tarea.prioridad
                                                            )}
                                                        >
                                                            {
                                                                tarea.prioridad
                                                            }
                                                        </Tag>

                                                    </Col>


                                                    <Col
                                                        xs={24}
                                                        md={5}
                                                    >

                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                display:
                                                                    "block"
                                                            }}
                                                        >
                                                            Vencimiento
                                                        </Text>

                                                        <Space size={5}>

                                                            <CalendarOutlined />

                                                            {
                                                                tarea.fecha_vencimiento
                                                            }

                                                        </Space>

                                                    </Col>

                                                </Row>


                                                <Divider
                                                    style={{
                                                        margin:
                                                            "12px 0"
                                                    }}
                                                />


                                                <Space>

                                                    <UserOutlined />

                                                    <Text type="secondary">
                                                        Responsable:
                                                    </Text>

                                                    <Text>
                                                        {
                                                            tarea.responsable
                                                        }
                                                    </Text>

                                                </Space>

                                            </Card>

                                        </Timeline.Item>

                                    );

                                })}

                            </Timeline>

                        ) : (

                            <Empty
                                description="No existen tareas asociadas al instrumento"
                            />

                        )}

                    </Card>

                </div>


                {/* =================================================
                    AUDITORÍA
                ================================================= */}

                <Card
                    bordered={false}
                    style={sectionCardStyle}
                    title={
                        <Space>

                            <HistoryOutlined />

                            <span style={sectionTitleStyle}>
                                Historial de Actividad
                            </span>

                        </Space>
                    }
                >

                    <Timeline>

                        {auditoria.map(
                            (registro, index) => (

                                <Timeline.Item
                                    key={index}
                                    dot={
                                        <HistoryOutlined />
                                    }
                                    color="blue"
                                >

                                    <Text strong>
                                        {
                                            registro.accion
                                        }
                                    </Text>

                                    <br />

                                    <Text type="secondary">

                                        {
                                            registro.fecha
                                        }

                                        {" · "}

                                        {
                                            registro.usuario
                                        }

                                    </Text>

                                </Timeline.Item>

                            )
                        )}

                    </Timeline>

                </Card>


                {/* =================================================
                    ÚLTIMA ACTUALIZACIÓN
                ================================================= */}

                <Card
                    bordered={false}
                    style={{
                        borderRadius: 14,
                        background: "#fafafa",
                        marginTop: 10
                    }}
                >

                    <Row justify="space-between">

                        <Col>

                            <Space>

                                <ClockCircleOutlined />

                                <Text type="secondary">
                                    Última actualización
                                </Text>

                                <Text strong>
                                    {
                                        instrumento.fecha_actualizacion
                                    }
                                </Text>

                            </Space>

                        </Col>


                        <Col>

                            <Space>

                                <PushpinOutlined />

                                <Text type="secondary">
                                    Última verificación
                                </Text>

                                <Text strong>
                                    {
                                        instrumento.ultima_verificacion
                                    }
                                </Text>

                            </Space>

                        </Col>

                    </Row>

                </Card>

            </div>

        </div>
    );
};

export default FichaInstrumento;