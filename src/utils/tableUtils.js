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
        
        const color = valor === "Operativo" ||
        valor ==="Terminado" ||
        valor === "Finalizado" ? "#2ecc71" : valor === "Robado" || 
        valor ==="Cancelado" ? "red" : 
        valor === "De baja" ? "default" : "orange";
        return <Tag bordered={true} borderRadiusSM={20} variant='solid' color={color}>{valor}</Tag>;
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
    isDisableEdit = false,
    isDisableView = false,
    isDisableDownload = false
}) {
      
    const actions = [];
  
    const isDisabled = (condition, record) => {
        return typeof condition === "function"
            ? condition(record)
            : condition;
    };
    
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
                        <EditOutlined style={{color:isDisableEdit?'#bfbfbf':'#1890ff'}}  onClick={!isDisableEdit?() => onEdit(record[editKey]):null} />
                    )}
                    {showView && onView && (
                        <EyeOutlined style={{color:isDisabled(isDisableView, record)?'#bfbfbf':'#1890ff'}} onClick={!isDisabled(isDisableView, record)?() => onView(record[viewKey]):null} />
                    )}
                    {showDownload && onDownload && (
                        <DownloadOutlined style={{color:isDisabled(isDisableDownload, record)?'#bfbfbf':'#1890ff'}} onClick={!isDisabled(isDisableDownload, record)?() => onDownload(record[downloadKey]):null} />
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

export function timeAgo(date) {

    if (!date) return "Sin información";

    const fecha = new Date(date);
    const ahora = new Date();

    const diferencia = ahora - fecha;

    if (diferencia < 0) {
        return "próximamente";
    }

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const semanas = Math.floor(dias / 7);
    const meses = Math.floor(dias / 30);
    const años = Math.floor(dias / 365);

    if (segundos < 60) {
        return "hace unos segundos";
    }

    if (minutos < 60) {
        return `hace ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;
    }

    if (horas < 24) {
        return `hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
    }

    if (dias < 7) {
        return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
    }

    if (semanas < 5) {
        return `hace ${semanas} ${semanas === 1 ? "semana" : "semanas"}`;
    }

    if (meses < 12) {
        return `hace ${meses} ${meses === 1 ? "mes" : "meses"}`;
    }

    return `hace ${años} ${años === 1 ? "año" : "años"}`;
}