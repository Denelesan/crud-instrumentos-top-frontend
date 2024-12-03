import { useEffect, useState } from "react"
import { Button, Modal, Table, Tag, message } from "antd"
import {DeleteOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';




const CalibrationHitoInstrument = ()=>{

    const [hitoCalibrationSource, setHitoCalibrationSource] = useState([])
    const [columnsHitoCalibration, setColumnsHitoCalibration] = useState([])
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    
    const navigate = useNavigate()
    
    useEffect(()=>{
        fetch(`http://localhost:5000/api/calibration`)
        .then(res => res.json())
        .then(result=>{ 
          const list = result//[dataType]
          
          const firstObject = list[0]
          //deleteProperties(firstObject,outProperties )
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
                <DeleteOutlined onClick={()=>showModalConfirm(/*onDeleteInstrumento, */record)} style={{color:"red"}}/>
              </div>
              </>)
            }
          })
          setColumnsHitoCalibration(cols)
          setHitoCalibrationSource(list)
    
        });



    }, [])

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

    return (
        <div>
            <div style={{
                textAlign: 'center',
                marginBottom:20
                }}>
                <Button onClick={()=>setIsFormModalOpen(true)} type='primary'>Agregar un Hito de Calibración</Button>
            </div>
            <Table size='small' columns={columnsHitoCalibration} dataSource={hitoCalibrationSource}>
            </Table>
        </div>
    )
}

export default CalibrationHitoInstrument