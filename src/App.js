import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from "./Home-Page";
import DetailViewInstrument from './components/detail-view-instrument';
import EditViewInstrument from './components/edit-view-instrument';
import EditViewHitoCalibration from './components/edit-view-calibration'

function App (){

    return (
        <Router>
          <Routes>
            <Route path="/" element={<HomePage/>} />  {/* Página principal */}
            <Route path="/detail/:id" element={<DetailViewInstrument/>} /> 
            <Route path='/edit/:id' element={<EditViewInstrument/>}/>
            <Route path='/calibration/edit/:id' element={<EditViewHitoCalibration/>}/>
            
          </Routes>
        </Router>
      );


}


export default App