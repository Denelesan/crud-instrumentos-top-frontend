import './App.css';
import { Button, Modal, Tabs} from 'antd';
import { useEffect, useState, useRef } from 'react';

//Componentes
import TableInstrumentComponent from './components/table-instrument';
import CalibrationHitoInstrument from './components/calibration-hito-instrument';

function HomePage (){
        
        
  return (
    <div style={{
      margin:10
    }}>
      <h1>Instrumento y Accesorios Topográfico</h1>
      
      <Tabs
        type='card'
        items={[
          {
            label: 'Tabla de Instrumentos',
            key: '1',
            children: <TableInstrumentComponent/>
          },
          {
            label:'Hitos de Calibración',
            key: '2',
            children: <CalibrationHitoInstrument/>
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
