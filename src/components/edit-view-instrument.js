import { Button, Collapse, Form, Input, Select } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom"

const {Panel}= Collapse


const EditViewInstrument = ()=>{
    const {id} = useParams()
    const navigate = useNavigate()
    const [dataDetailInstrument, setDataDetailInstrument] = useState()
    const [form] = useForm()
    const [tipos, setTipos]= useState([])
    const [marcas, setMarcas] = useState([])
    const [modelos, setModelos]= useState([])

    useEffect(()=>{
        fetch(`http://localhost:5000/api/instrumentos/${id}`)
        .then(resp=>resp.json())
        .then(data => setDataDetailInstrument(data))
        .catch(error=> console.log("Error al traer la data", error))

    }, [id])

    // Solicitar tipos de instrumentos
    useEffect(()=>{
        fetch('http://localhost:5000/api/instrumentos/tipo')
        .then(response => response.json())
        .then(data=>{
            
            const optionsTipos = data.map(tipo=>({
                value: tipo.id_tipo,
                label: tipo.tipo,
            }))
            setTipos(optionsTipos)
        }).
        catch(error=>console.error("Error al obtener dato de tipo", error))
    }, [])

     // Solicitar marcas de instrumentos
     useEffect(()=>{
        fetch('http://localhost:5000/api/instrumentos/marca')
        .then(response => response.json())
        .then(data=>{
            const optionsMarcas = data.map(marca=>({
                value: marca.id_marca,
                label: marca.marca,
            }))
            setMarcas(optionsMarcas)
        }).
        catch(error=>console.error("Error al obtener dato de marca", error))
    }, [])

     // Solicitar modelos de instrumentos
     useEffect(()=>{
        fetch('http://localhost:5000/api/instrumentos/modelo')
        .then(response => response.json())
        .then(data=>{
            const optionsModelos = data.map(modelo=>({
                value: modelo.id_modelo,
                label: modelo.modelo,
            }))
            setModelos(optionsModelos)
        }).
        catch(error=>console.error("Error al obtener dato de marca", error))
    }, [])
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
                   
                    <Select
                        style={{width:"200px"}}
                        options={tipos}
                        />
                </Form.Item>
                <Form.Item 
                    label="Materialidad"
                    name="materialidad" 
                    initialValue={dataDetailInstrument.materialidad}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Marca de Instrumento"
                    name="marca" 
                    initialValue={dataDetailInstrument.marca}
                >
                    <Select
                        style={{width:"200px"}}
                        options={marcas}
                        />
                </Form.Item> 
                <Form.Item 
                    label="Cargo"
                    name="cargo" 
                    initialValue={dataDetailInstrument.cargo}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Sección"
                    name="seccion" 
                    initialValue={dataDetailInstrument.seccion}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Ubicación"
                    name="ubicacion" 
                    initialValue={dataDetailInstrument.ubicacion}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Estado"
                    name="estado" 
                    initialValue={dataDetailInstrument.estado}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                </div>
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

            <Panel header="Verificaciones" key="2">
            <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    marginTop: "20px"
                    
                }}>
                    <Button type="primary" style={{width: "auto"}} htmlType="submit">Agregar Datos de Verificación</Button>
                </div>
            </Panel>
            
            <Panel header="Calibraciones" key="3">
            <div style={{
                    display: 'flex',
                    justifyContent: "center",
                    marginTop: "20px"
                    
                }}>
                    <Button type="primary" style={{width: "auto"}} htmlType="submit">Agregar Datos de Calibración</Button>
                </div>
            </Panel>
            
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