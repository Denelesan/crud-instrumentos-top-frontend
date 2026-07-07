import React, { useEffect, useState } from "react"
import {Table, Button, message} from "antd"
import API_URL from "../config/api";


const AddInstrumentToHitoVerificacion =({hitoSelected})=>{
    const [dataSource, setDataSource]= useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [changeState, setChangeState] = useState(false)

    const columns = [{
            title: 'Id',
            dataIndex: 'id'
    
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

       /* useEffect(()=>{
            fetch(`http://localhost:5000/api/calibration/aplica_instrumentos/${hitoSelected}`)
            .then(res => res.json())
            .then(result =>{
                const list = result
                console.log(result)
                const listWithKeys = list.map((item)=>({
                    key: item.id,
                    ...item
                    
                }))
                setDataSource(listWithKeys)
                //console.log("Clave del primer elemento:", Object.keys(listKeys[0]))
            })


        },[])*/
    console.log(hitoSelected)
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
                setDataSource(listWithKeys)
                //console.log("Clave del primer elemento:", Object.keys(listKeys[0]))
            })


        },[hitoSelected, changeState])

        const addInstrument = async(selectedRowKeys)=>{
            setChangeState(false)
            let instrumentsSelected = selectedRowKeys.map((item)=>({
                
                id_verificacion:hitoSelected,
                id: item
            }))
            try{
                console.log("Entra: ",instrumentsSelected)
                const responses = await Promise.all(
                    instrumentsSelected.map(async(instrument)=>{
                        return fetch(`${API_URL}/verificaciones/addInstrument`, {
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
                        message.success("Todos los Instrumentos fueron agregados con éxito")
                }
                else {
                    message.success("Problema al agregar los instrumentos")
                }

            }
        catch (error){
            console.error("Error al agregar los instrumentos", error)
            console.log("Error al agregar el instrumento")
        }
    }

        const onSelectChange=(newSelectedRowKeys)=>{
            console.log('Instrumento seleccionado', newSelectedRowKeys)
            setSelectedRowKeys(newSelectedRowKeys)
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
            <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} size="small" pagination={{
                defaultPageSize:7
            }}
            
            />

            <Button type="primary" style={{width: "100%", marginTop:"10px"}} onClick={()=>{
                console.log("Los instrumentos seleccionados son: ", selectedRowKeys)
                addInstrument(selectedRowKeys)
            }}>Agregar</Button>
        </div>
    )
}


export default AddInstrumentToHitoVerificacion