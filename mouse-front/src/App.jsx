import './App.css'
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./Home/Home.jsx";
import Tasks from "./Tasks/Tasks.jsx";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/tasks" element={<Tasks/>} />
          <Route path="/*" element={<h1>404</h1>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
