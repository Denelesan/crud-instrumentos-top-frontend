import { Collapse } from 'antd';
import PageLayout from './PageLayout';

const { Panel } = Collapse;

const CollapseLayout = ({ 
    titleBanner,
    subtitleBanner,
    subtitle,
    bannerActions = null, 
    title, 
    panels = [], 
    defaultActiveKey = ['1'],
    accordion = false,
    showBackButton = true,
    backButtonText = "Volver",
    backButtonWidth = "10rem",
    onBackClick,
    margin = '50px'
}) => {
    return (
        <PageLayout
            titleBanner={titleBanner}
            subtitleBanner={subtitleBanner}
            subtitle={subtitle}
            title={title}
            showBackButton={showBackButton}
            backButtonText={backButtonText}
            backButtonWidth={backButtonWidth}
            onBackClick={onBackClick}
            margin={margin}
        >
            <Collapse 
                accordion={accordion}
                defaultActiveKey={defaultActiveKey}
            >
                {panels.map((panel, index) => (
                    <Panel 
                        key={String(index + 1)} 
                        header={panel.header}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: "center",
                            marginTop: "20px"
                        }}>
                            {panel.content}
                        </div>
                    </Panel>
                ))}
            </Collapse>
        </PageLayout>
    );
};

export default CollapseLayout; 