
import { useState } from 'react';
import {
  Modal,
  Table,
  Tag,
  Button,
  Space,
  message,
  Select
} from 'antd';
import API_URL from "../config/api";
import { useAuth } from './context/AuthContext';



function AdminUsuariosModal({
  open,
  onClose,
  onPendientesChange
}) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [actualizandoId, setActualizandoId] = useState(null);

  console.log(API_URL)
  const { usuario } = useAuth();
  //console.log(usuario)
  const cargarUsuarios = async () => {
    setCargando(true);

    try {
      const response = await fetch(
        `${API_URL}/admin/usuarios`,
        { credentials: 'include' }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No fue posible cargar los usuarios.'
        );
      }

      setUsuarios(data.usuarios);
      onPendientesChange(data.pendientes);
    } catch (error) {
      message.error(error.message);
    } finally {
      setCargando(false);
    }
  };

  // Recargar al abrir el modal.
  // Se ejecuta al cambiar open, no en cada renderizado.
  const [ultimaApertura, setUltimaApertura] = useState(false);

  if (open && !ultimaApertura) {
    setUltimaApertura(true);
    cargarUsuarios();
  }

  if (!open && ultimaApertura) {
    setUltimaApertura(false);
  }

  const handleChangeRol = async (registro, value)=>{
   // console.log(value)

    try {
      const responseRol = await fetch(
        `${API_URL}/admin/usuarios/${registro.id_usuario}/rol`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rol: value
          })
        }
      );

      const dataRol = await responseRol.json();

      if (!responseRol.ok) {
        throw new Error(
          dataRol.message || 'No fue posible actualizar el rol de la cuenta.'
        );
      }

      message.success(dataRol.message);
      await cargarUsuarios();
    } catch (error) {
      message.error(error.message);
    } finally {
      setActualizandoId(null);
    }
    
  }

  const cambiarEstado = async (registro, activo) => {
    setActualizandoId(registro.id_usuario);

    try {
      const response = await fetch(
        `${API_URL}/admin/usuarios/${registro.id_usuario}/estado`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ activo })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No fue posible actualizar la cuenta.'
        );
      }

      message.success(data.message);
      await cargarUsuarios();
    } catch (error) {
      message.error(error.message);
    } finally {
      setActualizandoId(null);
    }
  };

  const columnas = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre'
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario',
      key: 'usuario'
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      render: (_, registro)=>{
        return <Select
      size='small'
      defaultValue={registro.rol}
      style={{ width: 150 }}
      onChange={(value)=>handleChangeRol(registro, value)}
      options={[
        { value: 'admin', label: 'Admin' },
        { value: 'consulta', label: 'Consulta' },
        { value: 'editor', label: 'Editor' },
        
      ]}
      disabled={registro.rol==='admin' && registro.id_usuario ===usuario.id_usuario?true:false}
    />
      }
    },
    {
      title: 'Estado',
      key: 'estado',
      render: (_, registro) => {
        if (!registro.revisado) {
          return <Tag color="gold">Pendiente de revisión</Tag>;
        }

        return registro.activo
          ? <Tag color="green">Activo</Tag>
          : <Tag color="default">Desactivado</Tag>;
      }
    },
    {
      title: 'Acción',
      key: 'accion',
      render: (_, registro) => (
        <Button
          size="small"
          type={registro.activo ? 'default' : 'primary'}
          danger={registro.activo}
          loading={actualizandoId === registro.id_usuario}
          onClick={() =>
            cambiarEstado(registro, !registro.activo)
          }
        >
          {registro.activo ? 'Desactivar' : 'Activar'}
        </Button>
      )
    }
  ];

  return (
    <Modal
      title="Gestión de usuarios"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cerrar" onClick={onClose}>
          Cerrar
        </Button>
      ]}
      width={800}
      destroyOnHidden
    >
      <p>
        Revisa las solicitudes de acceso y administra las
        cuentas existentes.
      </p>

      <Table
        rowKey="id_usuario"
        columns={columnas}
        dataSource={usuarios}
        loading={cargando}
        pagination={{ pageSize: 5 }}
        size="small"
      />
    </Modal>
  );
}

export default AdminUsuariosModal;
