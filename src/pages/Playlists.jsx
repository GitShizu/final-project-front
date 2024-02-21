import axios from "../../libraries/axiosConfig"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { axiosHeaders, formatDuration } from "../../libraries/utilities"
const { VITE_API_URL } = import.meta.env
import { RiDeleteBin6Line } from "react-icons/ri";
import Loading from "../components/Loading"
import InfoBox from "../components/InfoBox"

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
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        axios.get(`${VITE_API_URL}/playlists`, axiosHeaders(token))
            .then(res => setPlaylists(res.data)
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    }, [refresh])
    //===================================== FUNCTIONS =====================================

    const addPlaylist = (playlist) => {
        axios.post(`${VITE_API_URL}/playlists`, playlist, axiosHeaders(token))
            .then(res => {
                setPlaylists(res.data)
                setFeedback('Playlist added successfully')
                setRefresh(!refresh)
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

    const getDuration = (playlist) => {
        let duration = 0
        playlist.track_list.forEach(t => {
            duration += t.duration_sec
        })
        const formattedDuration = formatDuration(duration)
        return formattedDuration
    }

    return (<>
        <section className="page playlists">
            {error ?
                <InfoBox type={'warning'} message={error.message} />
                :
                <>
                    <article className="playlists form-wrapper container">
                        <h2>Add new Playlist</h2>
                        <form className="form">
                            <div className="toggle-wrapper">
                                <span>{newPlaylist.is_public ? 'Public' : 'Private'}</span>
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
                                </label>
                            </div>
                            <div className="input-wrapper">
                                <input
                                    placeholder=""
                                    required
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
                                <label>title</label>
                            </div>
                            <div className="button-wrapper">
                                <button
                                    className="btn add"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        addPlaylist({
                                            ...newPlaylist,
                                            created_by: user._id
                                        })
                                    }}
                                >Add
                                </button>
                            </div>

                        </form>

                    </article>

                    {playlists === undefined ?
                        <Loading />
                        :
                        <>
                            {playlists.length === 0 ?
                                <InfoBox type={'feedback'} message={'No playlists found'} />
                                :
                                <article className="playlists container">
                                    <div className="list-wrapper">
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
                                                            <div className="core">
                                                                <span>{p.title}</span>
                                                            </div>
                                                            <div className="details">
                                                                <div>
                                                                    <span>{'Tracks'}</span>
                                                                    <span>{p.track_list.length}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`duration`}</span>
                                                                    <span>{getDuration(p)}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        {user._id === p.created_by._id &&
                                                            <button
                                                                className="btn remove"
                                                                onClick={() => {
                                                                    deletePlaylist(p.slug)
                                                                }}
                                                            >
                                                                <RiDeleteBin6Line className="trash_icon" />
                                                            </button>
                                                        }
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </article>
                            }
                        </>
                    }

                </>
            }
        </section >
    </>)
}