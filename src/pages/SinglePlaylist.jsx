import { useEffect, useState } from "react"
import NotFound from "../components/NotFound"
import { useUser } from "../../context/UserContext";
import axios from "../../libraries/axiosConfig";
import { axiosHeaders, formatDuration } from "../../libraries/utilities";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import InfoBox from "../components/InfoBox";
import Loading from "../components/Loading";
const { VITE_API_URL } = import.meta.env;

export default () => {

    const { user, token } = useUser()
    const { slug } = useParams()

    const blankPlaylist = { title: '', is_public: false }
    const [error, setError] = useState();                                   //state che contiene eventuali errori nel get della playlist
    const [feedback, setFeedback] = useState({ type: '', message: '' });    //state che contiene l'esito di un'operazione 
    const [playlist, setPlaylist] = useState();                             //state che contiene la singola playlist
    const [plstNewData, setPlstNewData] = useState(blankPlaylist)           //state che contiene i value degli input
    const [tracks, setTracks] = useState();                                 //state che contiene la lista di tracce
    const [refreshPlst, setRefreshPlst] = useState(false)                   //state che funziona da interruttore per innescare un rerender del componente
    const [refreshTrk, setRefreshTrk] = useState(false)                     //state che funziona da interruttore per innescare un rerender del componente
    const navigate = useNavigate();

    //============================== GET DI PLAYLIST E TRACKS ==============================

    useEffect(() => {
        axios.get(`${VITE_API_URL}/playlists/${slug}`, axiosHeaders(token))
            .then(res => {
                setPlaylist(res.data)

            })
            .catch((e) => {
                console.log(e.message)
                setError(true)
            })
    }, [slug,refreshPlst])

    useEffect(() => {
        axios.get(`${VITE_API_URL}/tracks`, axiosHeaders(token))
            .then(obj => setTracks(obj.data)
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    }, [refreshTrk])

    //===================================== FUNZIONI =====================================

    const editPlaylist = (newData) => {
        const validData = {}
        Object.entries(newData).forEach(([key, value]) => {
            if (value !== '' && value !== undefined) {
                validData[key] = value
            }
        })

        if (Object.keys(validData).length > 0) {

            axios.patch(`${VITE_API_URL}/playlists/${slug}`, validData, axiosHeaders(token))
                .then(res => {
                    setPlaylist(res.data)
                    setFeedback({ type: 'feedback', message: 'Playlist updated' })
                    {navigate(`/playlists/${res.data.slug}`)}
                    setPlstNewData(blankPlaylist)
                    setRefreshPlst(!refreshPlst)
                }).catch(e => console.error(e.message))
        }
    }
    //controlla quali valori sono stati compilati e fa un patch usando come body un oggetto che contiene solo le 
    //proprietà compilate. 

    const deletePlaylist = (slug) => {
        axios.delete(`${VITE_API_URL}/playlists/${slug}`, axiosHeaders(token))
            .then(res => {
                setFeedback({ type: 'feedback', message: 'Playlist deleted' })
                navigate('/playlists')
            }).catch(e => console.error(e.message))
    }
    //elimina la playlist

    const addTrack = (trackId) => {
        axios.patch(`${VITE_API_URL}/playlists/${slug}`, { track_list: trackId }, axiosHeaders(token))
            .then(res => {
                setPlaylist(res.data)
                setFeedback({ type: 'feedback', message: 'Track added' })
                setRefreshTrk(!refreshTrk)
            }).catch(e => {
                setFeedback({ type: 'warning', message: 'There was an error' })
                console.error(e)
            })
    }
    //aggiunge una traccia alla playlist

    const removeTrack = (index) => {
        axios.patch(`${VITE_API_URL}/playlists/${slug}/remove_track`, { remove: index }, axiosHeaders(token))
            .then(res => {
                setPlaylist(res.data)
                setFeedback({ type: 'feedback', message: 'Track removed' })
                setRefreshPlst(!refreshPlst)
            }).catch(e => {
                setFeedback({ type: 'warning', message: 'There was an error' })
                console.error(e)
            })
    }
    //rimuove una traccia dalla playlist
   
    return (<>
        {error ?
            <NotFound />
            :
            <>
                {playlist === undefined ?
                   <section className="page">
                       <Loading />
                   </section>
                    :
                    <>
                        <section className="page single-plst">
                            <article className="single-plst container">
                                <div className="single-plst-wrapper">       
                                                {/* //dati della playlist */}
                                    <div>                                                               
                                        <h1>{playlist.title}</h1>
                                        <div className="info">
                                            <span>visibility</span>
                                            {playlist.is_public ?
                                                <p className="public">public</p>
                                                : <p className="private">private</p>
                                            }
                                            <span>posted by</span>
                                            <p>{playlist.created_by.display_name}</p>
                                            <span>created</span>
                                            <p>{dayjs(playlist.createdAt).format('DD-MM-YYYY')}</p>
                                            <span>last updated</span>
                                            <p>{dayjs(playlist.updatedAt).format('DD-MM-YYYY')}</p>
                                        </div>
                                    </div>
                                    {(user.is_admin || user._id === playlist.created_by._id) &&        //rendering condizionale che mostra il form solo all'utente che ha creato la playlist e agli admin
                                        //form per modificare i dati della playlist 
                                        <form className="form">                                         
                                            <div className="toggle-wrapper">
                                                <span>{plstNewData.is_public ? 'Public' : 'Private'}</span>
                                                <input
                                                    id="p_toggle"
                                                    type="checkbox"
                                                    checked={plstNewData.is_public}
                                                    onChange={(e) => {
                                                        setPlstNewData(
                                                            {
                                                                ...plstNewData,
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
                                                    value={plstNewData.title}
                                                    onChange={(e) => {
                                                        setPlstNewData(
                                                            {
                                                                ...plstNewData,
                                                                title: e.target.value
                                                            }
                                                        )
                                                    }}
                                                    type='text' />
                                                <label>title</label>
                                            </div>
                                            <div className="button-wrapper">

                                                <button className="btn edit"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        editPlaylist(plstNewData)
                                                    }}
                                                >Save changes</button>
                                                <button
                                                    className="btn remove"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        deletePlaylist(playlist.slug)
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </form>
                                    }
                                </div>
                                {/* //lista di tracce attualmente incluse nella playlist */}
                                <div className="single-plst list-wrapper">                              
                                    <h2>Current tracks</h2>
                                    <ul>
                                        {playlist.track_list.map((t, i) => {
                                            return (
                                                <li
                                                    className='l-item'
                                                    key={`curr_trk_${i}`}
                                                >
                                                    <Link
                                                        to={`/tracks/${t.slug}`}
                                                        className="link l-item-link"
                                                    >
                                                        <div className="core">
                                                            <figure>
                                                                <img src={t.img_path} alt="Track image" />
                                                            </figure>
                                                            <span>{t.title}</span>

                                                        </div>
                                                        <div className="details">
                                                            <div>
                                                                <span>{`author`}</span>
                                                                <span>{t.author}</span>
                                                            </div>
                                                            <div>
                                                                <span>{`duration`}</span>
                                                                <span>{formatDuration(t.duration_sec)}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    {(user.is_admin || user._id === playlist.created_by._id) &&              //rendering condizionale che mostra il bottone solo se 
                                                        <button                                                            //l'utente loggato è il creatore di questa playlist o è un admin
                                                            className="btn remove"
                                                            onClick={(e) => {
                                                                removeTrack(i)
                                                            }}
                                                        >
                                                            X
                                                        </button>
                                                    }
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                {
                                    feedback.message &&
                                    < InfoBox type={feedback.type} message={feedback.message} onClose={() => {
                                        setFeedback({ type: '', message: '' })
                                    }} />
                                }
                            </article>
                            {(user.is_admin || user._id === playlist.created_by._id) &&                   //rendering condizionale che mostra la lista solo se l'utente loggato è il creatore di questa playlist o è un admin
                                <>                                                                      
                                    {tracks === undefined ?
                                        <Loading />
                                        :
                                        <>
                                            {tracks.length === 0 ?
                                                <div className="container">
                                                    <p>No tracks found</p>
                                                </div>
                                                :
                                                //lista di tracce da poter includere nella playlist
                                                <section className="tracks list-wrapper container">      
                                                    <h2>Add existent tracks to playlist</h2>
                                                    <ul>
                                                        {tracks.map((t, i) => {
                                                            return (
                                                                <li
                                                                    className='l-item'
                                                                    key={`sp_trk_${i}`}
                                                                >
                                                                    <Link
                                                                        to={`/tracks/${t.slug}`}
                                                                        className="l-item-link"
                                                                    >
                                                                        <div className="core">
                                                                            <figure>
                                                                                <img src={t.img_path} alt="Track image" />
                                                                            </figure>
                                                                            <span>{t.title}</span>

                                                                        </div>
                                                                        <div className="details">
                                                                            <div>
                                                                                <span>{`author`}</span>
                                                                                <span>{t.author}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span>{`duration`}</span>
                                                                                <span>{formatDuration(t.duration_sec)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                    <button
                                                                        className="btn add"
                                                                        onClick={() => {
                                                                            addTrack(t._id)
                                                                        }}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </section>
                                            }
                                        </>
                                    }
                                </>
                            }

                        </section>
                    </>
                }
            </>
        }
    </>)
}