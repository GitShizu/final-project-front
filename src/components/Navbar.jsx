import { NavLink } from "react-router-dom"

export default ()=>{
    return(
    <nav className="navbar">
        <menu>
          {user &&
            <>
              <li>
                <NavLink className={'navlink'} to={'/'} element={<HomePage />} >Home</NavLink>
              </li>
              <li>
                <NavLink className={'navlink'} to={'/playlists'} element={<PlaylistsPage />} >Playlists</NavLink>
              </li>
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