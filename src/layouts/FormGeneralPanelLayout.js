import { Button, Form, Badge } from "antd"
import { useForm } from "antd/es/form/Form"
import { ModifiedInput, ModifiedSelect, ModifiedDate} from "../components/fields"



const FormGeneralPanelLayout = ({
    name = "form_item_path",
    layout = "vertical",
    style = {
        display: 'grid',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        width: '100%',
        gap: '25px',
        padding: '0 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    loading,
    fields,
    onFinish,
    onValuesChange,
    touchedFields = {},
    form: formProp

}) => {
    const [formInternal] = useForm();
    const form = formProp || formInternal;  // Usa el prop si existe
    //const [form] = useForm()
    

    return (
        <div style={{
            width: "100%"
        }}>
        <Form
            form={form}
            name={name}
            layout={layout}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            touchedFields={touchedFields}
        >
            <div style={style}>
                {fields.map((field, index) => {
                    if (field.type === "input") {
                        return <ModifiedInput key={index} {...field} />;
                    }
                    if (field.type === "select") {
                        return <ModifiedSelect key={index} {...field} />;
                    }
                    if (field.type === "date") {
                        return <ModifiedDate key={index} {...field} />;
                    }
                    return null; // por si aparece un tipo desconocido
                    })}
            </div>
            <div style={{
                display: 'flex',
                justifyContent: "center",
                marginTop: "20px"
            }}>
                <Badge
                    count={
                        
                        //fileList.length
                        Object.keys(touchedFields).length
                        //-fileList.length
                        ? 
                        //fileList.length 
                        Object.keys(touchedFields).length
                        //-fileList.length
                        : null 
                        //changeAddInstrument.length + changeDeleteInstrument.length ? changeAddInstrument.length + changeDeleteInstrument.length : null
                    }
                >
                    <Button type="primary" style={{width: "10rem"}} loading={loading} htmlType="submit">Guardar</Button>
                    </Badge>

                
            </div>
        </Form>
        </div>
    )
}


export default FormGeneralPanelLayout;