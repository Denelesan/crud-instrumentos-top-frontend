import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PageLayout = ({
    titleBanner,
    subtitle,
    bannerActions = null, 
    title, 
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
                    <div className="table-layout-banner-title">{titleBanner}</div>
                    {subtitle && <div className="table-layout-banner-subtitle">{subtitle}</div>}
                </div>
                {bannerActions && (
                    <div className="table-layout-banner-actions">{bannerActions}</div>
                )}
            </div>
        </div>
        <div style={{ margin }}>
            <h1>{title}</h1>
            <div style={{
                display: 'flex',
                flexDirection: 'Column',
                justifyContent: "center",
                marginTop: "20px"
            }}>
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
        </div>
        </>
    );
};

export default PageLayout; 