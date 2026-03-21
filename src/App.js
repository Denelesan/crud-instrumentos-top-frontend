import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import HomePage from "./Home-Page";
import DetailViewInstrument from './components/detail-view-instrument';
import DetailCertificateInstrument from './components/detail-certificate-instrument';
import EditViewInstrument from './components/edit-view-instrument';
import EditViewHitoCalibration from './components/edit-view-calibration';
import InstrumentsManagement from './pages/InstrumentsManagement';
import './styles/modifiedFields.css';

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
                    <Route path="/detail/:id" element={<DetailViewInstrument/>} /> 
                    <Route path="/certificate/:id" element={<DetailCertificateInstrument/>} />  {/* Página de detalle de certificado */}
                    <Route path='/edit/:id' element={<EditViewInstrument/>}/>
                    <Route path='/calibration/edit/:id' element={<EditViewHitoCalibration/>}/>
                </Routes>
            </Router>
        </ConfigProvider>
    );
}


export default App
/*
import React, { useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  Tabs,
  Card,
  Pagination,
  Tag,
  Space
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  UserOutlined
} from "@ant-design/icons";
import "./index.css";

const { TabPane } = Tabs;

const instrumentosData = [
  { id: 1, instrumento: "Estación Total Focus", serie: "C933759", tipo: "Estación Total", materialidad: "Plástico", marca: "Spectra", modelo: "Focus 8 2\"", estado: "Operativo" },
  { id: 2, instrumento: "Estación Total Leica", serie: "759045", tipo: "Estación Total", materialidad: "Plástico", marca: "Leica", modelo: "TC407", estado: "Operativo" },
  { id: 3, instrumento: "Estación Total Topco", serie: "8S0351", tipo: "Estación Total", materialidad: "Plástico", marca: "Topcon", modelo: "GPT 3107W", estado: "Operativo" },
  { id: 4, instrumento: "Nivel Topcon 1", serie: "JX2831", tipo: "Nivel", materialidad: "Plástico", marca: "Topcon", modelo: "AT-B4 SX", estado: "Operativo" },
  { id: 5, instrumento: "Nivel Topcon 2", serie: "JX2809", tipo: "Nivel", materialidad: "Plástico", marca: "Topcon", modelo: "AT-B4 SX", estado: "Operativo" },
  { id: 6, instrumento: "GPS GR-5 (m3)", serie: "1118-22260", tipo: "Antena GNSS", materialidad: "Plástico", marca: "Topcon", modelo: "GR-5", estado: "Operativo" },
  { id: 7, instrumento: "GPS GR-5 (m1)", serie: "947-10580", tipo: "Antena GNSS", materialidad: "Plástico", marca: "Topcon", modelo: "GR-5", estado: "Operativo" },
  { id: 8, instrumento: "GPS GR-5 (base)", serie: "1118-22243", tipo: "Antena GNSS", materialidad: "Plástico", marca: "Topcon", modelo: "GR-5", estado: "Operativo" },
  { id: 9, instrumento: "GPS GR-5 (robado)", serie: "No data", tipo: "Antena GNSS", materialidad: "Plástico", marca: "Topcon", modelo: "GR-5", estado: "Robado" },
  { id: 10, instrumento: "GPS GR-5 (m2)", serie: "1117-24661", tipo: "Antena GNSS", materialidad: "Plástico", marca: "Topcon", modelo: "GR-5", estado: "Operativo" },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const filteredData = instrumentosData.filter(item =>
    Object.values(item).some(value =>
      String(value || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Instrumento", dataIndex: "instrumento", key: "instrumento" },
    { title: "Serie", dataIndex: "serie", key: "serie" },
    { title: "Tipo", dataIndex: "tipo", key: "tipo" },
    { title: "Materialidad", dataIndex: "materialidad", key: "materialidad" },
    { title: "Marca", dataIndex: "marca", key: "marca" },
    { title: "Modelo", dataIndex: "modelo", key: "modelo" },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado) => {
        const color =
          estado === "Operativo" ? "green" :
          estado === "Robado" ? "red" : "orange";
        return <Tag color={color}>{estado}</Tag>;
      }
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} aria-label="Editar" />
          <Button icon={<EyeOutlined />} aria-label="Ver" />
          <Button icon={<DeleteOutlined />} danger aria-label="Eliminar" />
        </Space>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white p-6 relative">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(https://img.heroui.chat/landscape?w=1920&h=300&u=topographic)` }}
        />
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sistema de Gestión</h1>
            <p className="text-lg">Instrumentos y Accesorios Topográficos</p>
          </div>
          <Space>
            <Button icon={<QuestionCircleOutlined />}>Ayuda</Button>
            <Button icon={<UserOutlined />}>Mi Cuenta</Button>
          </Space>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tabla de Instrumentos" key="1" />
          <TabPane tab="Hitos de Calibración" key="2" />
          <TabPane tab="Hitos de Verificación" key="3" />
        </Tabs>

        <Card>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <Input
              placeholder="Buscar instrumento..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
              aria-label="Buscar instrumento"
            />
            <Button type="primary" icon={<PlusOutlined />}>Agregar un instrumento</Button>
          </div>

          <Table
            dataSource={items}
            columns={columns}
            rowKey="id"
            pagination={false}
            aria-label="Tabla de instrumentos topográficos"
          />

          <div className="flex justify-between items-center mt-4">
            <span>Mostrando {items.length} de {filteredData.length} instrumentos</span>
            <Pagination
              current={page}
              total={filteredData.length}
              pageSize={rowsPerPage}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}*/
