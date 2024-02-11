import { Link, NavLink } from "react-router-dom"
import Home from "./Home"
import Playlists from "./Playlists"
import SignUser from "./SignUser"
import { SiViaplay } from "react-icons/si";
import { useUser } from "../../context/UserContext";


export default () => {

  const {user,logOut} = useUser()

  return (
    <nav className="navbar">
      <menu>
        <figure className="logo-container">
          <Link to={'/'} element={<Home />} >
            <SiViaplay className="logo" />
          </Link>
        </figure>
        {user &&
          <>
            <li><NavLink className={'navlink'} to={'/playlists'} element={<Playlists />} >Playlists</NavLink></li>
            <li
            onClick={()=>{
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