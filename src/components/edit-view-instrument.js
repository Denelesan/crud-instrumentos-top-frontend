import { Button, Collapse, Form, Input } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"

const {Panel}= Collapse


const EditViewInstrument = ()=>{
    const {id} = useParams()
    const navigate = useNavigate()
    const [dataDetailInstrument, setDataDetailInstrument] = useState()
    const [form] = useForm()
    useEffect(()=>{
        fetch(`http://localhost:5000/api/instrumentos/${id}`)
        .then(resp=>resp.json())
        .then(data => setDataDetailInstrument(data))
        .catch(error=> console.log("Error al traer la data", error))

    }, [id])
    console.log(dataDetailInstrument)
    const styleInput = {
        width: 'auto'
    }
    return (
        <div style={{
            margin: '50px'
        }}>
            <h1>Edición de Instrumento Topográfico</h1>
            

            <div style={{
            display: 'flex',
            flexDirection: 'Column',
            justifyContent: "center",
            marginTop: "20px"
            
        }}>
        <Collapse 
            accordion
            defaultActiveKey={['1']}
            >
            <Panel header="Información General" key="1">
            {dataDetailInstrument ? (
            <Form 
                form={form}
                name="form_item_path" 
                layout="vertical"
                onFinish={()=>console.log()}
                
                //disabled= "false"
                >
                <div style={{ 
                    display: 'grid', 
                    //flexWrap: 'wrap', 
                    justifyContent: 'center',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    width: 'auto',
                    gap: '25px', 
                    marginLeft: '5em',
                    //marginRight: '5em'
                  }}>
                <Form.Item 
                    label="Id de Instrumento"
                    name="id" 
                >
                    <Input disabled= "false" placeholder={dataDetailInstrument.id} style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Nombre de Instrumento"
                    name="instrumento" 
                    initialValue={dataDetailInstrument.instrumento}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Tipo de Instrumento"
                    name="tipo" 
                    initialValue={dataDetailInstrument.tipo}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Tipo de Instrumento"
                    name="tipo" 
                    initialValue={dataDetailInstrument.tipo}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Tipo de Instrumento"
                    name="tipo" 
                    initialValue={dataDetailInstrument.tipo}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Tipo de Instrumento"
                    name="tipo" 
                    initialValue={dataDetailInstrument.tipo}
                >
                    <Input style={styleInput}/>
                </Form.Item> </div>
                <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    marginTop: "20px"
                    
                }}>
                    <Button type="primary" style={{width: "10rem"}} htmlType="submit">Guardar</Button>
                </div>
                
                
                </Form>) : 
                <p>Cargando detalles...</p>}
            </Panel>

            <Panel header="Detalles Técnicos" key="2">
            {/* Detalles técnicos */}
            </Panel>
            {/* Más paneles */}
     </Collapse>
      <div style={{
            display: 'flex',
            justifyContent: "center",
            marginTop: "20px"
            
        }}>
      <Button type="primary" style={{width: "10rem"}} onClick={()=>navigate("/")}>Volver</Button>
     </div>
     </div>
        </div>


    )
}


export default EditViewInstrument