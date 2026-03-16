import { FileTextOutlined, DownloadOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons/"
import { Button, Card, Empty, Divider, Space, Tag, Alert } from "antd"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageLayout } from '../layouts'
import API_URL from "../config/api"
import '../styles/detail-view.css'

const DetailViewInstrument = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [instrumentDetail, setInstrumentDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        fetch(`${API_URL}/instrumentos/${id}`)
            .then(resp => resp.json())
            .then(data => {
                setInstrumentDetail(data)
                setError(null)
            })
            .catch(error => {
                console.log("[v0] Error en la solicitud", error)
                setError("Error al cargar los detalles del instrumento")
            })
            .finally(() => setLoading(false))
    }, [id])

    const handleExportPDF = () => {
        const printWindow = window.open('', '', 'height=600,width=800')
        const contentToPrint = document.getElementById('instrument-detail-content')
        
        if (contentToPrint) {
            printWindow.document.write('<html><head><title>Ficha de Instrumento Topográfico</title>')
            printWindow.document.write(`
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
                    .detail-item { padding: 12px; border: 1px solid #e5e6eb; border-radius: 6px; background: #f9fafb; }
                    .detail-label { font-weight: 600; color: #5b4fff; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
                    .detail-value { color: #333; font-size: 14px; }
                    h2 { color: #5b4fff; border-bottom: 2px solid #5b4fff; padding-bottom: 8px; margin-top: 24px; }
                    .observations { background: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; border-radius: 4px; }
                    @page { margin: 20mm; }
                </style>
            `)
            printWindow.document.write('</head><body>')
            printWindow.document.write('<h1>Ficha de Instrumento Topográfico Nº ' + id + '</h1>')
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

    const renderDetailItem = (label, value) => (
        <div className="detail-item">
            <div className="detail-label">{label}</div>
            <div className="detail-value">{value || '-'}</div>
        </div>
    )

    const bannerActions = instrumentDetail ? (
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
            subtitleBanner="Instrumentos y Accesorios Topográficos"
            title={`Detalles del Instrumento Topográfico`}
            subtitle="Información completa y estado del instrumento"
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
                    <p style={{ fontSize: '16px', color: '#999' }}>Cargando detalles del instrumento...</p>
                </div>
            ) : instrumentDetail ? (
                <div id="instrument-detail-content">
                    {/* Sección de Detalles Principales */}
                    <Card 
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileTextOutlined style={{ fontSize: '18px', color: '#5b4fff' }} />
                                <span>Información General del Instrumento</span>
                            </div>
                        }
                        className="detail-card"
                        style={{ marginBottom: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <div className="detail-grid">
                            {renderDetailItem('ID del Instrumento', `#${instrumentDetail.id}`)}
                            {renderDetailItem('Nombre del Instrumento', instrumentDetail.instrumento)}
                            {renderDetailItem('Tipo', instrumentDetail.tipo)}
                            {renderDetailItem('Número de Serie', instrumentDetail.serie)}
                            {renderDetailItem('Marca', instrumentDetail.marca)}
                            {renderDetailItem('Modelo', instrumentDetail.modelo)}
                            {renderDetailItem('Cargo', instrumentDetail.cargo)}
                            {renderDetailItem('Sección/Departamento', instrumentDetail.seccion)}
                        </div>
                    </Card>

                    {/* Sección de Estado y Observaciones */}
                    <Card 
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>Estado y Observaciones</span>
                            </div>
                        }
                        className="detail-card"
                        style={{ marginBottom: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        {instrumentDetail.obs_estado ? (
                            <div className="observations-section">
                                <h4 style={{ color: '#333', marginBottom: '12px', marginTop: 0 }}>Observaciones de Estado</h4>
                                <div style={{
                                    background: '#fef3c7',
                                    border: '1px solid #fde68a',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    borderLeft: '4px solid #f59e0b'
                                }}>
                                    <p style={{ margin: 0, color: '#92400e' }}>
                                        {instrumentDetail.obs_estado}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Empty 
                                description="Sin observaciones registradas" 
                                style={{ padding: '20px' }}
                            />
                        )}
                    </Card>

                    {/* Secciones Futuras */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <Card 
                            title="Historial de Verificaciones"
                            className="detail-card"
                            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        >
                            <Empty 
                                description="Sin verificaciones registradas" 
                                style={{ padding: '20px' }}
                            />
                        </Card>

                        <Card 
                            title="Historial de Calibraciones"
                            className="detail-card"
                            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                        >
                            <Empty 
                                description="Sin calibraciones registradas" 
                                style={{ padding: '20px' }}
                            />
                        </Card>
                    </div>

                    <Card 
                        title="Tareas Asociadas"
                        className="detail-card"
                        style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <Empty 
                            description="Sin tareas asociadas" 
                            style={{ padding: '20px' }}
                        />
                    </Card>
                </div>
            ) : (
                <Empty description="No se encontraron detalles del instrumento" />
            )}
        </PageLayout>
    )
}

export default DetailViewInstrument
