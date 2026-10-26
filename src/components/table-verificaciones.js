import { message,Tag } from "antd"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableLayout, showModalConfirm } from '../layouts';
import Modal from "antd/es/modal/Modal";
import { generateColumns, createStatusRenderer,generateColumnsPersonalizadas, createDateRenderer } from '../utils/tableUtils';
import API_URL from "../config/api";
import FormCreateVerificacion from "./form-create-verificacion";
import AddInstrumentToHitoVerificacion from "./add-intrument-verificacion";
import { useAuth } from '../components/context/AuthContext';
import { tienePermiso } from '../components/context/permisos';


const TableVerificaciones = () =>{
    const [hitoVerificacionSource, setHitoVerificacionSource] = useState([]);
    const [columnsHitoVerificacion, setColumnsHitoVerificacion] = useState([]);
    const [isAddInstrumentModalOpen, setIsAddInstrumentModalOpen] = useState(false);
    const [hitoVerificacionSelected, setHitoVerificacionSelected] = useState([]);
    const [searchValue, setSearchValue]= useState("")
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const columnName = [{
        title: 'Id',
        dataIndex: 'id_verificacion'
    },
    {
        title: 'Responsable',
        dataIndex: 'responsable'
    },
    {
        title: 'Estado',
        dataIndex: 'estado_verif'
    },
    {
        title: 'Trimestre',
        dataIndex: 'trim_anio',
        render:(valor)=>(<Tag bordered={true} borderRadiusSM={20} color="geekblue">{valor}</Tag>)
        
    },
    {
        title: 'Fecha',
        dataIndex: 'fecha_ini_verif',
        render:createDateRenderer()
        
    }]

    const onSearchChange = (e)=>{
      setSearchValue(e.target.value)
    }
    
    const dataFiltered = hitoVerificacionSource.filter((item)=>{
        //console.log(item)
        const search = searchValue.toLowerCase()
    return (
      String(item['id_verificacion']).toLowerCase().includes(search.toLowerCase()) ||
      item.responsable?.toLowerCase().includes(search.toLowerCase()) ||
      item['estado_verif']?.toLowerCase().includes(search.toLowerCase()) ||
      item['trim_anio']?.toLowerCase().includes(search.toLowerCase())
    )
    }
    )
    useEffect(() => {
        fetch(`${API_URL}/verificacion`)
        .then(res => res.json())
        .then(result => { 
            const list = result;
            
            
            const customRenderers = {
                estado_verif: createStatusRenderer()
                // Aplicar renderizador de fechas a todas las columnas que puedan contener fechas
                // Puedes especificar columnas específicas si es necesario
            };
            
            const actionColumns = tienePermiso(usuario?.rol, 'editar')?{
                onEdit: (id) => navigate(`/verificacion/edit/${id}`),
                //onView: (id) => navigate(`/detail/${id}`),
                onDelete: (id) => onDeleteHitoVerificacion(id),
                onAdd: (id) => {
                    setHitoVerificacionSelected(id);
                    setIsAddInstrumentModalOpen(true);
                },
                showModalConfirm: (onDelete, id) => showModalConfirm(onDelete, id),
                editKey: "id_verificacion",
                //viewKey: "id",
                deleteKey: "id_verificacion",
                addKey: "id_verificacion",
                showAdd: tienePermiso(usuario?.rol, 'editar'),
                showEdit:tienePermiso(usuario?.rol, 'editar'),
                showView: true,
                showDelete:tienePermiso(usuario?.rol, 'eliminar'),
            }:null;
            
            const cols = generateColumnsPersonalizadas(columnName, {
                customRenderers,
                actionColumns
            });
            console.log(list)
            console.log(columnName)
            setColumnsHitoVerificacion(cols);
            setHitoVerificacionSource(list);
        });
    }, [navigate]);
    
    const handleCancel = () => {
        setIsAddInstrumentModalOpen(false);
    };

    const onDeleteHitoVerificacion = async (record) => {
        console.log(record);
        try {
            const response = await fetch(`${API_URL}/verificaciones/delete/${record}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                const updateData = await fetch(`${API_URL}/verificacion`);
                const json = await updateData.json();
                setHitoVerificacionSource(json);
                message.success(`El Hito de Verificación Nº: ${record} se ha eliminado con éxito`);
            } else {
                console.error("Error al eliminar el Hito de Verificación");
            }
        } catch (error) {
            console.log("Error en la solicitud", error);
        } 
    };

 return (
    <div>
        <TableLayout
            addButtonText="Agregar un Hito de Verificación"
            showAddButton={tienePermiso(usuario?.rol, 'crear')}
            columns={columnsHitoVerificacion}
            dataSource={dataFiltered}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onDelete={onDeleteHitoVerificacion}
            deleteConfirmTitle="¿Estás seguro que deseas eliminar este hito de verificación?"
            FormComponent={FormCreateVerificacion}
            formProps={{setHitoVerificacionSource}}
            searchPlaceholder = 'Buscar hito de verificación...'
            //customStyles={tableStyles}
            tableProps={{
                className: "table-instrument",
            }}
        />
        <Modal open={isAddInstrumentModalOpen} onCancel={handleCancel} footer={null} width={"40rem"}>
                <AddInstrumentToHitoVerificacion hitoSelected={hitoVerificacionSelected} />
            </Modal>
        
    </div>
 )   
}

export default TableVerificaciones;