import logo from './logo.svg';
import './App.css';
import { Button, Modal, Table, Tag } from 'antd';
import { useDebugValue, useEffect, useState, useRef } from 'react';

//Componentes
import FormCreateInstrument from './components/form-create-instrument';

function App (){
  const formRef = useRef(null);
  const [columns, setColumns]= useState([])
  const [dataSource, setDataSource]=useState([])
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  
  function deleteProperties (obj, properties){
    properties.forEach(prop => {
      delete obj[prop]
    });
  }
  const dataType = "todos"
  const outProperties = ["obs_estado", "aplica_verif", "aplica_calib", "nombre_responsable", "ubicacion"]
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
        dataIndex: "action"
      })
      setColumns(cols)
      setDataSource(list)

    });


  },[])

  const handleCancel = ()=>{
    setIsFormModalOpen(false)
    if (formRef.current) {
      formRef.current.resetFormFields();  // Llamar al método desde la referencia
  }
    
  }
        
        
  return (
    <div>
      <Button onClick={()=>setIsFormModalOpen(true)} type='primary'>Agregar un instrumento</Button>
      <Modal open={isFormModalOpen} onCancel={handleCancel} footer={null}>
        <FormCreateInstrument ref={formRef}></FormCreateInstrument>
      </Modal>
      <Table size='small' columns={columns} dataSource={dataSource}>

      </Table>
    </div>
  )
}

export default App;
