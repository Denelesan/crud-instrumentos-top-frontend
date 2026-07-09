import { Flex, Tag,Typography, } from "antd";
import { AuditOutlined,CalendarOutlined,DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleTwoTone,DownloadOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

const { Title, Text } = Typography;

// Función para eliminar propiedades de un objeto
export function deleteProperties(obj, properties) {
    properties.forEach(prop => {
        delete obj[prop];
    });
}

// Función para cambiar nombres de un objeto

export function changeNameProperties(obj, names){
    return Object.keys(obj).reduce((acum, key)=>{
        const keyNew = names[key] || key
        acum[keyNew] = obj[key]
        
        return acum;
    },{})
}

// Función para generar renderizador de estado con colores
export function createStatusRenderer() {
    return (valor) => {
        if (valor === null || valor === undefined) {
            return <Text strong>  -</Text>;
        }
        
        const color = valor === "Operativo" ? "#2ecc71" : valor === "Robado" ? "red" : "orange";
        return <Tag bordered={true} borderRadiusSM={20} color={color}>{valor}</Tag>;
    };
}

// Función para generar renderizador de fechas
export function createDateRenderer() {
    return (valor) => {
        if (valor === null || valor === undefined) {
            return <Text strong>  -</Text>;
        }
        
        if (typeof valor === 'string') {
            const isoDateMatch = valor.match(/^\d{4}-\d{2}-\d{2}/);
            if (isoDateMatch) {
                const date = dayjs(valor);
                if (date.isValid()) {
                    return <Text strong> {date.format("DD-MM-YYYY")}</Text>;
                }
            }
        }
        
        return (<Text strong> <CalendarOutlined  /> {String(valor)}</Text>);
    };
}

// Función para generar renderizado de empresa
export function createEmpresaRenderer(){
    return (valor)=>{
        return (<Text strong > <AuditOutlined /> {String(valor)}</Text>)
    }
}

export function createMoneyRenderer() {
    return (valor) => {
        if (valor === null || valor === undefined || isNaN(valor)) {
            return <Text strong>  -</Text>;
        }
        const formato = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(valor);
        
        return <Text strong> {formato}</Text>;
    };
}

// Función para generar renderizador genérico
export function createGenericRenderer(firstObject, key) {
    return (valor) => {
        if (valor === null || valor === undefined) {
            return <Text strong> -</Text>;
        }
        
        if (typeof firstObject[key] === "object" && firstObject[key] !== null) {
            if (Array.isArray(firstObject[key])) {
                return Object.values(firstObject[key]).map(tag => (
                    <div key={tag}>
                        <Tag>{tag}</Tag>
                    </div>
                ));
            } else {
                return valor && Object.keys(firstObject[key]).map(key => (
                    <span key={key}>
                        {key}:{valor[key] !== null && valor[key] !== undefined ? valor[key] : "No data"}<br/>
                    </span>
                ));
            }
        }
        
        return <Text strong> {String(valor)}</Text>;
    };
}

// Función para generar columnas de acciones básicas
export function createActionColumns({ 
    onEdit, 
    onView, 
    onDelete, 
    onAdd,
    onDownload,
    showModalConfirm, // función para mostrar el modal, pasada desde el layout
    editKey = "id",
    viewKey = "id",
    deleteKey = "id",
    addKey = "Id Hito",
    downloadKey = "id",
    showAdd = false,
    showEdit = true,
    showView = true,
    showDelete = true,
    showDownload = true,
}) {
    const actions = [];
    
    /*if (showAdd && onAdd) {
        actions.push({
            title: "Action",
            render: (record) => (
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "80%"
                }}>
                    <PlusCircleTwoTone onClick={() => onAdd(record[addKey])} />
                </div>
            )
        });
    }*/
    
    if (showEdit || showView || showDelete || showDownload || (showAdd && onAdd)) {
        actions.push({
            title: "Action",
            align:'center',
            render: (record) => (
                <div
                    style={{
                        width:"100%",
                        display:"flex",
                        justifyContent:"center"
                    }}>
                    <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "80%"
                }}>
                    {showAdd && onAdd && (
                        <PlusCircleTwoTone onClick={() => onAdd(record[addKey])} />
                    )}
                    {showEdit && onEdit && (
                        <EditOutlined onClick={() => onEdit(record[editKey])} />
                    )}
                    {showView && onView && (
                        <EyeOutlined onClick={() => onView(record[viewKey])} />
                    )}
                    {showDownload && onDownload && (
                        <DownloadOutlined onClick={() => onDownload(record[downloadKey])} />
                    )}
                    {showDelete && onDelete && (
                        <DeleteOutlined 
                            onClick={() => {
                                
                                if (showModalConfirm) {
                                    showModalConfirm(onDelete, record[deleteKey]);
                                } else {
                                    onDelete(record[deleteKey]);
                                }
                            }} 
                            style={{color: "red"}}
                        />
                    )}
                </div>
                </div>
            )
        });
    }
    
    return actions;
}

// Función para generar columnas dinámicas
export function generateColumns(data, options = {}) {
    if (!data || data.length === 0) return [];

    const { 
        excludeProperties = [],
        changeNameKeys = {}, 
        customRenderers = {},
        actionColumns = null
    } = options;


    
    
    const firstObject = data[0];
    
    
    // Eliminar propiedades excluidas
    const cleanObject = { ...firstObject };
    deleteProperties(cleanObject, excludeProperties);

    
    const columns = [];
    
    // Generar columnas para cada propiedad
    for (const key in cleanObject) {
        let render = customRenderers[key] || createGenericRenderer(cleanObject, key);
        
        // Cambiar nombre de clave según lo indicado por el usuario
        let keyNew = changeNameKeys[key] || key
            
        const col = {
            title: String(keyNew).charAt(0).toUpperCase() + String(keyNew).slice(1).replace("_"," "),
            dataIndex: key,
            align: 'center',
            render: render
        };
        
        columns.push(col);
    }
      // Agregar columnas de acciones si se especifican
    if (actionColumns) {
        columns.push(...createActionColumns(actionColumns));
    }
    
    return columns;  
    
    
} 

// Función para generar columnas desde un objeto con titulo e index
export function generateColumnsPersonalizadas(column, options = {}) {
    if (!column || column.length === 0) return [];

    const { 
        customRenderers = {},        
        actionColumns = null
    } = options;

    
    const columns = [];
    
    // Generar columnas para cada propiedad
    for (const key in column) {
        let render = column[key].render || customRenderers[column[key].dataIndex] || createGenericRenderer(column[key].dataIndex,key);
        
        const col = {
            title: column[key].title,
            dataIndex: column[key].dataIndex,
            align: 'center',
            render: render
        };
        
        columns.push(col);
    }
      // Agregar columnas de acciones si se especifican
    if (actionColumns) {
        columns.push(...createActionColumns(actionColumns));
    }
    
    return columns;  
    
    
} 

//función para obtener el id desde el value o el label según corresponda.

export function getIdFromValueOrLabel(value, options) {
    console.log(value, options)
    // Si el value ya es un id (número), lo devolvemos
    if (typeof value === 'number') return value;
    // Si es string, buscamos el id correspondiente al label
    else {
        const found = options.find(opt => opt.label === value);
        console.log(found)
        return found ? found.value: value;
    }
    
}