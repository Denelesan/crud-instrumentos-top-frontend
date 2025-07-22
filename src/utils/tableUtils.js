import { Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleTwoTone } from '@ant-design/icons';
import dayjs from "dayjs";

// Función para eliminar propiedades de un objeto
export function deleteProperties(obj, properties) {
    properties.forEach(prop => {
        delete obj[prop];
    });
}

// Función para generar renderizador de estado con colores
export function createStatusRenderer() {
    return (valor) => {
        if (valor === null || valor === undefined) {
            return <span>No data</span>;
        }
        
        const color = valor === "Operativo" ? "#2ecc71" : valor === "Robado" ? "red" : "orange";
        return <Tag bordered={true} borderRadiusSM={20} color={color}>{valor}</Tag>;
    };
}

// Función para generar renderizador de fechas
export function createDateRenderer() {
    return (valor) => {
        if (valor === null || valor === undefined) {
            return <span>No data</span>;
        }
        
        if (typeof valor === 'string') {
            const isoDateMatch = valor.match(/^\d{4}-\d{2}-\d{2}/);
            if (isoDateMatch) {
                const date = dayjs(valor);
                if (date.isValid()) {
                    return <span>{date.format("D [de] MMMM [del] YYYY")}</span>;
                }
            }
        }
        
        return <span>{String(valor)}</span>;
    };
}

// Función para generar renderizador genérico
export function createGenericRenderer(firstObject, key) {
    return (valor) => {
        if (valor === null || valor === undefined) {
            return <span>No data</span>;
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
        
        return <span>{String(valor)}</span>;
    };
}

// Función para generar columnas de acciones básicas
export function createActionColumns({ 
    onEdit, 
    onView, 
    onDelete, 
    onAdd,
    showModalConfirm, // función para mostrar el modal, pasada desde el layout
    editKey = "id",
    viewKey = "id",
    deleteKey = "id",
    addKey = "Id Hito",
    showAdd = false,
    showEdit = true,
    showView = true,
    showDelete = true
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
    
    if (showEdit || showView || showDelete || (showAdd && onAdd)) {
        actions.push({
            title: "Action",
            render: (record) => (
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
                    {showDelete && onDelete && (
                        <DeleteOutlined 
                            onClick={() => {
                                if (showModalConfirm) {
                                    showModalConfirm(onDelete, record);
                                } else {
                                    onDelete(record[deleteKey]);
                                }
                            }} 
                            style={{color: "red"}}
                        />
                    )}
                </div>
            )
        });
    }
    
    return actions;
}

// Función para generar columnas dinámicas
export function generateColumns(data, options = {}) {
    if (!data || data.length === 0) return [];
    
    const firstObject = data[0];
    const { 
        excludeProperties = [], 
        customRenderers = {},
        actionColumns = null
    } = options;
    
    // Eliminar propiedades excluidas
    const cleanObject = { ...firstObject };
    deleteProperties(cleanObject, excludeProperties);
    
    const columns = [];
    
    // Generar columnas para cada propiedad
    for (const key in cleanObject) {
        let render = customRenderers[key] || createGenericRenderer(cleanObject, key);
        
        const col = {
            title: String(key).charAt(0).toUpperCase() + String(key).slice(1),
            dataIndex: key,
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