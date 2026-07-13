import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const PageLayout = ({
    titleBanner,
    subtitleBanner,
    bannerActions = null, 
    title, 
    subtitle,
    children, 
    showBackButton = true, 
    backButtonText = "Volver",
    backButtonWidth = "10rem",
    onBackClick,
    margin = '50px'
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
        <div style={{ margin }}>
            <Title level={2}
            style={{
                //color:"#fff",
                display:'flex',
                justifyContent:'center',
                margin:0
            }}>{title}</Title>
            <div style={{
                display: 'flex',
                flexDirection: 'Column',
                justifyContent: "center",
                marginTop: "1px"
            }}>
            {/*<p style={
                {color:"grey"}
                }>
                {subtitle}
            </p>*/}
                {children}
                
                {showBackButton && (
                    <div style={{
                        display: 'flex',
                        justifyContent: "center",
                        marginTop: "20px"
                    }}>
                        <Button 
                            //type="primary" 
                            color='#1677ff'
                            style={{width: backButtonWidth, background:'#1677ff', color:"white"}} 
                            onClick={handleBack}
                        >
                            {backButtonText}
                        </Button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default PageLayout; 