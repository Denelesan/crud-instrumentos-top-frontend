import { Table, Tooltip } from "antd"
import { useEffect, useState } from "react"
import {DeleteTwoTone, EditOutlined, EyeOutlined, PlusCircleTwoTone} from '@ant-design/icons'



const CalibrationInstrumentAsociation = ({idHito}) =>{
    const [dataSource, setDataSource] = useState([])
    const [columns, setColumnsCalibrationInstrumentAsociation] = useState()
    

    useEffect(()=>{
        fetch(`http://localhost:5000/api/calibration/instrumentos/${idHito}`)
            .then(res=> res.json())
            .then(data=> {
                let cols = [{
                    title: 'Id',
                    dataIndex: 'id'
            
                },
                {
                    title: 'Serie',
                    dataIndex: 'serie'
                
                },
                {
                    title: 'Nombre',
                    dataIndex: 'instrumento'
                
                },
                {
                    title: 'Tipo',
                    dataIndex: 'tipo'
                
                },
                {
                    title: 'Marca',
                    dataIndex: 'marca'
                
                },
                {
                    title: 'Modelo',
                    dataIndex: 'modelo'
                
                }]
                console.log(cols)
                cols.push({
                    title: "Action",
                    render: (record)=>{
                      
                      return (<>
                      <div style={{
                        display:"flex",
                        justifyContent:"space-between",
                        width:"100%",
                        justifyContent: "center"}}>
                        <Tooltip title="Eliminar instrumento" >
                          <DeleteTwoTone twoToneColor="#eb2f96" onClick={()=>{
                            /*let idHito = record["Id Hito"]
                            console.log(idHito)
                            setHitoCalibrationSelected(idHito)
                            setIsAddInstrumentModalOpen(true)*/
                          }}/>
                        </Tooltip>
                      </div>
                      </>)
                    }
                  })
            setColumnsCalibrationInstrumentAsociation(cols)    
            setDataSource(data)
            })
            .catch(err=> console.log("Error al traer los datos", err))

    },[])

    return (
        <div>

            <Table columns={columns} dataSource={dataSource}/>
        </div>

    )
}


export default CalibrationInstrumentAsociation