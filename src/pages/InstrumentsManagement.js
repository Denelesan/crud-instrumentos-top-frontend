import { message } from "antd"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableLayout, showModalConfirm } from '../layouts';
import { generateColumns, createStatusRenderer } from '../utils/tableUtils';
import FormCreateInstrument from '../components/form-create-instrument';
import API_URL from "../config/api";

// Estilos para la tabla de instrumentos
const tableStyles = `
    .instruments-table .ant-table {
        background: transparent;
    }
    .instruments-table .ant-table-thead > tr > th {
        background: #f5f5f5;
        border-bottom: 2px solid rgb(255, 254, 254);
        font-weight: 600;
    }
    .instruments-table .ant-table-tbody > tr > td {
        border-bottom: 1px solid rgb(255, 254, 254);
    }
    .instruments-table .ant-table-tbody > tr:hover > td {
        background: #fafafa;
        border-color: #fafafa;
    }
    .instruments-table .ant-table-cell {
        padding: 12px 16px;
    }
    .instruments-management-header {
        margin-bottom: 24px;
    }
    .instruments-management-header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
        color: #1f1f1f;
    }
    .instruments-management-header p {
        margin: 8px 0 0 0;
        color: #8c8c8c;
        font-size: 14px;
    }
`;

const InstrumentsManagement = () => {
    const [dataSource, setDataSource] = useState([]);
    const [columns, setColumns] = useState([]);
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const outProperties = ["obs_estado", "aplica_verif", "aplica_calib", "nombre_responsable", "ubicacion", "cargo", "seccion"];

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

    const fetchInstruments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/instrumentos`);
            const result = await response.json();
            
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
                deleteKey: "id"
            };
            
            const cols = generateColumns(result, {
                excludeProperties: outProperties,
                customRenderers,
                actionColumns
            });
            
            setColumns(cols);
            setDataSource(result);
        } catch (error) {
            console.error('Error fetching instruments:', error);
            message.error('Error al cargar los instrumentos');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInstruments();
    }, [navigate]);

    const onDeleteInstrumento = async (record) => {
        const { id } = record;
        try {
            const response = await fetch(`${API_URL}/instrumentos/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                fetchInstruments(); // Refresh the list
                message.success(`El instrumento se ha eliminado con éxito: ${data.instrumento}`);
            } else {
                message.error("Error al eliminar el instrumento");
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
            message.error('Error en la solicitud');
        } 
    };

    const handleFormSuccess = () => {
        fetchInstruments(); // Refresh the instruments list after form submission
    };

    return (
        <div>
            <div className="instruments-management-header">
                <h1>Gestión de Instrumentos</h1>
                <p>Administra el inventario de instrumentos topográficos</p>
            </div>
            
            <TableLayout
                addButtonText="Agregar Instrumento"
                columns={columns}
                dataSource={filteredData}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                onDelete={onDeleteInstrumento}
                deleteConfirmTitle="¿Estás seguro que deseas eliminar este instrumento?"
                FormComponent={FormCreateInstrument}
                formProps={{ setDataSource: handleFormSuccess }}
                customStyles={tableStyles}
                loading={loading}
                tableProps={{
                    className: "instruments-table",
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

export default InstrumentsManagement;
