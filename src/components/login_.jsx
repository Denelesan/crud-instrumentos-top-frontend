import { useState } from 'react';
import {Modal,
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
} from 'antd';

import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAuth } from './context/AuthContext.js';
import { useLocation, useNavigate } from 'react-router-dom';
//const API_URL = 'http://localhost:3000';
import API_URL from "../config/api";

function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [modalRegistroAbierto, setModalRegistroAbierto] =
  useState(false);

const [registrando, setRegistrando] = useState(false);

const handleRegistro = async (values) => {
  setRegistrando(true);

  try {
    const response = await fetch(
        `${API_URL}/auth/registro`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: values.nombre,
          usuario: values.usuario,
          password: values.password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'No fue posible enviar la solicitud'
      );
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
  
      // Volver a la página que el usuario intentó abrir.
      const destino = location.state?.from?.pathname || '/';
  
      navigate(destino, { replace: true });
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        background: '#f0f2f5',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Typography.Title level={3}>
            Instrumentos Topográficos
          </Typography.Title>

          <Typography.Text type="secondary">
            Ingresa tus credenciales para continuar
          </Typography.Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          requiredMark={false}
        >
          <Form.Item
            label="Usuario"
            name="usuario"
            rules={[
              {
                required: true,
                message: 'Ingresa tu usuario',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nombre de usuario"
              autoComplete="username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              {
                required: true,
                message: 'Ingresa tu contraseña',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              autoComplete="current-password"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Iniciar sesión
            </Button>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{color:'gray'}}>¿No tienes cuenta?</span>
            <Button
                type="link"
                onClick={() => setModalRegistroAbierto(true)}
            >
                Solicitar acceso / Crear cuenta
            </Button>
            </div>

            <Modal
            title="Solicitar acceso"
            open={modalRegistroAbierto}
            onCancel={() => setModalRegistroAbierto(false)}
            footer={null}
            destroyOnHidden
            >
            <p>
                Completa tus datos. Tu cuenta requerirá aprobación
                antes de poder ingresar al sistema.
            </p>

            <Form
                layout="vertical"
                onFinish={handleRegistro}
                preserve={false}
            >
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
                    {
                    required: true,
                    message: 'Confirma tu contraseña',
                    },
                    ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                        }

                        return Promise.reject(
                        new Error('Las contraseñas no coinciden')
                        );
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
                >
                Enviar solicitud
                </Button>
            </Form>
            </Modal>    
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;


//requireAuth,
//requireRole('admin'),