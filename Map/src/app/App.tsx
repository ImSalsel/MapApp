import Home from '../pages/home/Home'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  )
}

export default App