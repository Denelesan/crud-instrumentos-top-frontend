import { Tabs } from 'antd';
import PageLayout from './PageLayout';

const TabLayout = ({ 
    titleBanner,
    subtitleBanner,
    bannerActions = null, 
    title, 
    tabs = [], 
    defaultActiveKey = '1',
    type = 'card',
    showBackButton = false,
    margin = '10px'
}) => {
    const tabItems = tabs.map(tab => ({
        label: tab.label,
        key: tab.key,
        children: tab.children
    }));

    return (
        <PageLayout
            titleBanner={titleBanner}
            subtitleBanner={subtitleBanner}
            bannerActions = {bannerActions}
            title={title}
            showBackButton={showBackButton}
            margin={margin}
        >
            <Tabs
                type={type}
                defaultActiveKey={defaultActiveKey}
                items={tabItems}
            />
        </PageLayout>
    );
};

export default TabLayout; 