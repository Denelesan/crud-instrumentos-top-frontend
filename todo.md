
# User Stories

- [X] Como usuario quiero visualizar una tabla con todos los instrumentos y accesorios.
- [X] Como usuario quiero visualizar una tabla con todos los hitos de verificación.
- [X] Como usuario quiero visualizar una tabla con todos los hitos de calibración.
- [X] Como usuario quiero acceder a editar todos los detalles de los accesorios e instrumentos.
- [X] Como usuario quiero acceder a visualizar todos los detalles de los accesorios e instrumentos.
- [X] Como usuario quiero poder agregar nuevos accesorios/instrumentos.
- [X] Como usuario quiero poder imprimir y/o exportar en pdf los detalles de los accesorio/instrumentos.
- [X] Como administrador quiero poder eliminar accesorios/instrumentos.
- [X] Como administrador quiero poder crear un Hito de verificación
- [X] Como administrador quiero poder crear un Hito de calibración.
- [X] Como administrador quiero poder eliminar un Hito de calibración.
- [X] Como usuario quiero poder editar información a un hito de verificación vigente.
- [X] Como usuario quiero poder editar información a un hito de calibración vigente.
- [X] Como usuario quiero poder agregar instrumentos a un hito de verificación vigente.
- [X] Como usuario quiero poder agregar instrumentos a un hito de calibración vigente.
- [X] Como usuario quiero poder agregar reportes e informes de verificación en pdf.
- [ ] Como usuario quiero poder visualizar reportes e informes de verificación en pdf.
- [X] Como usuario quiero poder descargar reportes e informes de verificación en pdf.
- [ ] Como usuario quiero poder agregar, descargar y visualizar certificados de calibración.


## Bugs


## Misc

- [X] Se hace necesario realizar un diagrama de flujo para ordenar distribución de componentes y páginas.
![Diagrama de Flujo de Aplicación Web de instrumentos](image.png)

- [X] Modificar base de datos respecto a marca y modelo de instrumento/accesorio. La relación entre marca y modelo se encuentra erronea, ya que se está centralizando en el instrumento, siendo que debería generare una relación directa entre la marca y el modelo. En la tabla de modelo, la marca debería ser una llave foranea.
  - **Action**: Se agrega una llave foranea de id_marca en la tabla de modelo, y se mantiene la fk en la tabla instrumentos.
- [X] Agregar `select` de modelo, dependiente de selección de marca.
- [X] Agregar tabla de categoría de instrumentos, si son accesorios, instrumentos u otros.
  - **Action**: Se realiza la tabla de instrumentos y se relaciona con la tabla de tipo, mediante llave foreanea de `id_categoria`.
- [X] Analizar con Pedro agregar tipo y categoría de instrumentos en el modelo.
- [ ] Histórico de creación de instrumentos, inactividad o robo, vigencia.
- [ ] Fecha de compra de instrumentos.
- [ ] Fecha de garantía en caso de ser necesario.
- [ ] Agregar num ofpa a tabla solic_calibration.
- [X] Modificar estado_solic para se defina en razón de la solicitud no de la acción a realizar (no calibrado).
  - **Action**: Se crea tablas de log de calibración para crear un trigger que actualice el estado del hito de calibración.
  - **Action**: Se crea triger que desde el log de calibraciones actualiza el estado y la fecha de inicio de solicitud.
- [ ] Modificar tabla de instrumentos, para agregar lógica que permita organizar instrumentos y accesorios por "Kit", cómo Kit GNSS 1.
- [X] Se debe agregar lo necesario en base de datos, para generar un log de acciones, o detalles.
  - **Action**: Se crea la tabla de log_calibracion y etapas_calibr para generar lógica de creación de log en estado.


## Notes

- (20-02-2025) Lo relativo a tipo y categoría de instrumentos, se está analizando de la siguiente manera; con el fin de permitir un detalle, quizás, exagerado de los instrumentos y accesorios que se cuentan en la sección, se está postulando mantener el tipo de instrumentos (ver diccionario) en la tabla principal, relacionar la tabla tipos a su categoría (si es un instrumento, accesorio, cable, etc). Y se complementará con una tabla `Kit` que englobará, en caso de ser necesario, los conjuntos en razón de su "categoría" (**por definir**). Esto permitirá detallar los estados de cada elemento, además de englobarlos tal cómo se hace en la práctica y en la compra de estos instrumentos, que muchas veces vienen asociados a Kit (Antena GNSS, libreta, bases tribash, cables, etc).
- (21-02-2025) Se decide mantener la relación de materialidad sólo en la tabla de instrumentos principal, no cambiarla al modelo del instrumento.

## Diccionario de datos:

