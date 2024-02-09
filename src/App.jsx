import './App.scss'
import { useUser } from '../context/UserContext'
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Playlists from './components/Playlists'
import SignUser from './components/SignUser'
import SinglePlaylist from './components/SinglePlaylist'
import Navbar from './components/Navbar'

function App() {

  const { user } = useUser()

  return (
    <section className='app-container'>
      <Navbar user={user}/>
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
