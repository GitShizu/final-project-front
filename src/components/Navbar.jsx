import { Link, NavLink } from "react-router-dom"
import Home from "../pages/Home"
import Playlists from "../pages/Playlists"
import SignUser from "../pages/SignUser"
import { useUser } from "../../context/UserContext";


export default () => {

  const { user, logOut } = useUser()

  return (
    <nav className="navbar">
      <menu>

        <Link className='logo' to={'/'} element={<Home />} >
          <figure className="logo-container">
            <img src="./public/logo_teal_purple.svg" alt="Logo" />
          </figure>
        </Link>

        {user &&
          <>
            <li><NavLink className={'navlink'} to={'/playlists'} element={<Playlists />} >Playlists</NavLink></li>
            <li
              onClick={() => {
                logOut()
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