<table>
    <thead>
        <tr>
            <th>Tabla</th>
            <th> Campo</th>
            <th>Descripción</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="center">tipo</td>
            <td align="center">tipo</td>
            <td align="center">Tipo de instrumento o accesorio topográfico. Siempre hará referencia literalmente al tipo de elemento que define, por ejemplo, el tipo Estación Total, se refiere al instrumento como tal, no a sus accesorios como cables, baterías, bases tribash, etc. Para englobar todo el conjunto, existe la tabla kit. </td>
        </tr>
          <tr>
            <td align="center">categoría</td>
            <td align="center">categoria</td>
            <td align="center">Categoría del tipo de instrumento asociado. Las categorías son las siguientes: instrumento, accesorio, cable, maleta, etc.  </td>
        </tr>
    </tbody>
</table>

## TO-DOs próximos

### S-19/10/2025

#### Sección de Calibración-Detalle de Instrumento

- [X] Mejorar función de generación de columnas, para considerar factores de modificación de nombres de columnas de forma rápida (cómo la de no considerar ciertas columnas).
- [X] Crear columna de acción
- [X] Comenzar con modal para flujo que agrega certificados de calibración.

### 28/03/2026

#### Formulario de Ingreso de certificado**

- [X] Resolver reglas para campos obligatorios tipo date y select.

### 29/03/2026

#### Formulario de Ingreso de certificado

- [X] Resetear formulario al salir del modal.
- [X] Crear modal de consulta para ir o no a formulario de ingreso de detalles de certificado

### 11/04/2026

#### Formulario de Ingreso de certificado

- [X] Permitir que cuando se cree un certificado, se actualice la vista de la tabla. //Se crea estado para traspasar entre componentes.
- [X] El modal de error sólo funciona una vez, al haber un error, si el usuario presiona por segunda vez queda colgado//Se corrige el manejo de errores de los useEffect y de las APIs.

### 18-04-2026

#### Formulario de Ingreso de certificado

- [X] Selección de hitos queda sin renderizar al tener éxito de carga de su información.
- [X] Se corrige en BD longitud de número de certificado tabla -> instrumento_calibr:: 10 -> 50

### 25-04-2026

**Formulario sobre detalles de certificado**
- [X] Cambiar a campos correctos según db.

### 10-05-2026
- [X] Crear consulta y vista en bd para traer los detalles de certificado y calibraciones
- [X] Crear API de petición a consulta/vista realizada
- [X] Crear useEffect para traer información a formulario
- [X] Se rellena campo n_certificado desde API.

### 16-05-2026
**Formulario sobre detalles de certificado**
- [X] Rellenar campos del formulario que cuenten con información desde la tabla de "Certificado"
- [X] Rellenar campos del formulario que cuenten con información desde la tabla de "Certificado_instrumento" según el tipo"
- [X] Crear route PUT para guardar información desde módulo de detalle de certificado y calibración
- [X] Generar useEffect para guardar campos en base de datos desde route creado.

### 21-05-2026
**Formulario sobre detalles de certificado**
- [X] Resolver errores menores sobre carga de información de detalle de certificados

**Tabla Principal de Verificaciones**
- [X] Crear archivo desde un template para tabla principal de verificaciones.

### 26-05-2026
**Base de Datos Verificaciones**
- [X] Crear nuevos campos en BD para cubrir correctamente la lógica de verificaciones

### 30-05-2026
**Tabla Principal de Verificaciones**
- [X] Crear vista en bd para petición de tabla de verificación
- [X] Crear useEffect para traer información desde bd.
- [X] Crear campos de acción.
- [X] Crear botón para crear una nueva verificación

### 06-06-2026
**Sección de Calibración-Detalle de Instrumento**
- [X] Crear columna de estado que informe si el certificado se encuentra vigente o no vigente, en razón de la fecha_certificado.

**Tabla Principal de Verificaciones**
- [X] Crear route para crear una nueva verificación

**Tabla principal de Instrumentos**
- [X] Al presionar el botón de crear un instrumento y no llenar nada en el formulario, y salir del modal, aparece un error. Al ingresar información también.

### 07-06-2026
**Tabla Principal de Verificaciones**
- [X] Crear route para realizar la petición para completar tabla de verificación.
- [X] Crear componente para crear una nueva verificación

### 13-06-2026
**Tabla Principal de Verificaciones**
- [X] Crear lógica de botón de eliminación.
- [X] Crear lógica de botón de agregación.

### 14-06-2026
**Tabla Principal de Verificaciones**
- [X] Crear lógica de botón de edición de hito de verificación.

