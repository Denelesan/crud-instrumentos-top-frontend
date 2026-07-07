import {
    Card,
    Typography,
    Row,
    Col,
    Tag,
    Button,
    Space,
    Divider,
    Tooltip
} from "antd";

import {
    CalendarOutlined,
    UserOutlined,
    EyeOutlined,
    EditOutlined,
    DownloadOutlined,
    FilePdfOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const getTagColor = (estado) => {

    switch (estado) {

        case "Excelente":
        case "Funcional":
        case "Actualizado":
            return "success";

        case "Bueno":
            return "gold";

        case "Pendiente":
            return "orange";

        case "Deficiente":
            return "red";

        default:
            return "default";
    }

};

const VerificacionCard = ({ item }) => {

    return (

        <Card
            style={{
                marginBottom:24,
                borderRadius:12,
                borderLeft:"5px solid #1677ff",
                boxShadow:"0 3px 10px rgba(0,0,0,.08)"
            }}
        >

            {/* CABECERA */}

            <Row justify="space-between">

                <Col>

                    <Title level={4} style={{marginBottom:8}}>

                        {item.tipo_verificacion}

                    </Title>

                    <Space size={20}>

                        <Text type="secondary">

                            <CalendarOutlined /> {item.fecha}

                        </Text>

                        <Text type="secondary">

                            <UserOutlined /> {item.responsable}

                        </Text>

                    </Space>

                </Col>

                <Col>

                    <Space>

                        <Tooltip title="Ver detalle">

                            <Button
                                shape="circle"
                                icon={<EyeOutlined />}
                            />

                        </Tooltip>

                        <Tooltip title="Editar">

                            <Button
                                shape="circle"
                                icon={<EditOutlined />}
                            />

                        </Tooltip>

                        <Tooltip title="Descargar informe">

                            <Button
                                shape="circle"
                                icon={<DownloadOutlined />}
                            />

                        </Tooltip>

                    </Space>

                </Col>

            </Row>

            <Divider />

            {/* ESTADOS */}

            <Row gutter={[40,20]}>

                <Col xs={24} md={8}>

                    <Text strong>Estado físico</Text>

                    <br/>

                    <Tag color={getTagColor(item.estado_fisico)}>

                        {item.estado_fisico}

                    </Tag>

                </Col>

                <Col xs={24} md={8}>

                    <Text strong>Estado operativo</Text>

                    <br/>

                    <Tag color={getTagColor(item.estado_operativo)}>

                        {item.estado_operativo}

                    </Tag>

                </Col>

                <Col xs={24} md={8}>

                    <Text strong>Estado digital</Text>

                    <br/>

                    <Tag color={getTagColor(item.estado_digital)}>

                        {item.estado_digital}

                    </Tag>

                </Col>

            </Row>

            <Divider />

            {/* OBSERVACIONES */}

            <Text strong>

                Observaciones

            </Text>

            <p style={{marginTop:8}}>

                {item.observaciones}

            </p>

            <Divider />

            {/* DOCUMENTOS */}

            <Space>

                <FilePdfOutlined />

                <Text>

                    {item.documentos} documento(s) asociado(s)

                </Text>

            </Space>

        </Card>

    );

};

export default VerificacionCard;