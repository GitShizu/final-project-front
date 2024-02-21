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

    const { user, token } = useUser();                                 //user e token vengono destrutturati dal context

    const blankPlaylist = {
        title: '',
        track_list: [],
        is_public: false,
        created_by: ''
    }

    const [playlists, setPlaylists] = useState();                      //state che contiene la lista di playlist
    const [newPlaylist, setNewPlaylist] = useState(blankPlaylist)      //state che contiene i value degli input
    const [error, setError] = useState();                              //state che contiene eventuali errori nel get delle playlist
    const [feedback, setFeedback] = useState({ type: '', message: '' })//state che contiene l'esito di un'operazione 
    const [refresh, setRefresh] = useState(false);                     //state che funziona da interruttore per innescare un rerender del componente

    //================================= GET DELLE PLAYLIST ================================

    useEffect(() => {
        axios.get(`${VITE_API_URL}/playlists`, axiosHeaders(token))
            .then(res => setPlaylists(res.data)
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    }, [refresh])

    //===================================== FUNZIONI =====================================

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
    //crea una nuova playlist usando come body l'oggetto che prende come argomento

    const deletePlaylist = (slug) => {
        axios.delete(`${VITE_API_URL}/playlists/${slug}`, axiosHeaders(token))
            .then(res => {
                setPlaylists(res.data)
                setFeedback('Playlist deleted successfully')
            }).catch(e => console.error(e.message))
    }
    //prende come argomento uno slug ed elimina la playlist corrispondente

    const getDuration = (playlist) => {
        let duration = 0
        playlist.track_list.forEach(t => {
            duration += t.duration_sec
        })
        const formattedDuration = formatDuration(duration)
        return formattedDuration
    }
    //calcola la durata totale della playlist sommando le durate delle tracce attualmente incluse. 
    //formatta la durata da secondi a ore, minuti e secondi usando una funzione d'appoggio(vedi libraries/utilities/formatDuration)

    return (<>
        <section className="page playlists">
            {error ?
                <InfoBox type={'warning'} message={error.message} />
                :
                <>
                    {/* contenitore del form per aggiungere nuova playlist */}
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
                                    maxLength={50}
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
                                //contenitore della lista di playlist
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