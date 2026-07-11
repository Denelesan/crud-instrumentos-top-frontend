import { Tabs } from 'antd';
import PageLayout from './PageLayout';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';

const TabLayout = ({ 
    titleBanner,
    subtitleBanner,
    bannerActions = null, 
    title, 
    tabs = [], 
    defaultActiveKey = '1',
    type = 'card',
    icon,
    showBackButton = false,
    margin = '30px'
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
                icon= <AppleOutlined/>
                defaultActiveKey={defaultActiveKey}
                items={tabItems}
                size='small'
            />
        </PageLayout>
    );
};

export default TabLayout; 