import { useEffect, useState } from "react";
import { TableLayout } from "../layouts";
import Modal from "antd/es/modal/Modal";
import { createMoneyRenderer,createEmpresaRenderer, createDateRenderer, generateColumns, excludeProperties, createGenericRenderer, changeNameProperties,generateColumnsPersonalizadas } from "../utils/tableUtils";
import FormCreateCalibrationCertificated from "./form-create-calibration-certificated";
import DetailCertificateInstrument from "./detail-certificate-instrument";
import API_URL from "../config/api";
import { Tag,Empty,notification, message} from "antd";
import { useAuth } from '../components/context/AuthContext';
import { tienePermiso } from '../components/context/permisos';


const tableStyles = `
    .table-layout-header {
        justify-content: flex-end;
    }
    .table-layout-container{
        width:70%;
    }
          
`;

const EditViewInstrumentCalibration = ({id,setUpdateTrigger})=>{
    const [columns, setColumns] = useState([])
    const [dataSource, setDataSource] = useState([])
    const [certificateModalVisible, setCertificateModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [instruCalibrSelected, setInstruCalibrSelected] = useState(null)
    const [inputNewData, setInputNewData] = useState(0)
    const [totalCertificacionesPendientes, setTotalCertificacionesPendientes] = useState()
    const [fileList, setFileList] = useState([])
    const [archivoPreview, setArchivoPreview] = useState(null);
    
    const [openPreview, setOpenPreview] = useState(false);

    const handlePreview = (archivo) => {

    setArchivoPreview(archivo);
    setOpenPreview(true);

    };

    //const { message, notification } = App.useApp();

    const columnName = [{
        title: 'Fecha XXX Ingreso',
        dataIndex: 'fecha_ingreso'
    },
    {
        title: 'Empresa',
        dataIndex: 'empresa'
    },
    {
        title: 'N Certificado',
        dataIndex: 'n_certificado'
    },
    {
        title: 'Fecha Certificado',
        dataIndex: 'fecha_certif'
        
    },
    {
        title:'Estado',
                render:(data)=>{
                    // Si no hay fecha, manejar el caso nulo
                    if (!data.fecha_certif) {
                        return <Tag bordered={true} borderRadiusSM={20} color={'orange'}>Sin Fecha</Tag>;
                    }
                    const fechaLimite =  new Date()
                    // 2. Reconstruir la fecha a partir del texto chileno (DD-MM-AAAA)
                    // El split detecta guiones (-) o barras (/) automáticamente
                    const partes = data.fecha_certif.split(/[-/]/); 
                    const dia = parseInt(partes[0], 10);
                    const mes = parseInt(partes[1], 10) - 1; // Se resta 1 porque enero es 0 en JavaScript
                    const anio = parseInt(partes[2], 10);

                    // 3. Crear el objeto Date real con los datos limpios
                    const fechaCertificado = new Date(anio, mes, dia);
                    //const fecha_cert_form = fecha_certificado.toLocaleDateString('es-ES')
                    fechaLimite.setFullYear(fechaLimite.getFullYear()-1)
                        if (fechaCertificado.getTime() > fechaLimite.getTime()) {
                           
                            return <Tag bordered={true} borderRadiusSM={20} color={'green'}>Vigente </Tag>
                            
                        } else {
                            
                            return <Tag bordered={true} borderRadiusSM={20} color={'red'}>No vigente</Tag>}
                    }
        
    }]

    const excludeName = ["id_instrumento", "id_instru_calibr", "id_solic_calibr", "fecha_entrega", "id_tipo"]
    const name = {
        fecha_ingreso:'Fecha',
        n_certificado: "Nº certificado",
        precio_calibr_instru: "Costo"

    }

    const handleUpdateInput = () =>{
        setInputNewData(prev=>prev + 1)
    }

  //Soicitar listado de archivos
  useEffect(()=>{
    fetch(`${API_URL}/instrumentos/${id}/archivos`)
    .then(res=>res.json())
    .then(data=>{
        //console.log(data)
        setFileList(
            data
        ) 
    })
    },[inputNewData])

    //Funcion que busque el archivo de la calibracion eleccionada
    const handleDownloadCertificado = async (cod_certificado) => {

        try {
    
            const response = await fetch(
                `${API_URL}/calibracion/${cod_certificado}/archivos/zip`
            );
    
            if (response.ok) {            
                                
                
            // Convertimos la respuesta en Blob
            const blob = await response.blob();
    
            // Creamos una URL temporal
            const url = window.URL.createObjectURL(blob);
    
            // Creamos un enlace temporal
            const link = document.createElement("a");
            link.href = url;
            link.download = `calibracion_${cod_certificado}.zip`;
    
            // Ejecutamos la descarga
            document.body.appendChild(link);
            link.click();
    
            // Limpiamos
            link.remove();
            window.URL.revokeObjectURL(url);
        }
            if (!response.ok) {
                
                //throw new Error("No fue posible generar el archivo ZIP");
                
            }
    
        } catch (error) {
            notification.info({
                message:"Aviso",
                description:`No existe un archivo asociado`,
                duration: 1.5
                //title:"Aviso",
                //content:`Hito Nº ${idHito} actualizado con éxito`,
                });
    
            console.error("Error al descargar archivos:", error);
    
        }
    };


    useEffect(()=>{
        fetch(`${API_URL}/instrumento/calibraciones/${id}`)
        .then(res => res.json())
        .then(respuesta => {
            const datosFiltrados1 = respuesta.filter(
                item => item.fecha_ingreso && item.fecha_certif
            )
            setTotalCertificacionesPendientes(Object.keys(respuesta.filter(
                item => item.fecha_ingreso == null
            )).length)
            const datosFiltrados = datosFiltrados1.map(item=>({
                ...item,
                fecha_ingreso: item.fecha_ingreso? new Date(item.fecha_ingreso).toLocaleDateString('es-CL'): null,
                fecha_certif : item.fecha_certif? new Date(item.fecha_certif).toLocaleDateString('es-CL'):null,
                tieneArchivos : item.tiene_archivos
            })
                
            )
            //console.log(datosFiltrados)
            const customRenderers={
                fecha_ingreso: createDateRenderer(),
                fecha_certif: createDateRenderer(),
                fecha_entrega: createDateRenderer(),
                empresa: createEmpresaRenderer(),
                precio_calibr_instru:createMoneyRenderer()
            }
            const list = datosFiltrados
            setDataSource(list)
            const actionColumns ={

                onView: async (id) => {
                    console.log(dataSource)

                    const data = dataSource.length > 0?dataSource.find(
                        item => item.id_instru_calibr === id):list.find(
                        item => item.id_instru_calibr === id
                    );
                    
                
                    if (!data) {
                        notification.info({
                            message: "Aviso",
                            description: "No existe información para visualizar",
                            duration: 1.5
                        });
                
                        return;
                    }
                
                    const cod_certificado = data.n_certificado;
                
                    try {
                
                        const response = await fetch(
                            `${API_URL}/calibracion/${cod_certificado}/archivos`
                        );
                
                        if (!response.ok) {
                            throw new Error("No fue posible consultar los archivos");
                        }
                
                        const archivos = await response.json();
                
                        console.log("Archivos encontrados:", archivos);
                
                        const firstArchivo = archivos?.[0];
                
                        if (firstArchivo) {
                
                            handlePreview(firstArchivo);
                
                        } else {
                
                            notification.info({
                                message: "Aviso",
                                description: "No existe un archivo asociado",
                                duration: 1.5
                            });
                
                        }
                
                    } catch (error) {
                
                        console.error("Error al consultar archivos:", error);
                
                        notification.info({
                            message: "Aviso",
                            description: "No existe un archivo asociado",
                            duration: 1.5
                        });
                
                    }
                },
                onDownload: (id)=>{
                    const allData = dataSource.length > 0?dataSource.find(item=>item.id_instru_calibr === id):list.find(item=>item.id_instru_calibr === id)
                    
                    if(allData){
                        const cod_certificado = allData.n_certificado
                        handleDownloadCertificado(cod_certificado)
                    }else{
                        notification.info({
                            message:"Aviso",
                            description:`No existe un archivo asociado`,
                            duration: 1.5,
                            title:"Aviso"
                            //content:`Hito Nº ${idHito} actualizado con éxito`,
                            });
                    }
                    //console.log(cod_certificado)
                    
                },
                onEdit: (id_instru_calibr)=>{setCertificateModalVisible(true);setInstruCalibrSelected(id_instru_calibr)},
                viewKey: "id_instru_calibr",
                downloadKey: "id_instru_calibr",
                editKey:"id_instru_calibr",
                isDisableEdit : false,
                isDisableView : (record)=>!record.tieneArchivos,
                isDisableDownload : (record)=>!record.tieneArchivos,
                

            }
            
            const cols = generateColumnsPersonalizadas(columnName,{
                //excludeProperties: excludeName,
                customRenderers,
                //changeNameKeys:name,
                actionColumns:actionColumns
            }) 
            

            //console.log(cols)
            setColumns(cols)
           
        })


    },[inputNewData, certificateModalVisible])


    return (
        <div>
        <TableLayout
            addButtonText = "Agregar Calibración"
            fontSizeButton = '12px'
            heightButton = '30px'
            paddingButton = '0 10px'
            pendientes  = {totalCertificacionesPendientes}
            columns = {columns}
            dataSource = {dataSource}
            onEdit
            onDelete
            deleteConfirmTitle = "¿Estás seguro que deseas eliminar este elemento?"
            deleteConfirmContent = "Esta acción no se puede deshacer"
            FormComponent = {FormCreateCalibrationCertificated}
            formProps = {{id_instrumento:id, handleUpdateInput, inputNewData,setUpdateTrigger}}
            widthModal = {600}
            tableProps = {''}
            showAddButton = {true}
            customStyles = {tableStyles}
            loading = {false}
            searchValue = ''
            onSearchChange = ''
            searchPlaceholder = 'Buscar instrumento...'
        />{
            instruCalibrSelected && (
                <DetailCertificateInstrument
                 isModalVisible={certificateModalVisible}
                 onCancel={() => setCertificateModalVisible(false)}
                setCertificateModalVisible={setCertificateModalVisible}
                 dataSelected={dataSource.find(item=>item.id_instru_calibr === instruCalibrSelected)}
                 loading={loading}
               />    
            )
        }
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
                            src={`${API_URL}/documentacion/archivo/${archivoPreview.id_archivo}/visualizar`}
                            alt={archivoPreview.nombre_original}
                            style={{
                                width: "100%",
                                maxHeight: "70vh",
                                objectFit: "contain"
                            }}
                        />

                    ) : archivoPreview?.tipo === "application/pdf" ? (

                        <iframe
                            src={`${API_URL}/documentacion/archivo/${archivoPreview.id_archivo}/visualizar`}
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
       </div> 
    )
}


export default EditViewInstrumentCalibration;