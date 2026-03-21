import { FileTextOutlined, DownloadOutlined, EditOutlined, ArrowLeftOutlined, CalendarOutlined, DollarOutlined, UserOutlined, CheckCircleOutlined } from "@ant-design/icons/"
import { Button, Card, Empty, Alert, Tag, Divider, Statistic, Row, Col } from "antd"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageLayout } from '../layouts'
import API_URL from "../config/api"
import '../styles/detail-view.css'
import dayjs from "dayjs"
import 'dayjs/locale/es'

dayjs.locale('es')

const DetailCertificateInstrument = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [certificateDetail, setCertificateDetail] = useState(null)
    const [instrumentDetail, setInstrumentDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        // Fetch certificate details
        fetch(`${API_URL}/calibration/certificate/${id}`)
            .then(resp => resp.json())
            .then(data => {
                setCertificateDetail(data)
                // Fetch instrument details associated with the certificate
                if (data.id_instrumento) {
                    fetch(`${API_URL}/instrumentos/${data.id_instrumento}`)
                        .then(resp => resp.json())
                        .then(instrumentData => {
                            setInstrumentDetail(instrumentData)
                        })
                        .catch(err => console.log("[v0] Error fetching instrument:", err))
                }
                setError(null)
            })
            .catch(error => {
                console.log("[v0] Error fetching certificate:", error)
                setError("Error al cargar los detalles del certificado")
            })
            .finally(() => setLoading(false))
    }, [id])

    const handleExportPDF = () => {
        const printWindow = window.open('', '', 'height=600,width=800')
        const contentToPrint = document.getElementById('certificate-detail-content')
        
        if (contentToPrint) {
            printWindow.document.write('<html><head><title>Detalle de Certificado de Calibración</title>')
            printWindow.document.write(`
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
                    .detail-item { padding: 12px; border: 1px solid #e5e6eb; border-radius: 6px; background: #f9fafb; }
                    .detail-label { font-weight: 600; color: #5b4fff; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
                    .detail-value { color: #333; font-size: 14px; }
                    h2 { color: #5b4fff; border-bottom: 2px solid #5b4fff; padding-bottom: 8px; margin-top: 24px; }
                    .status-item { background: #eff6ff; padding: 12px; border-left: 4px solid #0ea5e9; border-radius: 4px; }
                    .stat-value { font-size: 24px; font-weight: 600; color: #5b4fff; }
                    @page { margin: 20mm; }
                </style>
            `)
            printWindow.document.write('</head><body>')
            printWindow.document.write('<h1>Certificado de Calibración Nº ' + (certificateDetail?.n_certificado || id) + '</h1>')
            printWindow.document.write(contentToPrint.innerHTML)
            printWindow.document.write('</body></html>')
            printWindow.document.close()
            
            setTimeout(() => {
                printWindow.print()
            }, 250)
        }
    }

    const handleEdit = () => {
        navigate(`/edit/${id}`)
    }

    const handleBack = () => {
        navigate("/")
    }

    const renderDetailItem = (label, value, icon) => (
        <div className="detail-item">
            <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {icon && <span style={{ color: '#5b4fff' }}>{icon}</span>}
                {label}
            </div>
            <div className="detail-value">{value || '-'}</div>
        </div>
    )

    const getStatusColor = (status) => {
        const statusMap = {
            'válido': 'green',
            'expirado': 'red',
            'pendiente': 'orange',
            'cancelado': 'default',
        }
        return statusMap[status?.toLowerCase()] || 'default'
    }

    const bannerActions = certificateDetail ? (
        <div className="detail-banner-actions">
            <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleExportPDF}
                style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none' }}
            >
                Exportar PDF
            </Button>
            <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEdit}
                style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none' }}
            >
                Editar
            </Button>
        </div>
    ) : null

    return (
        <PageLayout
            titleBanner="Sistema de Gestión"
            subtitleBanner="Certificados de Calibración"
            title={`Detalles del Certificado de Calibración`}
            subtitle="Información completa del certificado y estado de validación"
            bannerActions={bannerActions}
            backButtonText="Volver a la bandeja"
            backButtonWidth="14rem"
            onBackClick={handleBack}
            showBackButton={!loading}
        >
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    closable
                    style={{ marginBottom: '20px' }}
                />
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <p style={{ fontSize: '16px', color: '#999' }}>Cargando detalles del certificado...</p>
                </div>
            ) : certificateDetail ? (
                <div id="certificate-detail-content">
                    {/* Estado del Certificado - Estadísticas */}
                    <Card 
                        style={{ marginBottom: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ textAlign: 'center', padding: '12px' }}>
                                    <Statistic
                                        title="Nº de Certificado"
                                        value={certificateDetail.n_certificado}
                                        prefix={<FileTextOutlined style={{ color: '#5b4fff' }} />}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ textAlign: 'center', padding: '12px' }}>
                                    <Statistic
                                        title="Costo"
                                        value={certificateDetail.precio_calibr_instru}
                                        prefix={<DollarOutlined style={{ color: '#10b981' }} />}
                                        suffix="CLP"
                                    />
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ textAlign: 'center', padding: '12px' }}>
                                    <Statistic
                                        title="Estado"
                                        value={certificateDetail.id_estado_certif || 'Válido'}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ textAlign: 'center', padding: '12px' }}>
                                    <Statistic
                                        title="Responsable"
                                        value={certificateDetail.responsable || '-'}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Información General del Certificado */}
                    <Card 
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircleOutlined style={{ fontSize: '18px', color: '#5b4fff' }} />
                                <span>Información del Certificado</span>
                            </div>
                        }
                        className="detail-card"
                        style={{ marginBottom: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <div className="detail-grid">
                            {renderDetailItem('Nº de Certificado', certificateDetail.n_certificado, <FileTextOutlined />)}
                            {renderDetailItem('Fecha del Certificado', certificateDetail.fecha_certif ? dayjs(certificateDetail.fecha_certif).format('DD [de] MMMM [de] YYYY') : '-', <CalendarOutlined />)}
                            {renderDetailItem('Empresa', certificateDetail.empresa, null)}
                            {renderDetailItem('Estado del Certificado', certificateDetail.id_estado_certif, null)}
                            {renderDetailItem('Responsable', certificateDetail.responsable, <UserOutlined />)}
                            {renderDetailItem('Costo de Calibración', `$${certificateDetail.precio_calibr_instru || '0'}`, <DollarOutlined />)}
                            {renderDetailItem('Fecha de Ingreso', certificateDetail.fecha_ingreso ? dayjs(certificateDetail.fecha_ingreso).format('DD [de] MMMM [de] YYYY') : '-', <CalendarOutlined />)}
                            {renderDetailItem('Fecha de Entrega', certificateDetail.fecha_entrega ? dayjs(certificateDetail.fecha_entrega).format('DD [de] MMMM [de] YYYY') : '-', <CalendarOutlined />)}
                        </div>
                    </Card>

                    {/* Información del Instrumento Asociado */}
                    {instrumentDetail && (
                        <Card 
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileTextOutlined style={{ fontSize: '18px', color: '#5b4fff' }} />
                                    <span>Instrumento Asociado</span>
                                </div>
                            }
                            className="detail-card"
                            style={{ marginBottom: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        >
                            <div className="detail-grid">
                                {renderDetailItem('ID del Instrumento', `#${instrumentDetail.id}`)}
                                {renderDetailItem('Nombre', instrumentDetail.instrumento)}
                                {renderDetailItem('Tipo', instrumentDetail.tipo)}
                                {renderDetailItem('Serie', instrumentDetail.serie)}
                                {renderDetailItem('Marca', instrumentDetail.marca)}
                                {renderDetailItem('Modelo', instrumentDetail.modelo)}
                                {renderDetailItem('Cargo', instrumentDetail.cargo)}
                                {renderDetailItem('Sección/Departamento', instrumentDetail.seccion)}
                            </div>
                            <Divider />
                            <Button 
                                type="link" 
                                onClick={() => navigate(`/detail/${instrumentDetail.id}`)}
                                style={{ color: '#5b4fff', marginTop: '12px' }}
                            >
                                Ver detalles completos del instrumento →
                            </Button>
                        </Card>
                    )}

                    {/* Historial y Notas */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <Card 
                            title="Observaciones"
                            className="detail-card"
                            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        >
                            {certificateDetail.observaciones ? (
                                <div style={{
                                    background: '#fef3c7',
                                    border: '1px solid #fde68a',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    borderLeft: '4px solid #f59e0b'
                                }}>
                                    <p style={{ margin: 0, color: '#92400e' }}>
                                        {certificateDetail.observaciones}
                                    </p>
                                </div>
                            ) : (
                                <Empty 
                                    description="Sin observaciones registradas" 
                                    style={{ padding: '20px' }}
                                />
                            )}
                        </Card>

                        <Card 
                            title="Validez del Certificado"
                            className="detail-card"
                            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        >
                            <div style={{
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                borderRadius: '8px',
                                padding: '12px',
                                borderLeft: '4px solid #0ea5e9'
                            }}>
                                <p style={{ margin: '0 0 8px 0', color: '#0c4a6e', fontWeight: '600' }}>
                                    Estado: <Tag color={getStatusColor(certificateDetail.id_estado_certif)}>
                                        {certificateDetail.id_estado_certif || 'Válido'}
                                    </Tag>
                                </p>
                                <p style={{ margin: 0, color: '#0c4a6e', fontSize: '12px' }}>
                                    Emitido: {certificateDetail.fecha_certif ? dayjs(certificateDetail.fecha_certif).format('DD/MM/YYYY') : '-'}
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <Empty description="No se encontraron detalles del certificado" />
            )}
        </PageLayout>
    )
}

export default DetailCertificateInstrument
