import { Form, Input } from 'antd';

const ModifiedInput = ({ 
    name, 
    label, 
    initialValue, 
    touchedFields,
    rules, 
    style = {width:"200px"},
    disabled = false,
    placeholder,
    typeInput,
    ...rest 
}) => {
    return (
        <Form.Item
            label={label}
            name={name}
            initialValue={initialValue}
            className={touchedFields[name] ? "modified-select" : ""}
            rules={rules}
        >
            <Input 
                style={style}
                type={typeInput}
                disabled={disabled}
                placeholder={placeholder}
                {...rest} 
            />
        </Form.Item>
    );
};

export default ModifiedInput; 