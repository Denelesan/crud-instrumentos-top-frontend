import { Form, Input } from 'antd';

const { TextArea } = Input;

const ModifiedTextArea = ({ 
    name, 
    label, 
    initialValue, 
    touchedFields,
    rules, 
    //style = {width:"200px"},
    disabled = false,
    placeholder,
    typeInput,
    row = 6,
    fullWidth= true,
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
            <TextArea 
                //style={style}
                type={typeInput}
                row={row}
                fullWidth={fullWidth}
                maxLength={1000}
                disabled={disabled}
                placeholder={placeholder}
                {...rest} 
            />
        </Form.Item>
    );
};

export default ModifiedTextArea; 