import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Homepage from "./components/Home/Homepage";
import About from "./components/Home/About";
 
 
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Navbar />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Homepage/>} />
        
      </Routes>
    </Router>
  );
};
 
export default App;