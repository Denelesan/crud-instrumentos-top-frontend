import { useEffect, useRef, useState } from "react"
import { Button, Modal, Table, Tag, message, Tooltip } from "antd"
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleTwoTone} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import FormCreateHitoCalibration from "./form-create-hito-calibration";
import AddInstrumentToHitoCalibration from "./add-instrumento-hito-calibration";




const CalibrationHitoInstrument = ()=>{
    const formRef = useRef(null)
    const [hitoCalibrationSource, setHitoCalibrationSource] = useState([])
    const [columnsHitoCalibration, setColumnsHitoCalibration] = useState([])
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [isAddInstrumentModalOpen, setIsAddInstrumentModalOpen] = useState(false)
    const [hitoCalibrationSelected, setHitoCalibrationSelected] = useState([])
    
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
                <Tooltip title="Agregar Instrumento" >
                  <PlusCircleTwoTone onClick={()=>{
                    let idHito = record["Id Hito"]
                    console.log(idHito)
                    setHitoCalibrationSelected(idHito)
                    setIsAddInstrumentModalOpen(true)
                  }}/>
                </Tooltip>
                
                <EditOutlined onClick={()=>{
                  console.log(record["Id Hito"])
                  navigate(`/calibration/edit/${record["Id Hito"]}`)
                }}/>
                <EyeOutlined onClick={()=>{
                  console.log(record.id)
                  navigate(`/detail/${record.id}`)
                  }}/>
                <DeleteOutlined onClick={()=>showModalConfirm(onDeleteHitoCalibration, record["Id Hito"])} style={{color:"red"}}/>
              </div>
              </>)
            }
          })
          setColumnsHitoCalibration(cols)
          setHitoCalibrationSource(list)   
        });
    },[])
    
    const handleCancel = ()=>{
        setIsFormModalOpen(false)
        setIsAddInstrumentModalOpen(false)
        if (formRef.current) {
          formRef.current.resetFormFields();  // Llamar al método desde la referencia
      }
        
      }
    const showModalConfirm = (onDelete, record)=>{
        Modal.confirm({
          title: '¿Estás seguro que deseas eliminar este Hito de Calibración y todos sus instrumentos asociados?',
          content: 'Esta acción no se puede deshacer',
          okText: 'Eliminar',
          okType: 'danger',
          cancelText: 'Cancelar',
          onOk() {
            onDelete(record);
          },
        })
      }
      const onDeleteHitoCalibration = async (record)=>{
    
        const {id} = record
        console.log(record)
        try {
            const response = await fetch(`http://localhost:5000/api/calibration/delete/${record}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                //body: JSON.stringify(values),
            })
            
                if (response.ok){
                    const data = await response.json()
                    const updateData = await fetch('http://localhost:5000/api/calibration');
                    const json = await updateData.json()
                    setHitoCalibrationSource(json)
                    message.success(`El Hito de calibración Nº: ${record} se ha eliminado con éxito`);
                    
                    
                } else{
                    console.error("Error al eliminar el Hito de Calibración")
                }
            
        } catch (error) {
            console.log("Error en la solicitud", error)
        } 
    }

    return (
        <div>
            <div style={{
                textAlign: 'center',
                marginBottom:20
                }}>
                <Button onClick={()=>setIsFormModalOpen(true)} type='primary'>Agregar un Hito de Calibración</Button>
            </div>
            <Modal open={isFormModalOpen} onCancel={handleCancel} footer={null}>
                <FormCreateHitoCalibration  ref={formRef} setHitoCalibrationSource={setHitoCalibrationSource}></FormCreateHitoCalibration>
            </Modal>
            <Table size='small' columns={columnsHitoCalibration} dataSource={hitoCalibrationSource}>
            </Table>
            <Modal open={isAddInstrumentModalOpen} onCancel={handleCancel} footer={null}>
                <AddInstrumentToHitoCalibration hitoSelected={hitoCalibrationSelected}/>
            </Modal>
        </div>
    )
}

export default CalibrationHitoInstrument