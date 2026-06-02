import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useGetCurrentUser from './hooks/UseGetCurrentUser.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GenrateWeb from './pages/GenrateWeb.jsx'
import { useSelector } from 'react-redux'
import WebEditor from './pages/Editor.jsx'
const App = () => {
  useGetCurrentUser()
  const userData = useSelector(state => state.user.userData?.user)
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/dashbord' element={userData ? <Dashboard /> : <Navigate to={'/'} />} />
          <Route path='/generateweb' element={userData ? <GenrateWeb /> : <Navigate to={'/'} />} />
          <Route path='/editor/:id' element={userData ? <WebEditor /> : <Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App