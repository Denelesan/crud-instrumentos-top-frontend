import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons";
import VerificacionCard from "../layouts/VerificacionCard";

const datos = [

    {
        id:1,
        tipo_verificacion:"Verificación Completa",
        fecha:"14/01/2024",
        responsable:"Juan Pérez",
        estado_fisico:"Excelente",
        estado_operativo:"Funcional",
        estado_digital:"Actualizado",
        observaciones:"Instrumento en perfecto estado.",
        documentos:3
    },

    {
        id:2,
        tipo_verificacion:"Verificación Rutinaria",
        fecha:"19/08/2023",
        responsable:"María González",
        estado_fisico:"Bueno",
        estado_operativo:"Funcional",
        estado_digital:"Pendiente",
        observaciones:"Requiere actualización de firmware.",
        documentos:1
    }

];

const EditViewInstrumentVerificacion = ({id}) => {

    return (

        <div 
            style={{
                width:'90%',
                          
            }}       
        >
     <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            htmlType="submit"
        >
            Agregar Datos de Verificación
        </Button>
    </div>
       
            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between",                    
                    alignItems:"center",
                    marginBottom:30
                }}
            >                         
                

            </div>

            {

                datos.map(item=>(

                    <VerificacionCard
                        key={item.id}
                        item={item}
                    />

                ))

            }

        </div>

    );

};

export default EditViewInstrumentVerificacion;


