import './App.css';
import { TabLayout } from './layouts';
import { AuditOutlined, SettingOutlined,ToolOutlined } from '@ant-design/icons';

//Componentes
import TableInstrumentComponent from './components/table-instrument';
import CalibrationHitoInstrument from './components/calibration-hito-instrument';
import TableVerificaciones from './components/table-verificaciones';

function HomePage (){
    const tabs = [
        {
            label: <><SettingOutlined/><span className='tab-name-card'>Tabla de Instrumentos</span></>,
            key: '1',
            
            children: <TableInstrumentComponent/>
        },
        {
            label:<><ToolOutlined /><span className='tab-name-card'>Hitos de Calibración</span></>,
            key: '2',
            children: <CalibrationHitoInstrument/>
        },
        {
            label:<><AuditOutlined /><span className='tab-name-card'>Hitos de Verificación</span></>,
            key: '3',
            children: <TableVerificaciones/>
        } 
    ];
        
    return (
        <TabLayout
            titleBanner="Sistema de Gestión"
            subtitleBanner="Instrumentos y Accesorios Topográficos"
            bannerActions = {(null)}
            //title="Instrumento y Accesorios Topográfico"
            tabs={tabs}
            type="card"
        />
    );
}

export default HomePage;
