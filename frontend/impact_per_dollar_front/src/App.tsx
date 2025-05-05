import{Routes, Route, Link} from 'react-router-dom'
import Home from "./pages/Home"
import Inquire from './pages/Inquire'
import './App.css'

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/inquire">Inquire</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/inquire" element={<Inquire />}/>
      </Routes>
    </div>
  )
}

export default App
