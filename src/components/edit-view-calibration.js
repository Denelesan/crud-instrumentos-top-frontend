import { Collapse, Button} from "antd"
import { useNavigate } from "react-router-dom"

const EditViewHitoCalibration = ()=>{
    const navigate = useNavigate();
    const {Panel}= Collapse


    return (
        <div style={{
            margin: '50px'
        }}>
            <h1>Edición de Hito de Calibración Nº</h1>
            

            <div style={{
            display: 'flex',
            flexDirection: 'Column',
            justifyContent: "center",
            marginTop: "20px"
            
        }}>
        <Collapse 
            accordion = {false}
            defaultActiveKey={['1','2','3']}
            
            >
            <Panel header="Información general" key="1">
                <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    marginTop: "20px"
                    
                }}>

                    <Button type="primary" style={{width: "10rem"}} htmlType="submit">Guardar</Button>
                </div>
            
            </Panel>
            <Panel header="Avances del hito de calibración" key="2">
            <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    marginTop: "20px"
                    
                }}>
                    <Button type="primary" style={{width: "auto"}} htmlType="submit">Agregar avances</Button>
                </div>
            </Panel>

            <Panel header="Instrumentos asociados" key="3">
            <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    marginTop: "20px"
                    
                }}>
                    <Button type="primary" style={{width: "auto"}} htmlType="submit">Guardar</Button>
                </div>
            </Panel>
            
            <Panel header="Fin del hito de calibración" key="4">
            <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    marginTop: "20px"
                    
                }}>
                    <Button type="primary" style={{width: "auto"}} htmlType="submit">Guardar</Button>
                </div>
            </Panel>
            
     </Collapse>
      <div style={{
            display: 'flex',
            justifyContent: "center",
            marginTop: "40px"
            
        }}>
      <Button type="primary" style={{width: "15rem"}} onClick={()=>navigate("/")}>Volver a la bandeja de entrada</Button>
     </div>
     </div>
        </div>


    )
}

export default EditViewHitoCalibration