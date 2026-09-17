import { useEffect, useState } from "react";
import { TableLayout } from "../layouts";
import Modal from "antd/es/modal/Modal";
import { createMoneyRenderer,createEmpresaRenderer, createDateRenderer, generateColumns, excludeProperties, createGenericRenderer, changeNameProperties,generateColumnsPersonalizadas } from "../utils/tableUtils";
import FormCreateCalibrationCertificated from "./form-create-calibration-certificated";
import DetailCertificateInstrument from "./detail-certificate-instrument";
import API_URL from "../config/api";
import { Tag } from "antd";

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

    useEffect(()=>{
        fetch(`${API_URL}/instrumento/calibraciones/${id}`)
        .then(res => res.json())
        .then(respuesta => {
            const datosFiltrados1 = respuesta.filter(
                item => isNaN(item.fecha_ingreso)
            )
            const datosFiltrados = datosFiltrados1.map(item=>({
                ...item,
                fecha_ingreso: item.fecha_ingreso? new Date(item.fecha_ingreso).toLocaleDateString('es-CL'): null,
                fecha_certif : item.fecha_certif? new Date(item.fecha_certif).toLocaleDateString('es-CL'):null,
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
            const actionColumns ={

                onView: (id)=>console.log(id),
                onDownload: (id)=>console.log(id),
                onEdit: (id_instru_calibr)=>{setCertificateModalVisible(true);setInstruCalibrSelected(id_instru_calibr)},
                viewKey: "id_instru_calibr",
                downloadKey: "id_instru_calibr",
                editKey:"id_instru_calibr"

            }
            
            const cols = generateColumnsPersonalizadas(columnName,{
                //excludeProperties: excludeName,
                customRenderers,
                //changeNameKeys:name,
                actionColumns:actionColumns
            }) 
            

            //console.log(cols)
            setColumns(cols)
            setDataSource(list)
        })


    },[inputNewData])


    return (
        <div>
        <TableLayout
            addButtonText = "Agregar Calibración"
            fontSizeButton = '12px'
            heightButton = '30px'
            paddingButton = '0 10px'
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
       </div> 
    )
}


export default EditViewInstrumentCalibration;