import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { axiosHeaders } from "../../libraries/utilities"
const { VITE_API_URL } = import.meta.env

export default () => {

    const { token } = useUser();

    const blankPlaylist = {
        title: '',
        track_list: []
    }

    const [playlists, setPlaylists] = useState();
    const [newPlaylist, setNewPlaylist] = useState(blankPlaylist)
    const [error, setError] = useState();
    const [feedback, setFeedback] = useState()

    useEffect(() => {
        axios.get(`${VITE_API_URL}/playlists`, axiosHeaders(token))
            .then(res => setPlaylists(res.data)
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    }, [])
    //===================================== FUNCTIONS =====================================

    const addPlaylist = (playlist)=>{
        axios.post(`${VITE_API_URL}/playlists`, playlist, axiosHeaders(token))
            .then(res => {
                setPlaylists(res.data)
                setFeedback('Playlist added successfully')
                setNewPlaylist(blankPlaylist)
            })
            .catch(e => {
                setFeedback('Please insert valid data')
                console.error(e)
            })
    }

    const removePlaylist = (slug) => {
        axios.delete(`${VITE_API_URL}/playlists/${slug}`, axiosHeaders(token))
            .then(res => {
                setPlaylists(res.data)
                setFeedback('Playlist deleted successfully')
            }).catch(e => console.error(e.message))
    }

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
                                            return (
                                                <li
                                                    className='l-item'
                                                    key={`plst_${i}`}
                                                >
                                                    <Link
                                                        to={`/playlists/${p.slug}`}
                                                        className="link l-item-link"
                                                    >
                                                        {`${p.title} ${p.track_list.length}${p.track_list.length === 1 ? 'Song' : 'Songs'}`}
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
                                            )
                                        })}
                                    </ul>
                                </div>
                            }
                        </>
                    }
                    <div className="form-wrapper container">
                        <h2>Add new Playlist</h2>

                        <div className="input-wrapper">
                            <label>title</label>
                            <input
                                value={newPlaylist.title}
                                onChange={(e) => {
                                    setNewPlaylist(
                                        {...newPlaylist,
                                            title: e.target.value
                                        }
                                    )
                                }}
                                type='text' />
                        </div>
                        <button
                        onClick={()=>{
                            addPlaylist(newPlaylist)
                        }}
                        >Add
                        </button>

                    </div>
                </>
            }
        </section >
    </>)
}