import { Link, NavLink, useNavigate } from "react-router-dom"
import Home from "../pages/Home"
import SignUser from "../components/SignUser"
import { useUser } from "../../context/UserContext";
import mainLogo from "../assets/TPP_logo.png";
import { FaCircleUser } from "react-icons/fa6";

export default () => {

  const navigate = useNavigate()
  const { user, logOut } = useUser()

  return (
    <nav className="navbar">
      <menu>

        <figure className="logo-container">
          <Link to={'/'} element={<Home />} >
            <img className="logo" src={mainLogo} alt="logo" />
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
            
            <div className="user">
              <span>{user.display_name}</span>
              <FaCircleUser />
              <div
                className="logout"
                onClick={() => {
                  logOut()
                  navigate('/login')
                }}
              >Log out
              </div>
            </div>
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