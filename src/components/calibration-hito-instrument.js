import { useEffect, useState } from "react"
import { Button } from "antd"




const CalibrationHitoInstrument = ()=>{

    const [dataSource, setDataSource] = useState([])
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)


    useEffect(()=>{



    })


    return (
        <div>
            <div style={{
                textAlign: 'center',
                marginBottom:20
                }}>
                <Button onClick={()=>setIsFormModalOpen(true)} type='primary'>Agregar un Hito de Calibración</Button>
            </div>
        </div>
    )
}

export default CalibrationHitoInstrument