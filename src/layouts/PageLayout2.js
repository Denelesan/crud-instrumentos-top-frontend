import {
    Button,
    Breadcrumb,
    Card,
    Divider,
    Space,
    Typography,
    Tag
} from "antd";

import {
    HomeOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const PageLayout2 = ({
    titleBanner,
    subtitleBanner,
    bannerActions = null,

    title,
    subtitle,

    icon = null,

    status = null,

    breadcrumb = [],

    statistics = null,

    children,

    showBackButton = true,

    backButtonText = "Volver",

    backButtonWidth = "10rem",

    onBackClick,

    margin = "50px"
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate("/");
        }
    };

    return (
        <>
        {/* Banner superior */}
        <div className="table-layout-banner">
            <div className="table-layout-banner-content">
                <div>
                    <div className="table-layout-banner-title" onClick={()=>handleBack()}>{titleBanner}</div>
                    {subtitleBanner && <div className="table-layout-banner-subtitle" onClick={()=>handleBack()}>{subtitleBanner}</div>}
                </div>
                {bannerActions && (
                    <div className="table-layout-banner-actions">{bannerActions}</div>
                )}
            </div>
        </div>
        <div
                style={{
                    margin,
                    maxWidth:1400,
                    marginLeft:"auto",
                    marginRight:"auto"
                }}
            >

                {/* Breadcrumb */}

                <Breadcrumb
                    style={{
                        marginBottom:20
                    }}
                    items={[
                        {
                            title:<HomeOutlined/>
                        },

                        ...breadcrumb

                    ]}
                />

                {/* Header */}

                <Card

                    bordered={false}

                    style={{

                        borderRadius:18,

                        marginBottom:25,

                        boxShadow:"0 6px 18px rgba(0,0,0,.05)"

                    }}

                >

                    <Space
                        align="start"
                        style={{
                            width:"100%",
                            justifyContent:"space-between"
                        }}
                    >

                        <Space
                            align="start"
                            size={20}
                        >

                            {icon}

                            <div>

                                <Space>

                                    <Title
                                        level={2}
                                        style={{
                                            marginBottom:2
                                        }}
                                    >
                                        {title}
                                    </Title>

                                    {status &&
                                        <Tag color="green">
                                            {status}
                                        </Tag>
                                    }

                                </Space>

                                <Text
                                    type="secondary"
                                >
                                    {subtitle}
                                </Text>

                            </div>

                        </Space>

                    </Space>

                    {statistics &&
                    <>

                        <Divider/>

                        {statistics}

                    </>
                    }

                </Card>
                {children}
                
                {showBackButton && (
                    <div style={{
                        display: 'flex',
                        justifyContent: "center",
                        marginTop: "20px"
                    }}>
                        <Button 
                            type="primary" 
                            style={{width: backButtonWidth}} 
                            onClick={handleBack}
                        >
                            {backButtonText}
                        </Button>
                    </div>
                )}
            </div>
        
        </>
    );
};

export default PageLayout2; 