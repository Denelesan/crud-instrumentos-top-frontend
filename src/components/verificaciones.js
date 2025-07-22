import React, { useState } from 'react';
import { Collapse, Badge, Button, Modal, Form, Input, Select, DatePicker, Space } from 'antd';
import { PlusOutlined, FileTextOutlined, DownloadOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;

const Verificaciones = ({ verificaciones = [] }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState(['1']);

  // Datos de prueba si no se proporcionan verificaciones
  const mockVerificaciones = [
    {
      id: 1,
      tipo: 'Verificación Completa',
      fecha: new Date(),
      tecnico: 'Juan Pérez',
      estadoFisico: 'bueno',
      estadoOperativo: 'funcional',
      estadoDigital: 'actualizado',
      observaciones: 'Sin observaciones relevantes.',
      archivos: [{ name: 'Informe.pdf' }]
    }
  ];

  const data = verificaciones.length ? verificaciones : mockVerificaciones;

  const handleOk = () => {
    form.validateFields().then(values => {
      console.log(values);
      setModalVisible(false);
      form.resetFields();
    });
  };

  const getEstadoBadge = (estado) => {
    const statusMap = {
      excelente: 'success',
      bueno: 'processing',
      regular: 'warning',
      deficiente: 'error',
      funcional: 'success',
      limitado: 'warning',
      'no-funcional': 'error',
      actualizado: 'success',
      pendiente: 'warning',
      obsoleto: 'error'
    };
    return <Badge status={statusMap[estado]} text={estado.charAt(0).toUpperCase() + estado.slice(1)} />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <Collapse activeKey={activeKey} onChange={key => setActiveKey(key)} bordered={false}>
        <Panel
          header={
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Verificaciones</h3>
                <p className="text-sm text-gray-500">Historial de verificaciones del estado físico, operativo y digital</p>
              </div>
              <Badge count={data.length} />
            </div>
          }
          key="1"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">Gestiona las verificaciones periódicas del instrumento</p>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                Agregar Verificación
              </Button>
            </div>

            <Modal
              title="Nueva Verificación"
              open={modalVisible}
              onOk={handleOk}
              onCancel={() => setModalVisible(false)}
              okText="Guardar Verificación"
              cancelText="Cancelar"
            >
              <Form layout="vertical" form={form}>
                <Form.Item label="Fecha" name="fecha" rules={[{ required: true }]}> <DatePicker className="w-full" /> </Form.Item>
                <Form.Item label="Tipo de Verificación" name="tipo" rules={[{ required: true }]}> <Select>
                  <Option value="completa">Verificación Completa</Option>
                  <Option value="rutinaria">Verificación Rutinaria</Option>
                  <Option value="especial">Verificación Especial</Option>
                </Select> </Form.Item>
                <Form.Item label="Estado Físico" name="estadoFisico"> <Select>
                  <Option value="excelente">Excelente</Option>
                  <Option value="bueno">Bueno</Option>
                  <Option value="regular">Regular</Option>
                  <Option value="deficiente">Deficiente</Option>
                </Select> </Form.Item>
                <Form.Item label="Estado Operativo" name="estadoOperativo"> <Select>
                  <Option value="funcional">Funcional</Option>
                  <Option value="limitado">Funcionalidad Limitada</Option>
                  <Option value="no-funcional">No Funcional</Option>
                </Select> </Form.Item>
                <Form.Item label="Estado Digital" name="estadoDigital"> <Select>
                  <Option value="actualizado">Actualizado</Option>
                  <Option value="pendiente">Actualización Pendiente</Option>
                  <Option value="obsoleto">Software Obsoleto</Option>
                </Select> </Form.Item>
                <Form.Item label="Técnico Responsable" name="tecnico"> <Input placeholder="Nombre del técnico" /> </Form.Item>
                <Form.Item label="Observaciones" name="observaciones"> <Input.TextArea rows={3} placeholder="Detalles adicionales de la verificación" /> </Form.Item>
              </Form>
            </Modal>

            <div className="space-y-4">
              {data.map((verificacion) => (
                <div
                  key={verificacion.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 border-l-4 border-l-blue-500 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-lg text-gray-800 mb-2">{verificacion.tipo}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Space><CalendarOutlined /><span>{new Date(verificacion.fecha).toLocaleDateString("es-ES")}</span></Space>
                        <Space><UserOutlined /><span>{verificacion.tecnico}</span></Space>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(verificacion.archivos || []).map((archivo, index) => (
                        <Button
                          key={index}
                          type="default"
                          size="small"
                          icon={<FileTextOutlined />}
                        >
                          <DownloadOutlined className="ml-1" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado Físico</label>
                      {getEstadoBadge(verificacion.estadoFisico)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado Operativo</label>
                      {getEstadoBadge(verificacion.estadoOperativo)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado Digital</label>
                      {getEstadoBadge(verificacion.estadoDigital)}
                    </div>
                  </div>

                  {verificacion.observaciones && (
                    <div className="pt-4 border-t border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                      <p className="text-sm text-gray-600">{verificacion.observaciones}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Verificaciones;
