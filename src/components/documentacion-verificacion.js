import Upload from "antd/es/upload/Upload";
import { useEffect, useState } from "react"
import { InboxOutlined,UploadOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const DocumentacionVerificacion = (idHito) =>{

    const [fileList, setFileList] = useState([]); //estado de los archivos


    return (
        <>
        <Upload.Dragger
            multiple
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
        >

            <p className="ant-upload-drag-icon">
                📄
            </p>

            <p>Arrastre uno o más archivos</p>

            <p>o haga clic aquí</p>

        </Upload.Dragger>
        </>

    )
}

export default DocumentacionVerificacion;