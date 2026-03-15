import './App.css';
import { TabLayout } from './layouts';

//Componentes
import TableInstrumentComponent from './components/table-instrument';
import CalibrationHitoInstrument from './components/calibration-hito-instrument';

function HomePage (){
    const tabs = [
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
    ];
        
    return (
        <TabLayout
            titleBanner="Sistema de Gestión"
            subtitleBanner="Instrumentos y Accesorios Topográficos"
            bannerActions = {null}
            //title="Instrumento y Accesorios Topográfico"
            tabs={tabs}
            type="card"
        />
    );
}

export default HomePage;
