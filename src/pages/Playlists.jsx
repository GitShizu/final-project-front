import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { axiosHeaders } from "../../libraries/utilities"
const { VITE_API_URL } = import.meta.env
import { RiDeleteBin6Line } from "react-icons/ri";

export default () => {

    const { user, token } = useUser();

    const blankPlaylist = {
        title: '',
        track_list: [],
        is_public: false,
        created_by: ''
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

    const addPlaylist = (playlist) => {
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

    const deletePlaylist = (slug) => {
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
                                <div className="playlists list-wrapper container">
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
                                                        className="btn remove"
                                                        onClick={() => {
                                                            deletePlaylist(p.slug)
                                                        }}
                                                    >
                                                        <RiDeleteBin6Line className="trash_icon"/>
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            }
                        </>
                    }
                    <div className="playlists form-wrapper container">
                        <form className="form">
                            <h2>Add new Playlist</h2>
                            <div className="toggle wrapper">
                                <input
                                    id="p_toggle"
                                    type="checkbox"
                                    checked={newPlaylist.is_public}
                                    onChange={(e) => {
                                        setNewPlaylist(
                                            {
                                                ...newPlaylist,
                                                is_public: e.target.checked
                                            }
                                        )
                                    }}
                                />
                                <label htmlFor="p_toggle">
                                    Set as public
                                </label>
                            </div>
                            <div className="input-wrapper">
                                <label>title</label>
                                <input
                                    value={newPlaylist.title}
                                    onChange={(e) => {
                                        setNewPlaylist(
                                            {
                                                ...newPlaylist,
                                                title: e.target.value
                                            }
                                        )
                                    }}
                                    type='text' />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    addPlaylist({
                                        ...newPlaylist,
                                        created_by: user._id
                                    })
                                }}
                            >Add
                            </button>
                        </form>

                    </div>
                </>
            }
        </section >
    </>)
}