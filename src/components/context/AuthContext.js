
import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from 'react';
  
  const AuthContext = createContext(null);
  
  const API_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
  
    // Comprobar si ya existe una sesión al abrir o recargar la app.
    useEffect(() => {
      const comprobarSesion = async () => {
        try {
          const response = await fetch(
            `${API_URL}/api/auth/me`,
            { credentials: 'include' }
          );
  
          if (response.ok) {
            const data = await response.json();
            setUsuario(data.usuario);
          } else {
            setUsuario(null);
          }
        } catch (error) {
          console.error('Error al comprobar sesión:', error);
          setUsuario(null);
        } finally {
          setCargando(false);
        }
      };
  
      comprobarSesion();
    }, []);
  
    const login = async (credenciales) => {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credenciales),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.message || 'No fue posible iniciar sesión'
        );
      }
  
      setUsuario(data.usuario);
      return data.usuario;
    };
  
    const logout = async () => {
      const response = await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.message || 'No fue posible cerrar sesión'
        );
      }
  
      setUsuario(null);
    };

    useEffect(() => {
      if (!usuario) return;
    
      const TIEMPO_INACTIVIDAD = 60*60*1000; // 1 hora
      const INTERVALO_VERIFICACION = 5 * 60 * 1000;
    
      let ultimaActividad = Date.now();
      let temporizadorInactividad;
      let intervalo;
      let verificandoSesion = false;
      let cerrandoSesion = false;
    
      const cerrarSesionLocal = () => {
        if (cerrandoSesion) return;
    
        cerrandoSesion = true;
        clearTimeout(temporizadorInactividad);
        clearInterval(intervalo);
    
        // Actualiza React inmediatamente para que ProtectedRoute
        // pueda redirigir al login.
        setUsuario(null);
    
        fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include'
        }).catch(() => {});
      };
    
      const comprobarTiempoInactividad = () => {
        if (Date.now() - ultimaActividad >= TIEMPO_INACTIVIDAD) {
          cerrarSesionLocal();
          return false;
        }
    
        return true;
      };
    
      const reiniciarTemporizador = () => {
        if (cerrandoSesion) return;
      
        // No permitir que una interacción tardía después del reposo
        // reinicie una sesión cuyo plazo ya venció.
        if (Date.now() - ultimaActividad >= TIEMPO_INACTIVIDAD) {
          cerrarSesionLocal();
          return;
        }
      
        ultimaActividad = Date.now();
        clearTimeout(temporizadorInactividad);
      
        temporizadorInactividad = setTimeout(
          cerrarSesionLocal,
          TIEMPO_INACTIVIDAD
        );
      };
    
      const comprobarSesionServidor = async () => {
        if (
          verificandoSesion ||
          cerrandoSesion ||
          document.visibilityState === 'hidden'
        ) {
          return;
        }
    
        if (!comprobarTiempoInactividad()) return;
    
        verificandoSesion = true;
    
        try {
          const response = await fetch(
            `${API_URL}/api/auth/me`,
            { credentials: 'include' }
          );
    
          if (response.status === 401) {
            cerrarSesionLocal();
          }
        } catch (error) {
          // Un error de red no confirma que la sesión haya expirado.
          console.error('No se pudo comprobar la sesión:', error);
        } finally {
          verificandoSesion = false;
        }
      };
    
      const alVolverAlNavegador = () => {
        if (document.visibilityState === 'hidden') return;
    
        // Importante al volver después de cerrar o suspender el Mac.
        if (!comprobarTiempoInactividad()) return;
    
        comprobarSesionServidor();
      };
    
      const eventosActividad = [
        'mousemove',
        'mousedown',
        'keydown',
        'scroll',
        'touchstart',
        'click'
      ];
    
      eventosActividad.forEach(evento => {
        window.addEventListener(evento, reiniciarTemporizador);
      });
    
      document.addEventListener(
        'visibilitychange',
        alVolverAlNavegador
      );
    
      window.addEventListener('focus', alVolverAlNavegador);
      window.addEventListener('pageshow', alVolverAlNavegador);
    
      reiniciarTemporizador();
    
      intervalo = setInterval(
        comprobarSesionServidor,
        INTERVALO_VERIFICACION
      );
    
      return () => {
        clearTimeout(temporizadorInactividad);
        clearInterval(intervalo);
    
        eventosActividad.forEach(evento => {
          window.removeEventListener(evento, reiniciarTemporizador);
        });
    
        document.removeEventListener(
          'visibilitychange',
          alVolverAlNavegador
        );
    
        window.removeEventListener('focus', alVolverAlNavegador);
        window.removeEventListener('pageshow', alVolverAlNavegador);
      };
    }, [usuario?.id_usuario]);
  
    return (
      <AuthContext.Provider
        value={{ usuario, cargando, login, logout }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error(
        'useAuth debe utilizarse dentro de AuthProvider'
      );
    }
  
    return context;
  }
  