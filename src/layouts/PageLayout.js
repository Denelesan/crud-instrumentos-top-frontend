
import { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Dropdown,
  Space,
  Typography,
  message,
  Badge
} from 'antd';

import AdminUsuariosModal from '../components/AdminUsuariosModal';

import {
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

import API_URL from "../config/api";

const { Title } = Typography;



const PageLayout = ({
  titleBanner,
  subtitleBanner,
  bannerActions = null,
  title,
  subtitle,
  children,
  showBackButton = true,
  backButtonText = 'Volver',
  backButtonWidth = '10rem',
  onBackClick,
  margin = '50px',
}) => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const [cerrandoSesion, setCerrandoSesion] = useState(false);


const [modalUsuariosAbierto, setModalUsuariosAbierto] =
useState(false);

const [usuariosPendientes, setUsuariosPendientes] =
useState(0);

useEffect(() => {
if (!usuario || usuario.rol !== 'admin') {
  setUsuariosPendientes(0);
  return;
}

const cargarPendientes = async () => {
  try {
    const response = await fetch(
      `${API_URL}/admin/usuarios`,
      { credentials: 'include' }
    );

    if (!response.ok) return;

    const data = await response.json();
    setUsuariosPendientes(data.pendientes);
  } catch (error) {
    console.error(
      'No fue posible consultar las solicitudes pendientes:',
      error
    );
  }
};

cargarPendientes();
}, [usuario]);

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    if (cerrandoSesion) return;

    setCerrandoSesion(true);

    try {
      await logout();

      message.success('Sesión cerrada correctamente');

      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);

      message.error(
        error.message || 'No fue posible cerrar la sesión'
      );
    } finally {
      setCerrandoSesion(false);
    }
  };

  const menuUsuario = {
    items: [
      {
        key: 'usuario-info',
        disabled: true,
        label: (
          <div style={{ minWidth: 180, padding: '4px 0' }}>
            <div style={{ fontWeight: 600, color: '#262626' }}>
              {usuario?.nombre || usuario?.usuario}
            </div>

            <div style={{ fontSize: 12 }}>
              Usuario: {usuario?.usuario}
            </div>
            <div style={{ fontSize: 12 }}>
              Rol: {usuario?.rol}
            </div>            
          </div>
        ),
      },
      {
        type: 'divider',
      },      
        ...(usuario?.rol === 'admin'
        ? [{
            key: 'gestionar-usuarios',
            label: (
              <Space style={{ fontSize: 13,fontWeight: 600, color: '#262626'  }}>
                Gestionar usuarios
                <Badge
                  count={usuariosPendientes}
                  overflowCount={99}
                />
              </Space>
            )
          }]
        : [])
      ,
      {
        type: 'divider',
      },  
      {
        key: 'logout',
        label: cerrandoSesion
          ? 'Cerrando sesión...'
          : 'Cerrar sesión',
        icon: <LogoutOutlined />,
        danger: true,
        disabled: cerrandoSesion,
      },
    ],
    onClick: ({ key }) => {
      if (key === 'logout') {
        handleLogout();
      }
      if (key === 'gestionar-usuarios'){
        setModalUsuariosAbierto(true)
      }
    },
  };
  
  return (
    <>
      {/* Banner superior */}
      <div className="table-layout-banner" style={{ position: 'sticky', top:0, left:0, zIndex:100,overflow: 'hidden',boxShadow: "0 4px 18px rgba(0,0,0,.3)" }}>
        {/* Imagen de fondo */}
        <img src='/Banner1.jpg' alt="Fondo Banner"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      //height: '100%',
      objectFit: 'cover', // Evita que la imagen se deforme
      zIndex: -999          // La mantiene en la capa base
    }}/>
        <div className="table-layout-banner-content">
          <div>
            <div
              className="table-layout-banner-title"
              onClick={handleBack}
            >
              {titleBanner}
            </div>

            {subtitleBanner && (
              <div
                className="table-layout-banner-subtitle"
                onClick={handleBack}
              >
                {subtitleBanner}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {bannerActions && (
              <div className="table-layout-banner-actions">
                {bannerActions}
              </div>
            )}
            
            {usuario && (
              <Dropdown
                menu={menuUsuario}
                trigger={['click']}
                placement="bottomRight"
              >
                
                <Button
                  type="text"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 'auto',
                    padding: '6px 10px',
                    color: 'inherit',
                  }}
                >
                  <Space size={8}>
                  
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                    />

                    <span>
                      {usuario.nombre || usuario.usuario}
                    </span><Badge
                  count={usuariosPendientes}
                  overflowCount={99}
                />
                    <DownOutlined style={{ fontSize: 10 }} />
                    
                  </Space>
                </Button>
              </Dropdown>
            )}
          </div>
        </div>
      </div>

      {/* Contenido de la página */}
      <div style={{ margin }}>
        <Title
          level={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: 0,
          }}
        >
          {title}
        </Title>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: '1px',
          }}
        >
          {children}

          {showBackButton && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <Button
                style={{
                  width: backButtonWidth,
                  background: '#0b3d63',
                  color: 'white',
                }}
                onClick={handleBack}
              >
                {backButtonText}
              </Button>
            </div>
          )}
          {usuario?.rol === 'admin' && (
            <AdminUsuariosModal
              open={modalUsuariosAbierto}
              onClose={() => setModalUsuariosAbierto(false)}
              onPendientesChange={setUsuariosPendientes}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PageLayout;
