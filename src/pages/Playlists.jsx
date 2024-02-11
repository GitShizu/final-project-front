import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { axiosHeaders } from "../../libraries/utilities"
const { VITE_API_URL } = import.meta.env

export default () => {

    const { token } = useUser();

    const [playlists, setPlaylists] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        axios.get(`${VITE_API_URL}/playlists`, axiosHeaders(token))
            .then(obj => setPlaylists(obj.data)
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    }, [])

    return (<>
        <section className="page playlists">
            {error ?
                <p> {error}</p>
                :
                <>
                    {playlists === undefined ?
                        <p>Loading</p>
                        :
                        <>
                            {playlists.length === 0 ?
                                <p>No playlists found</p>
                                :
                                <div className="list-wrapper container">
                                    <ul>
                                        {playlists.map((p, i) => {
                                            return (<>
                                                <li 
                                                classname='l-item' 
                                                key={`plst_${i}`}>
                                                    <Link
                                                        to={`/playlists/${p.slug}`}
                                                        className="link l-item-link"
                                                    >
                                                        {`${p.title} ${p.track_list.length}${p.track_list.length === 1?'Song':'Songs'}`}
                                                    </Link>
                                                    <button
                                                        className="btn remove-btn"
                                                        onClick={() => {
                                                            removePlaylist(p.slug)
                                                        }}
                                                    >
                                                    Remove
                                                    </button>
                                                </li>
                                            </>)

                                        })}
                                    </ul>
                                </div>
                            }
                        </>
                    }
                    <div className="add-new container"></div>
                </>
            }
        </section >
    </>)
}