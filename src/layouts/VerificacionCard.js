import {
    Card,
    Typography,
    Row,
    Col,
    Tag,
    Button,
    Space,
    Divider,
    Tooltip,
    Checkbox
} from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/es' // para español
import FormUpdateVerificacionDatos from "../components/form-update-verificacion-datos";
import { useState, useRef, useEffect } from "react";
import Modal from "antd/es/modal/Modal";

import {
    CalendarOutlined,
    UserOutlined,
    EyeOutlined,
    EditOutlined,
    DownloadOutlined,
    FilePdfOutlined
} from "@ant-design/icons";
dayjs.locale('es')

const { Title, Text } = Typography;

const getTagColor = (estado) => {

    switch (estado) {

        case "Sin problemas":
        case "Funcional":
        case "Actualizado":
        case "Completada":
            return "success";
        
        case "Baja":
            return "blue";

        case "Reparacion":
        case "Mantencion":
        case "Alta":
            return "gold";

        case "Revisión":
        case "Calibracion":
        case "Media":
            return "orange";

        case "Baja del equipo":
        case "Crítica":
        case "Pendiente":
            return "red";

        default:
            return "default";
    }

};

const VerificacionCard = ({ item, tareas, openModalFormUpdateVerificacion,setOpenModalFormUpdateVerificacion }) => {
    
    const [hitoSelected, setHitoSelected] = useState()
    const formRef = useRef(null);

    const handleCancel = () => {
        setOpenModalFormUpdateVerificacion(false)
        setHitoSelected()
        if (formRef.current) {
            if(Object.keys(formRef.current).length>1){
                formRef.current?.resetFormFields();
                formRef.current?.resetCertificadoFields()

            }else{
                formRef.current?.resetFormFields();
            }
            
        }
    };
   
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

                {/* Identificación del hito */}
                <Title
                    level={4}
                    style={{
                        marginBottom: 6
                    }}
                >
                    Hito #{item.id_verificacion} de verificación
                </Title>
                

                {/* Resultado de la verificación */}
                <div
                    style={{
                        marginBottom: 10
                    }}
                >
                    <Text
                        type="secondary"
                        style={{
                            fontSize: 13
                        }}
                    >
                        Resultado de la verificación
                    </Text>

                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#1677ff",
                            marginTop: 2
                        }}
                    >
                        {item.resultado_general || "Sin resultado"}
                    </div>
                </div>

                {/* Información secundaria */}
                <Space size={20}>

                    <Text type="secondary">
                        <CalendarOutlined /> {item.fecha_fin_verif}
                    </Text>

                    <Text type="secondary">
                        <UserOutlined /> {item.responsable}
                    </Text>

                </Space>

                </Col>                

                <Col>

                    <Space>

                        <Tooltip title="Editar"
                        >

                            <Button
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={()=>(
                                    
                                    setOpenModalFormUpdateVerificacion(true),
                                    setHitoSelected(item))}
                            />
                         </Tooltip>
                        {hitoSelected &&
                        <Modal
                            open={openModalFormUpdateVerificacion}
                            onCancel={handleCancel}
                            width={700}
                            footer={null}>
                            <FormUpdateVerificacionDatos
                            itemSelected = {hitoSelected}
                            setOpenModalFormUpdateVerificacion={setOpenModalFormUpdateVerificacion}
                            handleCancel={handleCancel}  
                            ref={formRef} 
                            />
                        </Modal>}
                       

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

                    <Tag color={getTagColor(item.resultado_fisico)}>

                        {item.resultado_fisico}

                    </Tag>

                </Col>

                <Col xs={24} md={8}>

                    <Text strong>Estado operativo</Text>

                    <br/>

                    <Tag color={getTagColor(item.resultado_operativo)}>

                        {item.resultado_operativo}

                    </Tag>

                </Col>

                <Col xs={24} md={8}>

                    <Text strong>Estado digital</Text>

                    <br/>

                    <Tag color={getTagColor(item.resultado_digital)}>

                        {item.resultado_digital}

                    </Tag>

                </Col>

            </Row>

            <Divider />

            {/* OBSERVACIONES */}

            <Text strong>

                Observaciones

            </Text>

            <p style={{marginTop:8}}>

                {item.obs_result}

            </p>

            <Divider />

            {/* ==========================================
                    LISTADO DE TAREAS
                ========================================== */}
            <Text strong>

            Tareas

            </Text>

            {tareas.length > 0 ? (

            <Space
            direction="vertical"
            style={{
                width: "100%"
            }}
            >

            {tareas.map((tarea) => (

                <div
                    key={tarea.id}
                    style={{
                        padding: "10px 15px",
                        borderBottom: "1px solid #f0f0f0",
                    }}
                >

                    {/* INFORMACIÓN PRINCIPAL DE LA TAREA */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                flex: 1,
                            }}
                        >

                            <Checkbox
                                disabled={true}
                                checked={tarea.id_estado_tarea === 3}
                            />

                            <span>
                                {tarea.titulo}
                            </span>

                        </div>

                        <Space>

                            <Tag
                                color={getTagColor(tarea.criticidad)}
                            >
                                {tarea.criticidad}
                            </Tag>

                            <span>
                                {tarea.asignado_tarea}
                            </span>

                            <Tag
                                color={getTagColor(tarea.estado_tarea)}
                            >
                                {tarea.estado_tarea}
                            </Tag>

                        </Space>

                    </div>


                    {/* INFORMACIÓN DE COMPLETADO */}
                    {tarea.id_estado_tarea === 3 && (

                        <div
                            style={{
                                marginTop: "8px",
                                marginLeft: "34px",
                                padding: "7px 10px",
                                backgroundColor: "#fafafa",
                                borderLeft: "2px solid #d9d9d9",
                                color: "#8c8c8c",
                                fontSize: "12px",
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    gap: "20px",
                                    flexWrap: "wrap",
                                }}
                            >

                                <span>
                                    <strong
                                        style={{
                                            color: "#595959"
                                        }}
                                    >
                                        Completado por:
                                    </strong>{" "}
                                    {tarea.completado_por}
                                </span>

                                <span>
                                    <strong
                                        style={{
                                            color: "#595959"
                                        }}
                                    >
                                        Fecha:
                                    </strong>{" "}
                                    {dayjs(tarea.fecha_completada).format('DD/MM/YYYY')}
                                </span>

                            </div>

                            {tarea.comentario_completado && (

                                <div
                                    style={{
                                        marginTop: "4px",
                                    }}
                                >
                                    <strong
                                        style={{
                                            color: "#595959"
                                        }}
                                    >
                                        Comentario:
                                    </strong>{" "}
                                    {tarea.comentario_completado}
                                </div>

                            )}

                        </div>

                    )}

                </div>

            ))}

            </Space>
            

            

            ) : (

            <div
                style={{
                    textAlign: "center",
                    padding: "25px",
                    color: "#999"
                }}
            >
                No hay tareas asociadas.
            </div>

            )}
            <Divider />


            {/* DOCUMENTOS */}

            <Space>

                <FilePdfOutlined />

                <Text>

                    {item.cant_archivos} documento(s) asociado(s)

                </Text>

            </Space>

        </Card>

    );

};

export default VerificacionCard;