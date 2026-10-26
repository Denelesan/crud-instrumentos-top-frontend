import { useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Form,
  Grid,
  Input,
  Modal,
  Typography,
  message,
  Alert
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAuth } from './context/AuthContext.js';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import {APP} from '../layouts/App.js'

const COLORES = {
  primario: '#0b3d63',
  primarioOscuro: '#082c48',
  acento: '#c9a227',
  fondo: '#eef2f6',
  textoSuave: '#6b7280',
};

const estilos = {
  pagina: {
    minHeight: '100vh',
    display: 'flex',
    background: COLORES.fondo,
  },
  panel: {
    flex: '0 0 42%',
    background: `linear-gradient(160deg, ${COLORES.primario} 0%, ${COLORES.primarioOscuro} 100%)`,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '64px 56px',
    position: 'relative',
    overflow: 'hidden',
  },
  contenido: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(11, 61, 99, 0.12)',
  },
  iconoBadge: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: `${COLORES.primario}12`,
    color: COLORES.primario,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    margin: '0 auto 16px',
  },
  pie: {
    marginTop: 24,
    color: COLORES.textoSuave,
    fontSize: 12,
    textAlign: 'center',
  },
};

function Login() {
  const [loading, setLoading] = useState(false);
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [errorLogin, setErrorLogin] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = Grid.useBreakpoint();
  const esEscritorio = !!screens.md;

  const handleRegistro = async (values) => {
    setRegistrando(true);
    try {
      const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: values.nombre,
          usuario: values.usuario,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No fue posible enviar la solicitud');
      }

      message.success(data.message);
      setModalRegistroAbierto(false);
    } catch (error) {
      
      message.error(error.message);
    } finally {
      setRegistrando(false);
    }
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await login({
        usuario: values.usuario,
        password: values.password,
      });

      message.success('Sesión iniciada correctamente');

      const destino = location.state?.from?.pathname || '/';
      navigate(destino, { replace: true });
    } catch (error) {
      setErrorLogin(error.message);
      //message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={estilos.pagina}>
      {esEscritorio && (
        <aside style={estilos.panel}>
          <SafetyCertificateOutlined style={{ fontSize: 48, color: COLORES.acento, marginBottom: 24 }} />
          <Typography.Title level={2} style={{ color: '#fff', margin: 0 }}>
            Instrumentos Topográficos
          </Typography.Title>
          <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 16 }}>
            Sistema de gestión, control y trazabilidad de instrumentos de medición.
          </Typography.Paragraph>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '32px 0' }} />
          <Typography.Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            Acceso restringido a personal autorizado.
          </Typography.Text>
        </aside>
      )}

      <main style={estilos.contenido}>
        <Card style={estilos.card} variant="borderless">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={estilos.iconoBadge}>
              <SafetyCertificateOutlined />
            </div>
            <Typography.Title level={3} style={{ margin: 0, color: COLORES.primario }}>
              Iniciar sesión
            </Typography.Title>
            <Typography.Text type="secondary">
              Ingresa tus credenciales para continuar
            </Typography.Text>
          </div>
          {errorLogin && (
            <Alert
              type="error"
              showIcon
              message={errorLogin}
              closable
              onClose={() => setErrorLogin(null)}
              style={{ marginBottom: 16 }}
            />
          )}

          <Form layout="vertical" onFinish={handleLogin} requiredMark={false} size="large">
            <Form.Item
              label="Usuario"
              name="usuario"
              rules={[{ required: true, message: 'Ingresa tu usuario' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: COLORES.textoSuave }} />}
                placeholder="Nombre de usuario"
                autoComplete="username"
                autoFocus
              />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: COLORES.textoSuave }} />}
                placeholder="Contraseña"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ background: COLORES.primario, height: 44, fontWeight: 500 }}
              >
                Iniciar sesión
              </Button>
            </Form.Item>
          </Form>

          <Divider plain style={{ fontSize: 13, color: COLORES.textoSuave }}>
            ¿No tienes cuenta?
          </Divider>

          <Button block onClick={() => setModalRegistroAbierto(true)} style={{ height: 40 }}>
            Solicitar acceso
          </Button>
        </Card>

        
        <div style={estilos.pie}>
          <div>
            © {new Date().getFullYear()} {APP.institucion}. Todos los derechos reservados.
          </div>
          <div style={{ marginTop: 4, opacity: 0.8 }}>
            Desarrollado por {APP.desarrollador} · {APP.version}
          </div>
        </div>
      </main>

      <Modal
        title="Solicitar acceso"
        open={modalRegistroAbierto}
        onCancel={() => setModalRegistroAbierto(false)}
        footer={null}
        destroyOnHidden
      >
        <Typography.Paragraph type="secondary">
          Completa tus datos. Tu cuenta requerirá aprobación antes de poder ingresar al sistema.
        </Typography.Paragraph>

        <Form layout="vertical" onFinish={handleRegistro} preserve={false}>
          <Form.Item
            label="Nombre completo"
            name="nombre"
            rules={[
              { required: true, message: 'Ingresa tu nombre' },
              { max: 150, message: 'Máximo 150 caracteres' },
            ]}
          >
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item
            label="Nombre de usuario"
            name="usuario"
            rules={[
              { required: true, message: 'Ingresa un usuario' },
              { max: 100, message: 'Máximo 100 caracteres' },
            ]}
          >
            <Input maxLength={100} autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            extra="Mínimo 10 caracteres"
            rules={[
              { required: true, message: 'Crea una contraseña' },
              { min: 10, message: 'Usa al menos 10 caracteres' },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label="Confirmar contraseña"
            name="confirmarPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirma tu contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={registrando}
            style={{ background: COLORES.primario }}
          >
            Enviar solicitud
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default Login;