import { Form, Select } from 'antd';

const ModifiedSelect = ({ 
    name, 
    label, 
    initialValue, 
    rules,
    touchedFields, 
    options = [],
    style = { width: "200px" },
    disabled = false,
    onChange,
    ...rest 
}) => {
    return (
        <Form.Item
            label={label}
            name={name}
            initialValue={initialValue}
            rules={rules}
        >
            <Select
                style={style}
                options={options}
                disabled={disabled}
                onChange={onChange}
                className={touchedFields[name] ? "modified-select" : ""}
                {...rest}
            />
        </Form.Item>
    );
};

export default ModifiedSelect; 
