import logo from './logo.svg';
import './App.css';
import {Table, Tag} from "antd"
import { useEffect, useState } from 'react';

function App() {
    const [columns, setColumns] = useState([])
    const [dataSource, setDataSource] = useState([])
    
    const dataType = "posts"

    useEffect(()=>{
      fetch(`https://dummyjson.com/${dataType}`)
      .then(res => res.json())
      .then(results=>{
        const list = results[dataType]
        const firstObject = list[0] || {}
        const cols= []
        for (const key in firstObject){
          let render = (value)=>{
            return <span>{String(value)}</span>
          }
          if (typeof firstObject[key] === "object"){
            if(Array.isArray(firstObject[key])){
              render=(value)=>{
                return <span> {
                  value.map(tag=>{
                    return <Tag>{tag}</Tag>
                  })
                  }
                </span>
              }
            } else{
              render=(value)=>{
                return <span> {
                  Object.keys(value).map(key=>{
                    return <div>{key}:{value[key]}</div>
                  })
                  }
                </span>
              }
            }
            
          }
          const col = {
            title: String(key).charAt(0).toUpperCase() + String(key).slice(1),
            dataIndex : key,
            render: render
          }
          cols.push(col)
        }
        setColumns(cols)
        setDataSource(list)
      })
    }, [])

  return (
    <div className="App">
      <h1>Tabla de Instrumentos</h1>
      <Table columns={columns} dataSource={dataSource}></Table>
    </div>
  );
}

export default App;
