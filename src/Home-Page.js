import './App.css';
import { Button, Modal, Tabs} from 'antd';
import { useEffect, useState, useRef } from 'react';

//Componentes
import FormCreateInstrument from './components/form-create-instrument';
import TableInstrumentComponent from './components/table-instrument';

function HomePage (){
  const formRef = useRef(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [dataSource, setDataSource]=useState([])
  
  const handleCancel = ()=>{
    setIsFormModalOpen(false)
    if (formRef.current) {
      formRef.current.resetFormFields();  // Llamar al método desde la referencia
  }
    
  }
        
        
  return (
    <div style={{
      margin:10
    }}>
      <h1>Instrumento y Accesorios Topográfico</h1>
      <div style={{
      textAlign: 'center',
      marginBottom:20
    }}>
        <Button onClick={()=>setIsFormModalOpen(true)} type='primary'>Agregar un instrumento</Button>
      </div>
      <Modal open={isFormModalOpen} onCancel={handleCancel} footer={null}>
        <FormCreateInstrument  ref={formRef} setDataSource={setDataSource}></FormCreateInstrument>
      </Modal>
      <Tabs
        type='card'
        items={[
          {
            label: 'Tabla de Instrumentos',
            key: '1',
            children: <TableInstrumentComponent dataSource={dataSource} setDataSource={setDataSource}/>
          },
          {
            label:'Hitos de Calibración',
            key: '2'
          },
          {
            label:"Hitos de Verificación",
            key: '3'
          } 
        ]}
      />
      
    </div>
  )
}

export default HomePage;
