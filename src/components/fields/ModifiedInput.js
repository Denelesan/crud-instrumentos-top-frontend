import { Form, Input } from 'antd';

const ModifiedInput = ({ 
    name, 
    label, 
    initialValue, 
    touchedFields, 
    style = { width: 'auto' },
    disabled = false,
    placeholder,
    ...rest 
}) => {
    return (
        <Form.Item
            label={label}
            name={name}
            initialValue={initialValue}
            className={touchedFields[name] ? "modified-select" : ""}
        >
            <Input 
                style={style}
                disabled={disabled}
                placeholder={placeholder}
                {...rest} 
            />
        </Form.Item>
    );
};

export default ModifiedInput; 