import { Form, DatePicker } from 'antd';


const ModifiedDate = ({ 
    name, 
    label, 
    initialValue, 
    touchedFields, 
    //options = [],
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
        >
            <DatePicker
                style={style}
                //options={options}
                disabled={disabled}
                onChange={onChange}
                className={touchedFields[name] ? "modified-date" : ""}
                {...rest}
            />
        </Form.Item>
    );
};

export default ModifiedDate; 
