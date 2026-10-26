import React, { useEffect, useState } from "react"
import {Table, Button, message} from "antd"

import API_URL from "../config/api";

const AddInstrumentToHitoVerificacionFromEditView =({hitoSelected, dataSourceOriginal, dataTemporal,setDataSourceTemporal})=>{
    console.log("Data Temporal",dataTemporal)
    const [dataSource, setDataSource]= useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [changeState, setChangeState] = useState(false)

    const columns = [{
            title: 'Id',
            dataIndex: 'id',
            sorter: (a,b)=> a.id - b.id,
            defaultSortOrder:"ascend"

    
        },
        {
            title: 'Serie',
            dataIndex: 'serie'
        
        },
        {
            title: 'Nombre',
            dataIndex: 'instrumento'
        
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo'
        
        },
        {
            title: 'Marca',
            dataIndex: 'marca'
        
        },
        {
            title: 'Modelo',
            dataIndex: 'modelo'
        
        }]

        const instrumentoEliminadoTemporalmente = dataSourceOriginal.filter(inst=>
            !dataTemporal.some(tempInst => tempInst.id ===inst.id))

        const dataTemporalDeleteWithKeys = instrumentoEliminadoTemporalmente.map((item)=>({
                key:item.id,
                ...item
            }))

        useEffect(()=>{
            fetch(`${API_URL}/verificaciones/aplica_instrumentos/${hitoSelected}`)
            .then(res => res.json())
            .then(result =>{
                const list = result
                console.log(result)
                const listWithKeys = list.map((item)=>({
                    key: item.id,
                    ...item
                    
                }))

                const dataSourceActualizado = [
                    ...listWithKeys.filter(inst=>!dataTemporal.some(tempInst=>tempInst.id === inst.id)), 
                    ...dataTemporalDeleteWithKeys.filter(tempInst => 
                        !listWithKeys.some(inst => inst.id === tempInst.id)
                    )
                ];
                console.log("Lista Original: ", listWithKeys)
                console.log("Data Actualizada: ",dataSourceActualizado)
                setDataSource(dataSourceActualizado)
                //console.log("Clave del primer elemento:", Object.keys(listKeys[0]))
            })


        },[hitoSelected, changeState,dataTemporal])

        const addInstrument = async(selectedRowKeys)=>{
            setChangeState(false)
            console.log("selected Rows:",selectedRows)
            let instrumentsSelected = selectedRows.map((item)=>({
                ...item,
                id_verificacion:hitoSelected,
                //id: item
            }))
            try{
                console.log("Entra: ",instrumentsSelected)
                console.log("Data Temporal", dataTemporal)
                const dataTemporalWithAddInstruments = [
                    ...dataTemporal,
                    ...instrumentsSelected
                ]
                console.log("Data con Instrumentos Agregados: ", dataTemporalWithAddInstruments)
                setDataSourceTemporal(dataTemporalWithAddInstruments)
                setSelectedRowKeys([])
                setChangeState(true)
                message.success("Todos los Instrumentos fueron temporalmente agregados con éxito")
                /*const responses = await Promise.all(
                    instrumentsSelected.map(async(instrument)=>{
                        return fetch('http://localhost:5000/api/calibration/addInstrument', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(instrument),
    
                    })
                    })
                )
                const allSuccessful = responses.every(response=> response.ok)
                
                    
                if (allSuccessful){
                    setSelectedRowKeys([])
                    setChangeState(true)
                    message.success("Todos los Instrumentos fueron temporalmente agregados con éxito")
                }
                else {
                    message.success("Problema al agregar los instrumentos")
                }*/

            }
        catch (error){
            console.error("Error al agregar los instrumentos", error)
            console.log("Error al agregar el instrumento")
        }
    }

        const onSelectChange=(newSelectedRowKeys, newSelectedRows)=>{
            console.log('Instrumento seleccionado key', newSelectedRowKeys)
            console.log('Instrumento seleccionado row:', newSelectedRows)
            setSelectedRowKeys(newSelectedRowKeys)
            setSelectedRows(newSelectedRows)
        }

        const rowSelection = {
            selectedRowKeys,
            onChange: onSelectChange,
            selections:[
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
                Table.SELECTION_NONE
            ]

        }
    return (
        <div>
            <h1>Agregar Instrumentos</h1>
            <Table tableLayout="fixed" rowSelection={rowSelection} columns={columns} dataSource={dataSource} size="small" pagination={{
                defaultPageSize:7
            }}
            
            />

            <Button type="primary" style={{width: "100%", marginTop:"10px", background:'#0b3d63'}} onClick={()=>{
                //console.log("Los instrumentos seleccionados son: ", selectedRowKeys)
                addInstrument(selectedRowKeys) 
            }}>Agregar</Button>
        </div>
    )
}


export default AddInstrumentToHitoVerificacionFromEditView