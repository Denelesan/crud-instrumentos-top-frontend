import { Card, Row, Col, Tag, Divider, Space, Badge } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import "../styles/certificateSummary.css";

const CertificateSummary = ({ data }) => {
    if (!data) return null;

    const instrumentTypeMap = {
        1: "Estación Total",
        2: "Nivel",
        3: "Antena GNSS"
    };

    const statusConfig = {
        1: { color: "green", label: "Vigente", icon: <CheckCircleOutlined /> },
        2: { color: "red", label: "Vencido", icon: <ExclamationCircleOutlined /> },
        3: { color: "orange", label: "En Revisión", icon: <ClockCircleOutlined /> },
        4: { color: "gray", label: "Cancelado", icon: <DeleteOutlined /> },
    };

    const renderPrecisionFields = () => {
        const type = data.id_tipo_instru;
        
        if (type === 1) { // Estación Total
            return (
                <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <div className="precision-field">
                                <span className="field-label">Precisión Angular Horizontal</span>
                                <span className="field-value">{data.precision_angular_horizontal || "N/A"} "​</span>
                            </div>
                        </Col>
                        <Col xs={24} sm={12}>
                            <div className="precision-field">
                                <span className="field-label">Precisión Angular Vertical</span>
                                <span className="field-value">{data.precision_angular_vertical || "N/A"} "</span>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <div className="precision-field">
                                <span className="field-label">Precisión en Distancia</span>
                                <span className="field-value">{data.precision_distancia || "N/A"}</span>
                            </div>
                        </Col>
                    </Row>
                </>
            );
        } else if (type === 2) { // Nivel
            return (
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <div className="precision-field">
                            <span className="field-label">Precisión Angular Vertical</span>
                            <span className="field-value">{data.precision_angular_vertical || "N/A"} "</span>
                        </div>
                    </Col>
                    <Col xs={24} sm={12}>
                        <div className="precision-field">
                            <span className="field-label">Precisión en Distancia</span>
                            <span className="field-value">{data.precision_distancia || "N/A"}</span>
                        </div>
                    </Col>
                </Row>
            );
        } else if (type === 3) { // Antena GNSS
            return (
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                        <div className="precision-field">
                            <span className="field-label">Precisión Horizontal</span>
                            <span className="field-value">{data.precision_horizontal || "N/A"}</span>
                        </div>
                    </Col>
                    <Col xs={24} sm={12}>
                        <div className="precision-field">
                            <span className="field-label">Precisión Vertical</span>
                            <span className="field-value">{data.precision_vertical || "N/A"}</span>
                        </div>
                    </Col>
                </Row>
            );
        }
        return null;
    };

    const status = statusConfig[data.id_estado_certif] || statusConfig[1];

    return (
        <Card className="certificate-summary-card">
            <div className="summary-header">
                <div>
                    <h3>Certificado Nº {data.n_certificado}</h3>
                    <Badge
                        status={status.color === "green" ? "success" : status.color === "red" ? "error" : status.color === "orange" ? "warning" : "default"}
                        text={status.label}
                    />
                </div>
                <Tag color={status.color}>{status.icon} {status.label}</Tag>
            </div>

            <Divider />

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <div className="info-field">
                        <span className="field-label">Tipo de Instrumento</span>
                        <span className="field-value">{instrumentTypeMap[data.id_tipo_instru]}</span>
                    </div>
                </Col>
                <Col xs={24} sm={12}>
                    <div className="info-field">
                        <span className="field-label">Empresa</span>
                        <span className="field-value">{data.empresa}</span>
                    </div>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                    <div className="info-field">
                        <span className="field-label">Responsable</span>
                        <span className="field-value">{data.responsable}</span>
                    </div>
                </Col>
                <Col xs={24} sm={12}>
                    <div className="info-field">
                        <span className="field-label">Fecha de Calibración</span>
                        <span className="field-value">{new Date(data.fecha_certif).toLocaleDateString('es-ES')}</span>
                    </div>
                </Col>
            </Row>

            <Divider orientation="left">Datos de Precisión</Divider>

            {renderPrecisionFields()}
        </Card>
    );
};

export default CertificateSummary;
