import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    Row,
    Space,
    Typography
} from "antd";

import { SaveOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

import {
    ModifiedInput,
    ModifiedSelect,
    ModifiedDate
} from "../components/fields";

const { Title, Text } = Typography;

const FormGeneralPanelLayout2 = ({

    name = "form_item_path",
    loading = false,

    sections = [],

    onFinish,
    onValuesChange,

    touchedFields = {},

    form: formProp

})=>{

    const [formInternal] = useForm();

    const form = formProp || formInternal;

    const renderField = (field,index)=>{

        switch(field.type){

            case "input":
                return <ModifiedInput key={index} {...field}/>

            case "select":
                return <ModifiedSelect key={index} {...field}/>

            case "date":
                return <ModifiedDate key={index} {...field}/>

            default:
                return null;

        }

    }

    return(

        <Form

            form={form}
            name={name}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}

        >

            <Space
                direction="vertical"
                size={28}
                style={{
                    width:"100%"
                }}
            >

                {sections.map((section,index)=>(

                    <Card

                        key={index}

                        bordered

                        style={{

                            borderRadius:14

                        }}

                        title={

                            <div>

                                <Space align="center">

                                    {section.icon}

                                    <Title
                                        level={4}
                                        style={{
                                            margin:0
                                        }}
                                    >
                                        {section.title}
                                    </Title>

                                </Space>

                                {section.subtitle && (

                                    <Text
                                        type="secondary"
                                    >

                                        {section.subtitle}

                                    </Text>

                                )}

                            </div>

                        }

                    >

                        <Row
                            gutter={[24,16]}
                        >

                            {section.fields.map((field,index)=>(

                                <Col

                                    key={index}

                                    xs={24}

                                    md={field.md || 12}

                                    lg={field.lg || 12}

                                >

                                    {renderField(field,index)}

                                </Col>

                            ))}

                        </Row>

                    </Card>

                ))}

            </Space>

            <div

                style={{

                    display:"flex",

                    justifyContent:"space-between",

                    alignItems:"center",

                    marginTop:35

                }}

            >

                <Text type="secondary">

                    {

                        Object.keys(touchedFields).length===0 ?

                        "No existen cambios pendientes"

                        :

                        `${Object.keys(touchedFields).length} cambio(s) pendiente(s)`

                    }

                </Text>

                <Space>

                    <Button>

                        Cancelar

                    </Button>

                    <Badge

                        count={

                            Object.keys(touchedFields).length || null

                        }

                    >

                        <Button

                            icon={<SaveOutlined/>}

                            type="primary"

                            loading={loading}

                            htmlType="submit"

                            size="large"

                        >

                            Guardar cambios

                        </Button>

                    </Badge>

                </Space>

            </div>

        </Form>

    )

}

export default FormGeneralPanelLayout2;