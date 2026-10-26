import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Spin, message } from 'antd';
import { ConfigProvider } from 'antd';
import HomePage from "./Home-Page";
import DetailViewInstrument from './components/detail-view-instrument';
import EditViewInstrument from './components/edit-view-instrument';
import EditViewHitoCalibration from './components/edit-view-calibration';
import InstrumentsManagement from './pages/InstrumentsManagement';
import './styles/modifiedFields.css';
import EditViewHitoVerificacion from './components/edit-view-verificacion';
import FichaInstrumento from './components/detail-3-view-instrumento';
import Login from './components/login'

  
  import { AuthProvider } from './components/context/AuthContext';
  import ProtectedRoute from './components/ProtectedRoute';

import API_URL from "./config/api";

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
        <AuthProvider>
          <Routes>
            {/* Ruta pública: no requiere iniciar sesión */}
            <Route path="/login" element={<Login />} />

            {/* Todas las rutas anidadas requieren autenticación */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} 
              />

              <Route
                path="/detail/:id"
                element={<FichaInstrumento />}
              />
            <Route element={<ProtectedRoute roles={['admin','editor']}/>}>
              <Route
                path="/edit/:id"
                element={<EditViewInstrument />}
              />
            </Route>
            <Route element={<ProtectedRoute roles={['admin','editor']}/>}>
              <Route
                path="/calibration/edit/:id"
                element={<EditViewHitoCalibration />}
              />
            </Route>
            <Route element={<ProtectedRoute roles={['admin','editor']}/>}>
              <Route
                path="/verificacion/edit/:id"
                element={<EditViewHitoVerificacion />}
              />
            </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
        </ConfigProvider>
    );
}


export default App

