import './App.scss'
import { useUser } from '../context/UserContext'
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Playlists from './pages/Playlists'
import SignUser from './pages/SignUser'
import SinglePlaylist from './pages/SinglePlaylist'
import Navbar from './components/Navbar'

function App() {

  const { userData } = useUser()

  return (
    <section className='app-container'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path={'/signup'} element={<SignUser type='signup' />} />
        <Route path={'/login'} element={<SignUser type='login' />} />
        <Route path={'/playlists'} >
          <Route index element={<Playlists/>} />
          <Route path={':slug'} element={<SinglePlaylist />} />
        </Route>
      </Routes>
    </section>
  )
}

export default App
