import {CheckCircleFilled, CheckCircleTwoTone,CloseCircleTwoTone} from "@ant-design/icons/"
import { Button, Card, Collapse, Tabs, Descriptions } from "antd"
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"




const DetailViewInstrument = ()=>{
    const {id} = useParams()
    const navigate = useNavigate()
    const { Panel } = Collapse;
    const { TabPane } = Tabs;
    const [instrumentDetail, setInstrumentDetail] = useState(null)
    useEffect(()=>{
        fetch(`http://localhost:5000/api/instrumentos/${id}`)
        .then(resp=>resp.json())
        .then(data=> setInstrumentDetail(data))
        .catch(error=> console.log("Error en la solicitud", error))

    },[id])
    console.log(instrumentDetail)
    const fontSizeEstado = "25px"
    return (
        <div style={{
          margin: '50px'
        }}>
          <h1>Ficha de Instrumento Topográfico</h1>

        {instrumentDetail ?(
        <div>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px'  }}>
    <Card title="Detalles del Instrumento" style={{ width:"100vw" }}>
      <div style={{
          margin: '10px'
        }}>
      
        <div style={{
          display: "flex",
          justifyContent: "flex-end"
        }}>
        <p>
          <b>Estado: </b>{
          instrumentDetail.estado === "Operativo" ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" 
        style={{ 
          fontSize:fontSizeEstado 
          }}/>):
          <CloseCircleTwoTone twoToneColor="red" 
          style={{ 
            fontSize:fontSizeEstado,
            
            }}/>}</p>
          
        </div>
        <div style={{ 
          display: 'grid', 
          //flexWrap: 'wrap', 
          justifyContent: 'center',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: 'auto',
          gap: '25px', 
        }}>
          <p><b>Id: </b> {instrumentDetail.id}</p>
          <p><b>Nombre: </b> {instrumentDetail.instrumento}</p>
          <p><b>Tipo: </b> {instrumentDetail.tipo}</p>
          <p><b>Nº de serie: </b> {instrumentDetail.serie}</p>
          <p><b>Marca: </b> {instrumentDetail.marca}</p>
          <p><b>Modelo: </b> {instrumentDetail.modelo}</p>
          <p><b>Cargo: </b> {instrumentDetail.cargo}</p>
          <p><b>Sección/Departamento: </b> {instrumentDetail.seccion}</p>
        </div>
      </div>
    </Card>
    <Card title="Historial de Verificación" style={{ width: "100vw" }}>
      {/* Más contenido */}
    </Card>
    <Card title="Historial de Calibración" style={{ width: "100vw" }}>
      {/* Más contenido */}
    </Card>
    <Card title="Observaciones" style={{ width: "100vw" }}>
    { instrumentDetail.obs_estado ?(
      <ul>
        <li>
        {instrumentDetail.obs_estado}
      </li>
      </ul>):
      <p>Sin Observaciones</p>

     } 
    </Card>
    <Card title="Tareas Asociadas" style={{ width: "100vw" }}>
      {/* Más contenido */}
    </Card>
  </div>
     <div style={{
            display: 'flex',
            justifyContent: "flex-end",
            marginTop: "20px"
            
        }}>
      <Button type="primary" onClick={()=>navigate("/")}>Volver</Button>
     </div>
            
            

        </div>):(
        <p>Cargando detalles...</p>
      )}
        </div>
    )

}

export default DetailViewInstrument