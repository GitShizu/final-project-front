import { Link, NavLink } from "react-router-dom"
import Home from "./Home"
import Playlists from "./Playlists"
import SignUser from "./SignUser"
import { SiViaplay } from "react-icons/si";


export default ({ user }) => {
  return (
    <nav className="navbar">
      <menu>
        {user &&
          <>
            <figure className="logo-container">
              <Link to={'/'} element={<Home />} >
                <SiViaplay className="logo" />
              </Link>
            </figure>


            <NavLink className={'navlink'} to={'/playlists'} element={<Playlists />} >Playlists</NavLink>

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