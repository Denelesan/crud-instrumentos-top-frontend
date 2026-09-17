import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import HomePage from "./Home-Page";
import DetailViewInstrument from './components/detail-view-instrument';
import EditViewInstrument from './components/edit-view-instrument';
import EditViewHitoCalibration from './components/edit-view-calibration';
import InstrumentsManagement from './pages/InstrumentsManagement';
import './styles/modifiedFields.css';
import EditViewHitoVerificacion from './components/edit-view-verificacion';
import FichaInstrumento from './components/detail-3-view-instrumento';

function App (){

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 8,
                    fontSize: 14
                },
                components: {
                    Button: {
                        borderRadius: 6,
                    },
                    Input: {
                        borderRadius: 6,
                    },
                    Select: {
                        borderRadius: 6,
                    },
                }
            }}
        >
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>} />  {/* Página principal */}
                    <Route path="/instruments" element={<InstrumentsManagement/>} />  {/* Página de gestión de instrumentos */}
                    <Route path="/detail/:id" element={<FichaInstrumento/>} /> 
                    <Route path='/edit/:id' element={<EditViewInstrument/>}/>
                    <Route path='/calibration/edit/:id' element={<EditViewHitoCalibration/>}/>
                    <Route path='/verificacion/edit/:id' element={<EditViewHitoVerificacion/>}/>
                </Routes>
            </Router>
        </ConfigProvider>
    );
}


export default App

