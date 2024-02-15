import './App.scss'
import { useUser } from '../context/UserContext'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Playlists from './pages/Playlists'
import SignUser from './pages/SignUser'
import SinglePlaylist from './pages/SinglePlaylist'
import Navbar from './components/Navbar'
import Tracks from './pages/Tracks'
import SingleTrack from './pages/SingleTrack'

function App() {

  const { user } = useUser()

  return (
    <section className='app-container'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path={'/signup'} element={!user ? <SignUser type='signup' /> : <Navigate to="/" />} />
        <Route path={'/login'} element={!user ? <SignUser type='login' /> : <Navigate to="/" />} />
        <Route path={'/playlists'} element={user ? <Outlet/> : <Navigate to="/login" />}>
          <Route index element={<Playlists />} />
          <Route path={':slug'} element={<SinglePlaylist />} />
        </Route>
        <Route path={'/tracks'} element={user ? <Outlet/> : <Navigate to="/login" />}>
          <Route index element={<Tracks />} />
          <Route path={':slug'} element={<SingleTrack />} />
        </Route>
      </Routes>
    </section>
  )
}

export default App
