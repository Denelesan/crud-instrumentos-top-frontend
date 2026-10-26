import { Button, Modal, Table, Input, Badge } from "antd";
import { useState, useRef } from 'react';
import { SearchOutlined, PlusOutlined} from '@ant-design/icons';
import '../styles/tableLayout.css';

/* Estilos para la tabla
const tableStyles = `
    .table-instrument .ant-table {
        background: transparent;
    }
    .table-instrument .ant-table-thead > tr > th {
        background: #f5f5f5;
        border-bottom: 2px solid rgb(255, 254, 254);
    }
    .table-instrument .ant-table-tbody > tr > td {
        border-bottom: 1px solid rgb(255, 254, 254);
    }
    .table-instrument .ant-table-tbody > tr:hover > td {
        background: #fafafa;
        border-color: #fafafa;
    }
    .table-instrument .ant-table-cell {
        padding: 12px 16px;
    }
`;*/

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
    fontSizeButton = '', //16px
    heightButton = '', //40px
    paddingButton = '', //0 20px
    pendientes,
    columns = [],
    dataSource = [],
    onAdd,
    onDelete,
    deleteConfirmTitle = "¿Estás seguro que deseas eliminar este elemento?",
    deleteConfirmContent = "Esta acción no se puede deshacer",
    FormComponent,
    formProps = {},
    widthModal = 520,
    tableProps = {},
    showAddButton = true,
    customStyles = '',
    loading = false,
    searchValue = '',
    onSearchChange = null,
    searchPlaceholder = 'Buscar instrumento...'
}) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const formRef = useRef(null);

    const handleCancel = () => {
        setIsFormModalOpen(false);
        if (formRef.current) {
            if(Object.keys(formRef.current).length>1){
                formRef.current?.resetFormFields();
                formRef.current?.resetCertificadoFields()

            }else{
                formRef.current?.resetFormFields();
            }
            
        }
    };

    // Resalta la fila de "Robado"
    const rowClassName = (record) => {
        if (record.estado && typeof record.estado === 'string' && record.estado.toLowerCase() === 'robado') {
            return 'robado-row';
        }
        if (record.estado && typeof record.estado === 'string' && record.estado.toLowerCase() === 'de baja') {
            return 'de-baja-row';
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
                            style={{ background: 'transparent', fontSize: 14 }}
                        />
                    </div>
                )}
                {showAddButton && (
                    
                <Badge
                    count={pendientes}
                >
                    <Button 
                        className="table-layout-add-btn"
                        onClick={onAdd ? onAdd : () => setIsFormModalOpen(true)} 
                        type='primary'
                        style={{ 
                            background:'#0b3d63',
                            fontSize: fontSizeButton,
                            padding: paddingButton,
                            height: heightButton,
                         }}
                        loading={loading}
                    >
                        <PlusOutlined />{addButtonText}
                    </Button>
                    </Badge>
                )}
            </div>

            {FormComponent && (
                <Modal 
                    open={isFormModalOpen} 
                    //destroyOnClose
                    onCancel={handleCancel} 
                    footer={null}
                    width={widthModal}
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