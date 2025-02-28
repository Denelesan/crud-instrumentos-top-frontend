import React, { useEffect, useState } from "react"
import {Table, Button} from "antd"



const AddInstrumentToHitoCalibration =()=>{
    const [dataSource, setDataSource]= useState([])

    const columns = [{
            title: 'Id',
            dataIndex: 'id',
            key:'id'
    
        },
        {
            title: 'Serie',
            dataIndex: 'serie',
            key: 'serie'
        
        },
        {
            title: 'Nombre',
            dataIndex: 'instrumento',
            key: 'instrumento'
        
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo'
        
        },
        {
            title: 'Marca',
            dataIndex: 'marca',
            key: 'marca'
        
        },
        {
            title: 'Modelo',
            dataIndex: 'modelo',
            key: 'modelo'
        
        }]

        useEffect(()=>{
            fetch(`http://localhost:5000/api/calibration/aplica_instrumentos`)
            .then(res => res.json())
            .then(result =>{
                const list = result
                setDataSource(list)
            })


        },[])
    return (
        <div>
            <h1>Agregar Instrumentos</h1>
            <Table columns={columns} dataSource={dataSource}/>

            <Button type="primary" style={{width: "100%", marginTop:"10px"}} htmlType="submit">Agregar</Button>
        </div>
    )
}


export default AddInstrumentToHitoCalibration