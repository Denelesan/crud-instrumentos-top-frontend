
# User Stories

- [X] Como usuario quiero visualizar una tabla con todos los instrumentos y accesorios.
- [ ] Como usuario quiero visualizar una tabla con todos los hitos de verificación.
- [X] Como usuario quiero visualizar una tabla con todos los hitos de calibración.
- [ ] Como usuario quiero acceder a editar todos los detalles de los accesorios e instrumentos.
- [ ] Como usuario quiero acceder a visualizar todos los detalles de los accesorios e instrumentos.
- [X] Como usuario quiero poder agregar nuevos accesorios/instrumentos.
- [ ] Como usuario quiero poder imprimir y/o exportar en pdf los detalles de los accesorio/instrumentos.
- [X] Como administrador quiero poder eliminar accesorios/instrumentos.
- [ ] Como administrador quiero poder crear un Hito de verificación
- [X] Como administrador quiero poder crear un Hito de calibración.
- [X] Como administrador quiero poder eliminar un Hito de calibración.
- [ ] Como usuario quiero poder editar información a un hito de verificación vigente.
- [ ] Como usuario quiero poder editar información a un hito de calibración vigente.
- [ ] Como usuario quiero poder agregar instrumentos a un hito de verificación vigente.
- [X] Como usuario quiero poder agregar instrumentos a un hito de calibración vigente.
- [ ] Como usuario quiero poder agregar y visualizar reportes e informes de verificación en pdf.
- [ ] Como usuario quiero poder agregar y visualizar certificados de calibración.


# Bugs


# Misc

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
- [ ] Modificar estado_solic para se defina en razón de la solicitud no de la acción a realizar (no calibrado).
  - **Action**: Se crea tablas de log de calibración para crear un trigger que actualice el estado del hito de calibración.
- [ ] Modificar tabla de instrumentos, para agregar lógica que permita organizar instrumentos y accesorios por "Kit", cómo Kit GNSS 1.
- [X] Se debe agregar lo necesario en base de datos, para generar un log de acciones, o detalles.
  - **Action**: Se crea la tabla de log_calibracion y etapas_calibr para generar lógica de creación de log en estado.


# Notes
- (20-02-2025) Lo relativo a tipo y categoría de instrumentos, se está analizando de la siguiente manera; con el fin de permitir un detalle, quizás, exagerado de los instrumentos y accesorios que se cuentan en la sección, se está postulando mantener el tipo de instrumentos (ver diccionario) en la tabla principal, relacionar la tabla tipos a su categoría (si es un instrumento, accesorio, cable, etc). Y se complementará con una tabla `Kit` que englobará, en caso de ser necesario, los conjuntos en razón de su "categoría" (**por definir**). Esto permitirá detallar los estados de cada elemento, además de englobarlos tal cómo se hace en la práctica y en la compra de estos instrumentos, que muchas veces vienen asociados a Kit (Antena GNSS, libreta, bases tribash, cables, etc).
- (21-02-2025) Se decide mantener la relación de materialidad sólo en la tabla de instrumentos principal, no cambiarla al modelo del instrumento.

- Diccionario de datos:

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

## Diseño

- https://flowbite.com/docs/getting-started/quickstart/
- https://ant.design/ (este se ocupó para el proyecto)
- https://ui.shadcn.com/