**Vista Edición Hito Verificaciones**
- [X] Crear componente de edición general.
### 23-06-2026
**Tabla Principal de Verificaciones**
- [X] Crear formulario para consultar y editar campos generales.
- [X] Crear api para llamar campos generales.
- [X] Crear useEffect para llamar campos generales.

**Vista de Instrumentos asociados a hito de verificación**
- [X] Crear api para enlistar instrumentos de un hito de verificación.
- [X] Crear api para eliminar un instumento de un hito de verificación.
- [X] Crear compomente modal para visualizar instrumentos a agregar.
- [X] Crear useEffect para enlistar instrumentos de un hito de verificación.
- [X] Crear useEffect para eliminar instrumentos de un hito de verificación.

### 25-06-2026
**Tabla Principal de Verificaciones**
- [X] Crear api para editar campos generales.
- [X] Crear useEffect para editar campos generales.

### 30-06-2026
**Panel de Jornadas instrumento de Verificaciones.**
- [X] Crear api para crear una nueva jornada de verificación.
- [X] Crear formulario para crear una nueva jornada de verificación.
- [X] Crear useEffect para crear una nueva jornada de verificación.
- [X] Crear API para enlistar jornadas de verificación. 
- [X] Crear useEffect para enlistar jornadas de verificación.

**Vista de Edición Hito Verificaciones**
- [X] Incoprorar botón para incluir informes y formularios al cerrar el hito de verificación.

### 03-07-2026
**Vista de Edición Hito Verificaciones**
- [X] Modelar nuevas tablas para incluir archivos de hito de verificación.
- [] Crear lógica para importar archivos.
- [X] Crear logica para eliminar archivos de base de datos y del servidor.

### 05-07-2026
**Vista de Edición Hito Verificaciones**
- [X] Crear tablas en bd con campos para gestionar archivos de hito de verificación.

**Formulario sobre detalles de certificado**
- [X] Resolver problema sobre falta de carga de detalles de certificado al crear el certificado y dar okey.

### 06-07-2026
**Collapse de Verificación en Hito de Verificación**
- [X] Crear itemizado de cards por cada hito de verificación con campos de interés.

### 18-07-2026
**Collapse de Verificación en Hito de Verificación**
- [X] Crear api para llamar campos de detalle de verificacion por instrumento
- [X] Crar useEffect para consumir campos de detalle de verificacion por instrumento.
- [X] Asignar campos a cards ya creadas.
- [X] Crear modal para ingresar datos de verificacion por instrumento.
- [X] Crear api para insertar nuevos datos de verificación por instrumento.

### 26-07-2026
**Vista de Edición Hito Verificaciones**
- [X] Resolver problema de error al guardar fecha nula en edición de campos generales de verificación.

**Collapse de Verificación en Hito de Verificación**
-[X] Actualizar resultados de hitos de verificación a instrumentos

### 09-08-2026
**Base de Datos**
- [X] Generar consulta y vista para información de cantidad y actualización de registros para modulo instrumentos.
**Instrumentos General**
- [X] Implementar contadores en modulo de instrumentos

### 12-08-2026
- [X] Generar consulta y vista para información de cantidad y actualización de registros para modulo calibraciones.
- [X] Implementar contadores en modulo de calibraciones

### 15-08-2026
- [X] Generar consulta y vista para información de cantidad y actualización de registros para modulo verificaciones.
- [X] Implementar contadores en modulo de verificaciones

### 25-08-2026
**Visualización**
- [X] Terminar registro de verificaciones.

### 28-08-2026
**Visualizaciones**
- [X] Terminar registro de calibraciones.

### 04-09-2026
- [X] Diseñar estructura de base de datos de tareas

### 12-09-2026
- [X] Agregar tareas nuevas desde el módulo de verificación de instrumentos.
- [X] Enlistar tareas de un instrumento en las cartas del hito de verificación.

### 14-09-2026
- [X] Agregar lista de tareas en formulario para actualizar resultados de verificación.
- [X] Agregar tareas a bd desde formulario para actualizar resultados de verificación.
- [X] Agregar tareas temporales en formulario para actualizar resultados de verificación.

### 15-09-2026
- [X] Se mejora gestión de eliminación temporal de tareas. Modifica estilo y agrega botón de restaurar.

**Por organizar**
- [ ] Que al editar la calibración de un instrumento, aparezcan todos los campos.
**Formulario sobre detalles de certificado**
- [ ] Agregar botón y lógica para guardar *.pdf* de certificado.
- [ ] Corregir longitud de n_certificado en tablas de cada tipo de instrumento.

## Diseño

- https://flowbite.com/docs/getting-started/quickstart/
- https://ant.design/ (este se ocupó para el proyecto)
- https://ui.shadcn.com/
