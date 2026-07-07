import { forwardRef, useState,useImperativeHandle, useEffect  } from "react";
import { Button, Form, Select} from "antd";
//import { useForm} from "antd/es/form/Form";
import FormGeneralPanelLayout from "../layouts/FormGeneralPanelLayout";
import Modal from "antd/es/modal/Modal";
import { json } from "react-router-dom";
import { data } from "@remix-run/router";
import {getIdFromValueOrLabel} from "../utils/tableUtils";
import DetailCertificateInstrument from "./detail-certificate-instrument";

import API_URL from "../config/api";

const styleInput = {
    width: '100%'
}

const FormCreateCalibrationCertificated = forwardRef((props, ref) => {
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    //console.log(props)
    const {id_instrumento, handleUpdateInput, inputNewData} = props
    //console.log(id_instrumento)
    const [hitoSelected, setHitoSelected] = useState()
    const [loading, setLoading] = useState(false)
    const [dataFiltered, setDataFiltered] = useState()
    const [dataSelected, setDataSelected] = useState()
    const [optionsCalibration, setOptionsCalibration] = useState()
    const [optionsEstadoCertificado, setoptionsEstadoCertificado] = useState()
    const [detailCertificateModalVisible, setDetailCertificateModalVisible] = useState(false)
    const [modalConfirmVisible, setIsModalConfirmVisible] = useState(false)

    useEffect(()=>{
        fetch(`${API_URL}/certificado_estado`)
        .then(response => response.json())
        .then(data =>{
            const certificadoEstado = data.map(estado=>({
                value:estado.id_estado_calibr,
                label: estado.estado_calibr
            }))
            setoptionsEstadoCertificado(certificadoEstado)
        })
        .catch (error =>(console.log("Error en la solicitud", error)))
        .finally(()=>{
            setLoading(false)
        })

    },[])

    useEffect(()=>{
        fetch(`${API_URL}/instrumento/calibraciones/${id_instrumento}`)
        .then(res => res.json())
        .then(response=>{
            const dataRowFiltered = response.filter(
                item => item.fecha_ingreso == null
            )
            
            setDataFiltered(dataRowFiltered)
            return dataRowFiltered
        })
        .then(result =>{
            //console.log(result)
            const options = result.map(option=>({
                value: option.id_instru_calibr,
                label: `Id Hito: ${option.id_solic_calibr}`,
            }))
            setOptionsCalibration(options)
            
        })


    },[inputNewData])

    useEffect(()=>{
        if (dataFiltered) {
            const dataSelectedByHito = dataFiltered.find(e=>
                e.id_instru_calibr === hitoSelected
            )
            setDataSelected(dataSelectedByHito)
        } 
        
        

    }, [hitoSelected])
    
    useImperativeHandle(ref, () => ({

        resetFormFields: () => {
            form1.resetFields();
            setHitoSelected()
        },
        resetCertificadoFields:()=>{
            form2.resetFields();
        }
    }));

    const handleChange = (e)=>{
        if (e) {
            setHitoSelected(e)
        } 
        
    }

    const onFinishCertificado = async (values) =>{
        setLoading(true)
        console.log("values:",values)
        const {id_instrumento,...newValues} = values

        //Agregamos y normalizamos campos para el fetch
        newValues.empresa = dataSelected.empresa;
        newValues.id_instru_calibr = dataSelected.id_instru_calibr;
        newValues.id_tipo_instru = dataSelected.id_tipo;
        newValues.id_instrumento = dataSelected.id_instrumento;
        //newValues.id_estado_certif = getIdFromValueOrLabel(newValues.estado_certif, optionsEstadoCertificado);

        console.log("NewValues:", newValues)

        try {
            const createCertificado = await fetch(`${API_URL}/calibration/agregar_certificado/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValues),
            })
            
           
            if (createCertificado.ok){
                
                const updateSolicitud = await fetch(`${API_URL}/calibration/solicitud/${newValues.id_instru_calibr}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newValues),
                })
                console.log("updateSolicitud:", updateSolicitud)

                if (updateSolicitud.ok){
                    setIsModalConfirmVisible(true)
                    if(handleUpdateInput){
                        handleUpdateInput()
                    }
                    setDataSelected(newValues)
                    form1.resetFields();
                    form2.resetFields();
                }
                
                else {
                    Modal.error({
                        title: 'Error',
                        content: 'Error al ingresar el certificado de calibración',
                    });
                    }

            } if (!createCertificado.ok) {

                const errorData = await createCertificado.json();

                Modal.error({
                    title: 'Error',
                    content: errorData.message || 'Error al ingresar el certificado de calibración',
                });

                return;
            }

        } catch (error) {
            console.log("Error en la solicitud", error)
        } finally {
            console.log("Se termina de ejecutar")
            setLoading(false)
            
        }      
    }



    return (
        <div>
            <h1>Nueva Calibración</h1>
            <p>Registra una nueva calibración del instrumento</p>
            <Form 
                form={form1}
                name="form_item_path" 
                layout="vertical" 
                //onFinish={onFinishCertificado} 
                initialValues={{}}>
                    <Form.Item label="Hito de Calibración" name="id_hito_calibracion" 
                    
                    rules={[
                        {
                            required: true,
                            message: "Por favor seleccione un hito de calibración",
                        },
                    ]}>
                        <Select 
                        placeholder="Selecciona un hito de calibración"
                        onChange={handleChange}
                        style = { {width: "200px"} }
                        options={optionsCalibration} />
                    </Form.Item>
                    </Form>
                    {hitoSelected && (
                    <FormGeneralPanelLayout
                    form={form2}
                    loading={loading}
                    style={{
                        display: 'grid',
                        justifyContent: 'center',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        width: '100%',
                        gap: '25px',
                        padding: '0 0',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                    fields={
                         [
                            {
                                type:"input",
                                name:"empresa",
                                label:"Empresa",
                                initialValue: dataSelected?.empresa||"",
                                touchedFields:"touchedFields",
                                disabled:true,
                                placeholder:dataSelected?.empresa||"",
                            },
                            {
                                type:"date",
                                name:"fecha_ingreso",
                                label:"Fecha de ingreso de instrumento",
                                initialValue:null,
                                touchedFields:"touchedFields",
                                disabled:false,
                                rules:[{
                                    required:true,
                                    message:'Porfavor ingrese la fecha del ingreso del instrumento',
                                }]
                                //placeholder:"dataDetailInstrument.id"
                            },
                            {
                                type:"date",
                                name:"fecha_entrega",
                                label:"Fecha de entrega de instrumento",
                                initialValue:null,
                                touchedFields:"touchedFields",
                                disabled:false,
                                //placeholder:"dataDetailInstrument.id"
                            },
                            {
                                type:"input",
                                name:"n_certificado",
                                label:"Nº de Certificado",
                                initialValue:null,
                                touchedFields:"touchedFields",
                                disabled:false,
                                rules:[{
                                    required:true,
                                    message:'Porfavor ingrese el número de certificado',
                                }]
                                
                            },
                            {
                                type:"date",
                                name:"fecha_certif",
                                label:"Fecha de Certificado",
                                initialValue:null,
                                touchedFields:"touchedFields",
                                disabled:false,
                                rules:[{
                                    required:true,
                                    message:'Porfavor ingrese la fecha del certificado',
                                }]
                                //placeholder:"dataDetailInstrument.id"
                            },
                            {
                                type:"select",
                                name:"id_estado_certif",
                                label:"Estado Certificado",
                                initialValue:null,
                                touchedFields:"touchedFields",
                                options:optionsEstadoCertificado,
                                optionLabelProp:"label",
                                fieldNames:{
                                    label:"label",
                                    value:"value"
                                },
                                disabled:false,
                                rules:[{
                                    required:true,
                                    message:'Porfavor ingrese el estado del certificado',
                                }]
                                //placeholder:"dataDetailInstrument.id"
                            },
                            {
                                type:"input",
                                name:"responsable",
                                label:"Responsable Certificación",
                                initialValue:null,
                                touchedFields:"touchedFields",
                                disabled:false,
                                //placeholder:"dataDetailInstrument.id"
                            },
                            {
                                type:"input",
                                prefix:"$",
                                typeInput:"number",                                
                                name:"precio_calibr_instru",
                                label:"Costo",
                                initialValue:null,
                                touchedFields:"touchedFields",
                                disabled:false,
                                placeholder:"Ej.$450000"
                            }
                            
                        ]}
                    onFinish={onFinishCertificado}
                    //onValuesChange={"handleValuesChange"}
                />
                )}
               <Modal
                    open={modalConfirmVisible}
                    title="Datos guardados correctamente"
                    content="¿Quiéres agregar los detalles del certificado?"
                    onOk={()=>{setDetailCertificateModalVisible(true)
                            setIsModalConfirmVisible(false)}}
                    onCancel={()=>setIsModalConfirmVisible(false)}
                    footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <p>¿Quiéres agregar los detalles del certificado?</p>
                        <CancelBtn />
                        <OkBtn />
                    </>
                    )}
                >
                </Modal>
      
      <DetailCertificateInstrument
        isModalVisible={detailCertificateModalVisible}
        onCancel={() => setDetailCertificateModalVisible(false)}
        onSuccess={(certificateData) => {
          //console.log("[v0] Datos del certificado a guardar:", certificateData);
          // Aquí puedes hacer la lógica de guardado adicional si es necesaria
          // O simplemente cerrar el modal tras guardar exitosamente
          Modal.success({
            title: 'Éxito',
            content: 'Datos del certificado guardados correctamente',
            onOk: () => {setDetailCertificateModalVisible(false); setIsModalConfirmVisible(false)}
          });
        }}
        dataSelected={dataSelected}
        loading={loading}
      />      
        </div>
    )
})

export default FormCreateCalibrationCertificated;
