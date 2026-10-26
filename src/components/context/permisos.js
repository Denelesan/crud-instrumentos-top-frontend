
const permisosPorRol = {
    admin: [
      'ver',
      'crear',
      'editar',
      'eliminar',
      'administrar_usuarios',
    ],
    editor: [
      'ver',
      'crear',
      'editar',
    ],
    consulta: [
      'ver',
    ],
  };
  
  export function tienePermiso(rol, permiso) {
    return permisosPorRol[rol]?.includes(permiso) ?? false;
  }
  