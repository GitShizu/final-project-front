import { Link, NavLink, useNavigate } from "react-router-dom"
import Home from "../pages/Home"
import Playlists from "../pages/Playlists"
import SignUser from "../pages/SignUser"
import { useUser } from "../../context/UserContext";
import Tracks from "../pages/Tracks";
import { PiWaveformFill } from "react-icons/pi";



export default () => {

  const navigate = useNavigate()
  const { user, logOut } = useUser()

  return (
    <nav className="navbar">
      <menu>

        <figure className="logo-container">
          <Link to={'/'} element={<Home />} >
            <PiWaveformFill className='logo' />
          </Link>
        </figure>

        {user &&
          <>
            <li>
              <NavLink className={'navlink'} to={'/playlists'} end>Playlists</NavLink>
            </li>
            <li>
              <NavLink className={'navlink'} to={'/tracks'} end>Tracks</NavLink>
            </li>
            <li
              onClick={() => {
                logOut()
                navigate('/login')
              }}
            >Log out</li>
          </>
        }
        {!user &&
          <>
            <li>
              <NavLink className={'navlink'} to={'/signup'} element={<SignUser type='signup' />} >Sign Up</NavLink>
            </li>
            <li>
              <NavLink className={'navlink'} to={'/login'} element={<SignUser type='login' />} >Log In</NavLink>
            </li>
          </>}
      </menu>
    </nav>
  )
}