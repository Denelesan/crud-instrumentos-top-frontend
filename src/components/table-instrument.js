import { message } from "antd"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableLayout, showModalConfirm } from '../layouts';
import { generateColumnsPersonalizadas, createStatusRenderer } from '../utils/tableUtils';
import FormCreateInstrument from './form-create-instrument';
import API_URL from "../config/api";
import { useAuth } from '../components/context/AuthContext';
import { tienePermiso } from '../components/context/permisos';



const TableInstrumentComponent = () => {
    const [dataSource, setDataSource] = useState([]);
    const [columns, setColumns] = useState([]);
    const [searchValue, setSearchValue] = useState('')
    const navigate = useNavigate();

    const outProperties = ["obs_estado", "aplica_verif", "aplica_calib", "nombre_responsable", "ubicacion", "cargo", "seccion"];
    // Dentro del componente:
    const { usuario } = useAuth();
    const onSearchChange = (e)=>{
      setSearchValue(e.target.value)
    }

    const filteredData = dataSource.filter((item)=>{
      const search = searchValue.toLowerCase()
      return(
        String(item.id).toLowerCase().includes(search.toLowerCase()) ||
        item.tipo?.toLowerCase().includes(search.toLowerCase()) ||
        item.instrumento?.toLowerCase().includes(search.toLowerCase()) ||
        item.estado?.toLowerCase().includes(search.toLowerCase()) ||
        item.modelo?.toLowerCase().includes(search.toLowerCase()) ||
        item.marca?.toLowerCase().includes(search.toLowerCase()) ||
        item.materialidad?.toLowerCase().includes(search.toLowerCase())
      )
    })

    const columnName = [{
        title: 'Id',
        dataIndex: 'id'
    },
    {
        title: 'Instrumento',
        dataIndex: 'instrumento'
    },
    {
        title: 'Serie',
        dataIndex: 'serie'
    },
    {
        title: 'Tipo',
        dataIndex: 'tipo'
        
    },
    {
        title: 'Marca',
        dataIndex: 'marca'
        
    },
    {
        title: 'Modelo',
        dataIndex: 'modelo'
        
    },
    {
        title: 'Materialidad',
        dataIndex: 'materialidad'
        
    },
    {
        title: 'Estado',
        dataIndex: 'estado'
        
    }]

    useEffect(() => {
        fetch(`${API_URL}/instrumentos`,{
            credentials: 'include',
          })
        .then(res => {
            if (res.status === 401) {
                // La sesión ya no es válida.
                setDataSource([]);
                return;
              }
          
              if (!res.ok) {
                throw new Error('Error al consultar los instrumentos');
              }
          
              return res.json();
        })
        .then(result => {
            if (!Array.isArray(result)) {
                throw new Error('La API no devolvió una lista de instrumentos');
              } 
            const list = result;
            
            const customRenderers = {
                estado: createStatusRenderer()
            };
            
            const actionColumns = {
                onEdit: (id) => navigate(`/edit/${id}`),
                onView: (id) => navigate(`/detail/${id}`),
                onDelete: (record) => onDeleteInstrumento(record),
                showModalConfirm: (onDelete, record) => showModalConfirm(onDelete, record),
                editKey: "id",
                viewKey: "id",
                deleteKey: "id",
                showDelete:tienePermiso(usuario?.rol, 'eliminar'),
                showEdit:tienePermiso(usuario?.rol, 'editar'),
            };

            //console.log(list)
            const cols = generateColumnsPersonalizadas(columnName, {
               // excludeProperties: outProperties,
                customRenderers,
                actionColumns,

            });
            
            setColumns(cols);
            setDataSource(list);
        });
    }, [navigate]);

    const onDeleteInstrumento = async (record) => {
        //const { id } = record;
        //console.log(id);
        try {
            const response = await fetch(`${API_URL}/instrumentos/delete/${record}`, {
                credentials: 'include',                  
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            // Gestionar errores devueltos por Express
            if (!response.ok) {
                message.error(
                data.message || 'No fue posible eliminar el instrumento.'
                );
                return;
            }
            
            
                const updateData = await fetch(`${API_URL}/instrumentos`,{
                    credentials: 'include',
                  });
                  
                  if (!updateData.ok) {
                    throw new Error('El instrumento se eliminó, pero no fue posible actualizar la tabla.');
                  }

                const json = await updateData.json();

                if (!Array.isArray(json)) {
                    throw new Error('La API no devolvió una lista válida de instrumentos.');
                  }

                setDataSource(json);
                message.success(`El instrumento se ha eliminado con éxito: ${record}`);
            

            
        } catch (error) {
            console.log("Error en la solicitud", error);

            message.error(
                error.message || 'Ocurrió un error al intentar eliminar el instrumento.'
              );
        } 
    };

    return (
        <div>
        <TableLayout
            addButtonText="Agregar un instrumento"
            showAddButton={tienePermiso(usuario?.rol, 'crear')}
            columns={columns}
            dataSource={filteredData}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onDelete={onDeleteInstrumento}
            deleteConfirmTitle="¿Estás seguro que deseas eliminar este instrumento?"
            FormComponent={FormCreateInstrument}
            formProps={{ setDataSource }}
            //customStyles={tableStyles}
            tableProps={{
                className: "table-instrument",
                pagination: {
                    position: ['bottomCenter'],
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} instrumentos`
                }
            }}
        />
        </div>
    );
};

export default TableInstrumentComponent;