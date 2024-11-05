import { Button } from "antd"
import { useParams,useNavigate } from "react-router-dom"




const EditViewInstrument = ()=>{
    const {id} = useParams()
    const navigate = useNavigate()

    return (
        <div style={{
            margin: '50px'
        }}>
            <h1>Edición de Instrumento Topográfico</h1>
            

        <div style={{
            display: 'flex',
            justifyContent: "flex-end",
            marginTop: "20px"
            
        }}>
            <Button type="primary" onClick={()=>navigate("/")}>Volver</Button>
        </div>
        </div>


    )
}


export default EditViewInstrument