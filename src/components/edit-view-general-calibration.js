import { Button, Collapse, DatePicker, Form, Input, Select } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import dayjs from "dayjs"


const EditGeneralViewCalibration = ({idHito})=>{
    const [dataHitoCalibration, setDataHitoCalibration] = useState()
    const [form] = useForm()
    const [empresas, setEmpresas]= useState()

    useEffect(()=>{
            fetch(`http://localhost:5000/api/calibration/${idHito}`)
            .then(resp=>resp.json())
            .then(data => setDataHitoCalibration(data[0]))
            .catch(error=> console.log("Error al traer la data", error))
        }, [idHito])

    useEffect(()=>{
            fetch('http://localhost:5000/api/calibration_empresas')
            .then(response => response.json())
            .then(data=>{
                console.log("data", data)
                const optionsEmpresas = data.map(empresa=>({
                    value: empresa.id_empresa,
                    label: empresa.empresa
                }))
                console.log(optionsEmpresas)
                setEmpresas(optionsEmpresas)
            }).catch(error=> console.error("Error al obtener las empresas calibradoras", error))
        },[])

        console.log(dataHitoCalibration)
        const styleInput = {
            width: 'auto'
        }
    return (
        <div style={{
            width: "100%"
        }}>
            
            {dataHitoCalibration ? (
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    //gridTemplateColumns: '1fr 1fr 1fr',
                    width: '80%',
                    gap: '25px', 
                    margin: '0 auto'
                    //marginLeft: '5em',
                    //marginRight: '5em'
                  }}>
                <Form.Item 
                    label="Id Hito"
                    name="IdHito" 
                >
                    <Input disabled= "false" placeholder={dataHitoCalibration["Id Hito"]} style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Fecha de Solicitud"
                    name="fecha_solicitud" 
                    initialValue={dataHitoCalibration["Fecha Solicitud"]?dayjs(dataHitoCalibration["Fecha Solicitud"], "YYYY-MM-DD"):""}
                >
                    <DatePicker disabled={!dayjs(dataHitoCalibration["Fecha Solicitud"]).isValid()} style={styleInput}/>
                    
                </Form.Item>
                <Form.Item 
                    label="Estado"
                    name="estado" 
                    initialValue={dataHitoCalibration["Estado Hito"]}
                >
                   
                    <Select
                        disabled="true"
                        style={{width:"200px"}}
                        options={""}
                        />
                </Form.Item>
                <Form.Item 
                    label="Nº Orden de Compra"
                    name="orden_de_compra" 
                    initialValue={dataHitoCalibration["Orden de Compra"]}
                >
                    <Input style={styleInput}/>
                </Form.Item>
                <Form.Item 
                    label="Precio"
                    name="precio" 
                    initialValue={Math.round(dataHitoCalibration["Precio Orden de Compra"],9)}
                >
                    <Input prefix="$" suffix="CLP" style={styleInput}/>
                </Form.Item> 
                <Form.Item 
                    label="Empresa"
                    name="empresa" 
                    initialValue={dataHitoCalibration.empresa}
                >
                    <Select 
                    style={{width:'200px'}}
                    options={empresas}/>
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

        </div>
    )
}

export default EditGeneralViewCalibration