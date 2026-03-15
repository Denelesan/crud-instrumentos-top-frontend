import { Button, Table } from "antd"




const ListPanelLayout = ({
    sizeTable="small",
    columns=[],
    dataSource=[],
    loading="false"


}) =>{


    return (
        <div>
            <Button>+ Agregar Calibración</Button>
            <Table
                size={sizeTable}
                columns={columns}
                dataSource={dataSource}
                bordered={false}
                loading={loading}

            
            />

        </div>


    )
}


export default ListPanelLayout
