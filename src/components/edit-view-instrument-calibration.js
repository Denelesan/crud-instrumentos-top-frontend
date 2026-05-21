import { useEffect, useState } from "react";
import { TableLayout } from "../layouts";
import Modal from "antd/es/modal/Modal";
import { createDateRenderer, generateColumns, excludeProperties, createGenericRenderer, changeNameProperties } from "../utils/tableUtils";
import FormCreateCalibrationCertificated from "./form-create-calibration-certificated";
import DetailCertificateInstrument from "./detail-certificate-instrument";
import API_URL from "../config/api";

const tableStyles = `
    .table-layout-header {
        justify-content: flex-end;
    }
    .table-layout-container{
        width:70%;
    }
          
`;

const EditViewInstrumentCalibration = ({id})=>{
    const [columns, setColumns] = useState([])
    const [dataSource, setDataSource] = useState([])
    const [certificateModalVisible, setCertificateModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [instruCalibrSelected, setInstruCalibrSelected] = useState(null)
    const [inputNewData, setInputNewData] = useState(0)

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
            console.log(datosFiltrados)
            const customRenderers={
                fecha_ingreso: createDateRenderer(),
                fecha_entrega: createDateRenderer()
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
            const cols = generateColumns(list,{
                excludeProperties: excludeName,
                customRenderers,
                changeNameKeys:name,
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
            formProps = {{id_instrumento:id, handleUpdateInput, inputNewData}}
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
                 
                 /*onSuccess={async(certificateData) => {
                   console.log("[v0] Datos del certificado a guardar:", certificateData);
                   console.log("otrosdatos:",dataSelected)
                   // Aquí puedes hacer la lógica de guardado adicional si es necesaria
                   // O simplemente cerrar el modal tras guardar exitosamente
                   try {
                    // Enviar datos actualizados al servidor
                    await fetch(`${API_URL}/instrumento/calibraciones/detalle/:id_instrumento/:n_certificado`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(certificateData),
                    })
                    
                    } catch (error) {
                        console.log("Error en la solicitud", error)
                    } finally{
                        setLoading(false)
                    }
                   
                   Modal.success({
                     title: 'Éxito',
                     content: 'Datos del certificado guardados correctamente',
                     onOk: () => setCertificateModalVisible(false)
                   });
                 }}*/
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