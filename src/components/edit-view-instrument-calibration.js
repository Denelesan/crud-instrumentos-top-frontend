import { useEffect, useState } from "react";
import { TableLayout } from "../layouts";
import { createDateRenderer, generateColumns, excludeProperties, createGenericRenderer, changeNameProperties } from "../utils/tableUtils";
import FormCreateCalibrationCertificated from "./form-create-calibration-certificated";
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

    const excludeName = ["id_instrumento", "id_instru_calibr", "id_solic_calibr", "fecha_entrega", "id_tipo"]
    const name = {
        fecha_ingreso:'Fecha',
        n_certificado: "Nº certificado",
        precio_calibr_instru: "Costo"

    }

    useEffect(()=>{
        fetch(`${API_URL}/instrumento/calibraciones/${id}`)
        .then(res => res.json())
        .then(respuesta => {
            const datosFiltrados = respuesta.filter(
                item => isNaN(item.fecha_ingreso)
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
                onEdit: (id)=>console.log(id),
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

            setColumns(cols)
            setDataSource(list)
        })


    },[])


    return (
        <TableLayout
            addButtonText = "Agregar Calibración"
            fontSizeButton = '12px'
            heightButton = '30px'
            paddingButton = '0 10px'
            columns = {columns}
            dataSource = {dataSource}
            //onAdd
            onDelete
            deleteConfirmTitle = "¿Estás seguro que deseas eliminar este elemento?"
            deleteConfirmContent = "Esta acción no se puede deshacer"
            FormComponent = {FormCreateCalibrationCertificated}
            formProps = {{id_instrumento:id}}
            widthModal = {600}
            tableProps = {''}
            showAddButton = {true}
            customStyles = {tableStyles}
            loading = {false}
            searchValue = ''
            onSearchChange = ''
            searchPlaceholder = 'Buscar instrumento...'
        />
    )
}


export default EditViewInstrumentCalibration;