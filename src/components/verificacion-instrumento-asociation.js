import { Table, Tooltip, Button, Modal, message, Alert, Badge } from "antd"
import { useEffect, useState } from "react"
import {DeleteTwoTone, EditOutlined, EyeOutlined, PlusCircleTwoTone} from '@ant-design/icons'
import AddInstrumentToHitoVerificacionFromEditView from "./add-instrumento-hito-verificacion-from-edit-view";
import API_URL from "../config/api";


const VerificacionInstrumentAsociation = ({idHito,changeDeleteInstrument, setChangeDeleteInstrument,changeAddInstrument, setChangeAddInstrument,onLogUpdate}) =>{
    const [dataSource, setDataSource] = useState([])
    const [dataSourceTemporal, setDataSourceTemporal] = useState([])
    const [isAddInstrumentModalOpen, setIsAddInstrumentModalOpen] = useState(false)
    const [updateFetch, setUpdateFetch] = useState(false)
    //const [changeDeleteInstrument, setChangeDeleteInstrument] = useState([]);
    //const [changeAddInstrument, setChangeAddInstrument] = useState([]);

    const handleCancel = ()=>{
        setIsAddInstrumentModalOpen(false)
        //setUpdateFetch(true)
        
        
      }
    
    const columns = [{
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
    
    },
    {
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
                let idInstrumento = record["id"]
                console.log(idInstrumento)
                eliminarInstrumentoTemporalmente(idInstrumento)
                /*
                setHitoCalibrationSelected(idHito)
                setIsAddInstrumentModalOpen(true)*/
              }}/>
            </Tooltip>
          </div>
          </>)
        }
    }]

    useEffect(()=>{
        fetch(`${API_URL}/verificacion/instrumentos/${idHito}`)
            .then(res=> res.json())
            .then(data=> {  
                //console.log("...Cargando Data")
            setDataSource(data)
            setDataSourceTemporal(data)
            setUpdateFetch(false)
            })
            .catch(err=> console.log("Error al traer los datos", err))

    },[idHito, updateFetch])

    const showModalConfirm = (guardar)=>{
        Modal.confirm({
          title: '¿Estás seguro que deseas guardar los cambios realizados?',
          content: 'Esta acción no se puede deshacer',
          okText: 'Guardar',
          okType: 'primary',
          cancelText: 'Cancelar',
          onOk() {
            guardar();
          },
        })
      }

    useEffect(()=>{
            const deletedInstruments = dataSource.filter(inst=>
            !dataSourceTemporal.some(tempInst => tempInst.id ===inst.id))

            const addedInstruments = dataSourceTemporal.filter(inst=>
            !dataSource.some(tempInst => tempInst.id ===inst.id))

            setChangeDeleteInstrument(deletedInstruments);
            setChangeAddInstrument(addedInstruments);

    },[dataSource,dataSourceTemporal])

    const guardarCambios = async ()=>{
        const instrumentosEliminados = dataSource.filter(inst=>
            !dataSourceTemporal.some(tempInst => tempInst.id ===inst.id)
        ).map(inst=>inst.id)
        console.log("Instrumentos eliminados:", instrumentosEliminados); // Depuración
        if (changeDeleteInstrument.length>0 || changeAddInstrument.length > 0 ){
            try{
                if (changeDeleteInstrument.length>0){
                await fetch(`${API_URL}/verificacion/instrumentasociate/delete/${idHito}`,{
                    method:'DELETE',
                    headers:{ "Content-Type": "application/json" },
                    body:JSON.stringify( { instrumentosAEliminar: instrumentosEliminados })
                })}

                if (changeAddInstrument.length > 0){
                    await Promise.all(
                        changeAddInstrument.map(async(instrument)=>{
                            return fetch(`${API_URL}/verificaciones/addInstrument`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(instrument),
        
                        })
                        })
                    )

                }


                //const result = await response.json()
                //console.log(result.message)
                if(onLogUpdate){
                    onLogUpdate()
                }
                message.success(`Los cambios se guardaron con éxito`);
                //setDataSourceTemporal(dataSourceTemporal)
                //setDataSource(dataSourceTemporal)
                setUpdateFetch(true)
                
            }
            catch (error){
                console.log("Error al guardar cambios", error)
            }
        }else{
            message.info(`No hay cambios para guardar`);
            //console.log({message:"No hay instrumentos para guardar"})
        }

    }

    const cancelarCambios = ()=>{
        setDataSourceTemporal(dataSource)
    }

    const eliminarInstrumentoTemporalmente = (id)=>{
        setDataSourceTemporal(prev=>prev.filter((inst=>inst.id !==id)))

    }
    return (
        <div >
            <div style={{
                display: "flex",
                justifyContent: "center",
                width: "auto"}}>
 
            <Button type="primary" style={{
                marginBottom: "20px",
                width: "auto",
                background:'#0b3d63'}} htmlType="submit" onClick={()=>setIsAddInstrumentModalOpen(true)}>Agregar Instrumento</Button>
            </div>
            <Modal width={600} open={isAddInstrumentModalOpen} onCancel={handleCancel} footer={null}>
                <AddInstrumentToHitoVerificacionFromEditView hitoSelected={idHito} dataSourceOriginal={dataSource} dataTemporal={dataSourceTemporal} setDataSourceTemporal={setDataSourceTemporal}/>
            </Modal>
            <Table columns={columns} dataSource={dataSourceTemporal}/>
            <div style={{
            display: 'flex',
            //flexDirection: 'Column',
            justifyContent: "space-evenly",
            marginTop: "10px",
            width:"auto"
            
        }}>
                <Button type="primary" danger style={{width: "auto"}} htmlType="submit" onClick={()=>cancelarCambios()}>Cancelar Cambios</Button>
                <Badge
                    count={
                        changeAddInstrument.length + changeDeleteInstrument.length ? changeAddInstrument.length + changeDeleteInstrument.length : null
                    }
                >
                <Button type="primary" style={{width: "auto", background:'#0b3d63'}} htmlType="submit" onClick={()=>showModalConfirm(guardarCambios)}>Guardar Cambios</Button>
                </Badge>
                
            </div>
            
        </div>

    )
}


export default VerificacionInstrumentAsociation