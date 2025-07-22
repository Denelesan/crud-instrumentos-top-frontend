import { Button, Modal, Table, Input } from "antd";
import { useState, useRef } from 'react';
import { SearchOutlined, PlusOutlined} from '@ant-design/icons';
import '../styles/tableLayout.css';

export function showModalConfirm(onDelete, record, deleteConfirmTitle = "¿Estás seguro que deseas eliminar este elemento?", deleteConfirmContent = "Esta acción no se puede deshacer") {
    Modal.confirm({
        title: deleteConfirmTitle,
        content: deleteConfirmContent,
        okText: 'Eliminar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
            onDelete(record);
        },
    });
}

const TableLayout = ({ 
    addButtonText = "Agregar elemento",
    columns = [],
    dataSource = [],
    onAdd,
    onDelete,
    deleteConfirmTitle = "¿Estás seguro que deseas eliminar este elemento?",
    deleteConfirmContent = "Esta acción no se puede deshacer",
    FormComponent,
    formProps = {},
    tableProps = {},
    showAddButton = true,
    customStyles = "",
    loading = false,
    searchValue = '',
    onSearchChange = null,
    searchPlaceholder = 'Buscar instrumento...'
}) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const formRef = useRef(null);

    const handleCancel = () => {
        setIsFormModalOpen(false);
        if (formRef.current && formRef.current.resetFormFields) {
            formRef.current.resetFormFields();
        }
    };

    // Resalta la fila de "Robado"
    const rowClassName = (record) => {
        if (record.estado && typeof record.estado === 'string' && record.estado.toLowerCase() === 'robado') {
            return 'robado-row';
        }
        return '';
    };

    return (
        <>
        <div className="table-layout-container">
            <div className="table-layout-header">
                {onSearchChange && (
                    <div className="table-layout-search">
                        <SearchOutlined style={{ marginRight: 8, color: '#b0b3c6' }} />
                        <Input
                            bordered={false}
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={onSearchChange}
                            style={{ background: 'transparent', fontSize: 16 }}
                        />
                    </div>
                )}
                {showAddButton && (
                    <Button 
                        className="table-layout-add-btn"
                        onClick={onAdd ? onAdd : () => setIsFormModalOpen(true)} 
                        type='primary'
                        loading={loading}
                    >
                        <PlusOutlined />{addButtonText}
                    </Button>
                )}
            </div>

            {FormComponent && (
                <Modal 
                    open={isFormModalOpen} 
                    onCancel={handleCancel} 
                    footer={null}
                >
                    <FormComponent 
                        ref={formRef} 
                        {...formProps}
                    />
                </Modal>
            )}

            <Table 
                size='small' 
                columns={columns} 
                dataSource={dataSource}
                bordered={false}
                loading={loading}
                rowClassName={rowClassName}
                pagination={{
                    position: ['bottomCenter'],
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} elementos`
                }}
                {...tableProps}
            />
        </div>
        {customStyles && <style>{customStyles}</style>}
        </>
    );
};

export default TableLayout; 