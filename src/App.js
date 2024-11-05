import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from "./Home-Page";
import DetailViewInstrument from './components/detail-view-instrument';
import EditViewInstrument from './components/edit-view-instrument';

function App (){

    return (
        <Router>
          <Routes>
            <Route path="/" element={<HomePage/>} />  {/* Página principal */}
            <Route path="/detail/:id" element={<DetailViewInstrument/>} /> 
            <Route path='/edit/:id' element={<EditViewInstrument/>}/>
            
          </Routes>
        </Router>
      );


}


export default App