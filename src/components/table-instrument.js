import { Button, Modal, Table, Tabs, Tag, message } from "antd"
import { useEffect, useState, useRef } from 'react';
import {DeleteOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';



const TableInstrumentComponent = ({setDataSource, dataSource})=>{

    const [columns, setColumns]= useState([])
    
    
    
    const navigate = useNavigate()

  
  function deleteProperties (obj, properties){
    properties.forEach(prop => {
      delete obj[prop]
    });
  }
  const outProperties = ["obs_estado", "aplica_verif", "aplica_calib", "nombre_responsable", "ubicacion", "cargo", "seccion"]
  const link = `http://localhost:5000/api/instrumentos`//`https://dummyjson.com/${dataType}`
  useEffect(()=>{
    fetch(link)
    .then(res => res.json())
    .then(result=>{ 
      const list = result//[dataType]
      
      const firstObject = list[0]
      deleteProperties(firstObject,outProperties )
      const cols=[]
      for (const key in firstObject){
        let render = (valor) => {
          // Si el valor es nulo o indefinido, renderiza un mensaje predeterminado
          if (valor === null || valor === undefined) {
            return <span>No data</span>;
          }
          return <span>{String(valor)}</span>;
        };
       
        
        if (typeof firstObject[key] === "object" && firstObject[key] !== null){
          
          if(Array.isArray(firstObject[key])){
            render = ()=>Object.values(firstObject[key]).map(tag=>{
              return (
                <div>
                  <Tag>{tag}</Tag>
                </div>
                
              )
            })
          }else{
            render = (valor)=>
            valor && Object.keys(firstObject[key]).map(key=>{
              return (
                <span>
                  {key}:{valor[key] !== null && valor[key] !== undefined ? valor[key] : "No data"}<br/>
                </span>
                
              )
            })
          }
        }
        let col = {
          title: String(key).charAt(0).toUpperCase()+String(key).slice(1) ,
          dataIndex: key,
          render:render
        }
        cols.push(col)
        
      }
      cols.push({
        title: "Action",
        render: (record)=>{
          
          return (<>
          <div style={{
            display:"flex",
            justifyContent:"space-between",
            width:"80%"}}>
            <EditOutlined onClick={()=>{
              navigate(`/edit/${record.id}`)
            }}/>
            <EyeOutlined onClick={()=>{
              console.log(record.id)
              navigate(`/detail/${record.id}`)
              }}/>
            <DeleteOutlined onClick={()=>showModalConfirm(onDeleteInstrumento, record)} style={{color:"red"}}/>
          </div>
          </>)
        }
      })
      setColumns(cols)
      setDataSource(list)

    });


  },[])

  const showModalConfirm = (onDelete, record)=>{
    Modal.confirm({
      title: '¿Estás seguro que deseas eliminar este instrumento?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        onDelete(record);
      },
    })
  }
  const onDeleteInstrumento = async (record)=>{
    
    const {id} = record
    console.log(id)
    try {
        const response = await fetch(`http://localhost:5000/api/instrumentos/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            //body: JSON.stringify(values),
        })
        
            if (response.ok){
                const data = await response.json()
                const updateData = await fetch('http://localhost:5000/api/instrumentos');
                const json = await updateData.json()
                setDataSource(json)
                message.success(`El instrumento se ha eliminado con éxito: ${data.instrumento}`);
                
                
            } else{
                console.error("Error al eliminar el instrumento")
            }
        
    } catch (error) {
        console.log("Error en la solicitud", error)
    } 
}

    return (
        <div>
            <Table size='small' columns={columns} dataSource={dataSource}>
            </Table>
        </div>

    )
}


export default TableInstrumentComponent;