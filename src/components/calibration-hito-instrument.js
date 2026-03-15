import { useEffect, useState } from "react"
import { Modal, message } from "antd"
import { useNavigate } from 'react-router-dom';
import { TableLayout } from '../layouts';
import { generateColumns, createDateRenderer } from '../utils/tableUtils';
import FormCreateHitoCalibration from "./form-create-hito-calibration";
import AddInstrumentToHitoCalibration from "./add-instrumento-hito-calibration";
import dayjs from "dayjs";
import 'dayjs/locale/es' // para español
import Item from "antd/es/list/Item";
import API_URL from "../config/api";
dayjs.locale('es')



const CalibrationHitoInstrument = () => {
    const [hitoCalibrationSource, setHitoCalibrationSource] = useState([]);
    const [columnsHitoCalibration, setColumnsHitoCalibration] = useState([]);
    const [isAddInstrumentModalOpen, setIsAddInstrumentModalOpen] = useState(false);
    const [hitoCalibrationSelected, setHitoCalibrationSelected] = useState([]);
    const [searchValue, setSearchValue]= useState("")
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const onSearchChange = (e)=>{
      setSearchValue(e.target.value)
    }
    
    const dataFiltered = hitoCalibrationSource.filter((item)=>{
        //console.log(item)
        const search = searchValue.toLowerCase()
    return (
      String(item['Id Hito']).toLowerCase().includes(search.toLowerCase()) ||
      item.empresa?.toLowerCase().includes(search.toLowerCase()) ||
      item['Orden de Compra']?.toLowerCase().includes(search.toLowerCase()) ||
      item['Estado Hito']?.toLowerCase().includes(search.toLowerCase())
    )
    }
    )
    useEffect(() => {
        fetch(`${API_URL}/calibration`)
        .then(res => res.json())
        .then(result => { 
            const list = result;
            
            const customRenderers = {
                // Aplicar renderizador de fechas a todas las columnas que puedan contener fechas
                // Puedes especificar columnas específicas si es necesario
            };
            
            const actionColumns = {
                onEdit: (id) => navigate(`/calibration/edit/${id}`),
                onView: (id) => navigate(`/detail/${id}`),
                onDelete: (id) => onDeleteHitoCalibration(id),
                onAdd: (id) => {
                    setHitoCalibrationSelected(id);
                    setIsAddInstrumentModalOpen(true);
                },
                editKey: "Id Hito",
                viewKey: "id",
                deleteKey: "Id Hito",
                addKey: "Id Hito",
                showAdd: true,
                showEdit: true,
                showView: true,
                showDelete: true
            };
            
            const cols = generateColumns(list, {
                customRenderers,
                actionColumns
            });
            console.log(list)
            setColumnsHitoCalibration(cols);
            setHitoCalibrationSource(list);
        });
    }, [navigate]);
    
    const handleCancel = () => {
        setIsAddInstrumentModalOpen(false);
    };

    const onDeleteHitoCalibration = async (record) => {
        console.log(record);
        try {
            const response = await fetch(`${API_URL}/calibration/delete/${record}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                const updateData = await fetch(`${API_URL}/calibration`);
                const json = await updateData.json();
                setHitoCalibrationSource(json);
                message.success(`El Hito de calibración Nº: ${record} se ha eliminado con éxito`);
            } else {
                console.error("Error al eliminar el Hito de Calibración");
            }
        } catch (error) {
            console.log("Error en la solicitud", error);
        } 
    };

    const showModalCreateHitoCalibration = (createHito) => {
        Modal.confirm({
            title: '¿Estás seguro que deseas crear un nuevo Hito de Calibración',
            content: 'Luego de crear el hito de calibración, deberás indexar los instrumentos asociados',
            okText: 'Crear',
            okType: 'primary',
            cancelText: 'Cancelar',
            onOk() {
                createHitoCalibration();
            },
        });
    };

    const createHitoCalibration = async () => {
        setLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/calibration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(),
            });
            
            if (response.ok) {
                const data = await response.json();
                const updateData = await fetch(`${API_URL}/api/calibration`);
                const json = await updateData.json();
                setHitoCalibrationSource(json);
                console.log("data", json);
                message.success(`Nuevo Hito de Calibración creado con éxito`);
            } else {
                message.error("Error al crear el Hito de Calibración");
            }
        } catch (error) {
            console.log("Error en la solicitud", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <TableLayout
                addButtonText="Agregar un Hito de Calibración"
                columns={columnsHitoCalibration}
                dataSource={dataFiltered}
                onSearchChange={onSearchChange}
                searchValue={searchValue}
                onDelete={onDeleteHitoCalibration}
                deleteConfirmTitle="¿Estás seguro que deseas eliminar este Hito de Calibración y todos sus instrumentos asociados?"
                onAdd={showModalCreateHitoCalibration}
                loading={loading}
                searchPlaceholder = 'Buscar hito de calibración...'
            />
            
            <Modal open={isAddInstrumentModalOpen} onCancel={handleCancel} footer={null}>
                <AddInstrumentToHitoCalibration hitoSelected={hitoCalibrationSelected} />
            </Modal>
        </div>
    );
};

export default CalibrationHitoInstrument;