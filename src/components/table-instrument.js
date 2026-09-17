import { message } from "antd"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableLayout, showModalConfirm } from '../layouts';
import { generateColumnsPersonalizadas, createStatusRenderer } from '../utils/tableUtils';
import FormCreateInstrument from './form-create-instrument';
import API_URL from "../config/api";



const TableInstrumentComponent = () => {
    const [dataSource, setDataSource] = useState([]);
    const [columns, setColumns] = useState([]);
    const [searchValue, setSearchValue] = useState('')
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
        fetch(`${API_URL}/instrumentos`)
        .then(res => res.json())
        .then(result => { 
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
                deleteKey: "id"
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
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                const updateData = await fetch(`${API_URL}/instrumentos`);
                const json = await updateData.json();
                setDataSource(json);
                message.success(`El instrumento se ha eliminado con éxito: ${data.instrumento}`);
            } else {
                console.error("Error al eliminar el instrumento");
            }
        } catch (error) {
            console.log("Error en la solicitud", error);
        } 
    };

    return (
        <TableLayout
            addButtonText="Agregar un instrumento"
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
    );
};

export default TableInstrumentComponent;