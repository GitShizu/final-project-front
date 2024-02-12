import './App.scss'
import { useUser } from '../context/UserContext'
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Playlists from './pages/Playlists'
import SignUser from './pages/SignUser'
import SinglePlaylist from './pages/SinglePlaylist'
import Navbar from './components/Navbar'
import Tracks from './pages/Tracks'
import SingleTrack from './pages/SingleTrack'

function App() {

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
        <Route path={'/tracks'} >
          <Route index element={<Tracks/>} />
          <Route path={':slug'} element={<SingleTrack />} />
        </Route>
      </Routes>
    </section>
  )
}

export default App
