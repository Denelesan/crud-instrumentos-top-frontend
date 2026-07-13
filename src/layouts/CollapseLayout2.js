import {
    Collapse,
    Typography,
    Badge,
    Space,
    Card
} from "antd";

import {
    DownOutlined
} from "@ant-design/icons";

import PageLayout from "./PageLayout";


const { Panel } = Collapse;
const { Text } = Typography;

const CollapseLayout2 = ({
    titleBanner,
    subtitleBanner,
    subtitle,
    bannerActions,
    title,
    panels = [],
    defaultActiveKey = ['1'],
    accordion = false,
    showBackButton = true,
    backButtonText = "Volver",
    backButtonWidth = "10rem",
    onBackClick,
    margin = "40px"
}) => {

    return (

        <PageLayout
            titleBanner={titleBanner}
            subtitleBanner={subtitleBanner}
            subtitle={subtitle}
            title={title}
            bannerActions={bannerActions}
            showBackButton={showBackButton}
            backButtonText={backButtonText}
            backButtonWidth={backButtonWidth}
            onBackClick={onBackClick}
            margin={margin}
        >

            <Card
                bordered={false}
                style={{
                    borderRadius:16,
                    boxShadow:"0 4px 20px rgba(0,0,0,.05)"
                }}
            >

                <Collapse

                    accordion={accordion}
                    defaultActiveKey={defaultActiveKey}

                    bordered={false}

                    ghost

                    expandIcon={({isActive})=>(

                        <DownOutlined
                            rotate={isActive ? 180 : 0}
                            style={{
                                fontSize:14,
                                color:"#1677ff"
                            }}
                        />

                    )}

                >

                    {panels.map((panel,index)=>(

                        <Panel

                            key={String(index+1)}

                            style={{
                                marginBottom:18,
                                borderRadius:12,
                                background:"#fff",
                                border:"1px solid #f0f0f0"
                            }}

                            header={
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    {/* Izquierda */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 14,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 20,
                                                color: "#1677ff",
                                                marginTop: 2,
                                            }}
                                        >
                                            {panel.icon}
                                        </div>
                            
                                        <div>
                                            <Typography.Title
                                                level={5}
                                                style={{
                                                    margin: 0,
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                {panel.header}
                                            </Typography.Title>
                            
                                            {panel.description && (
                                                <Typography.Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {panel.description}
                                                </Typography.Text>
                                            )}
                                        </div>
                                    </div>
                            
                                    {/* Derecha */}
                                    <Space size={10}>
                                        {panel.lastUpdate && (
                                            <Typography.Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                }}
                                            >
                                                {panel.lastUpdate}
                                            </Typography.Text>
                                        )}
                            
                                        {panel.count !== undefined && (
                                            <Badge
                                                count={panel.count}
                                                color="#1677ff"
                                            />
                                        )}
                            
                                        {panel.extra}
                                    </Space>
                                </div>
                            }                  

                        >

                            <div

                                style={{

                                    paddingTop:20

                                }}

                            >

                                {panel.content}

                            </div>

                        </Panel>

                    ))}

                </Collapse>

            </Card>

        </PageLayout>

    )

}

export default CollapseLayout2;