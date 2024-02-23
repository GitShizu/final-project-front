import { useEffect, useState } from "react"
import NotFound from "../components/NotFound"
import { useUser } from "../../context/UserContext";
import axios from "../../libraries/axiosConfig";
import { axiosHeaders, convertToSeconds, formatDuration } from "../../libraries/utilities";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import InfoBox from "../components/InfoBox";
import Loading from "../components/Loading";
const { VITE_API_URL } = import.meta.env;

export default () => {

    const { user, token } = useUser()
    const { slug } = useParams()

    const blankDuration = { min: 0, sec: 0 }
    const [error, setError] = useState();                                                          //state che contiene eventuali errori nel get della traccia
    const [feedback, setFeedback] = useState({ type: '', message: '' });                           //state che contiene l'esito di un'operazione 
    const [track, setTrack] = useState();                                                          //state che contiene la singola traccia
    const blankTrack = { title: '', author: '', duration_sec: 0, is_public: false, img_path: '' }
    const [duration, setDuration] = useState(blankDuration)                                        //state che contiene i value degli input per minuti e secondi
    const [trkNewData, setTrkNewData] = useState(blankTrack);                                       //state che contiene i value degli input (tranne minuti e secondi)
    const [playlists, setPlaylists] = useState();                                                   //state che contiene la lista di playlists
    const [refreshPlst, setRefreshPlst] = useState(false)                                          //state che funziona da interruttore per innescare un rerender del componente
    const [refreshTrk, setRefreshTrk] = useState(false)                                            //state che funziona da interruttore per innescare un rerender del componente
    const navigate = useNavigate();

    //============================== GET DI TRACK E PLAYLISTS ==============================

    useEffect(() => {
        axios.get(`${VITE_API_URL}/tracks/${slug}`, axiosHeaders(token))
            .then(res => {
                setTrack(res.data)
            })
            .catch((e) => {
                console.log(e.message)
                setError(true)
            })
    }, [slug, refreshTrk])

    useEffect(() => {
        axios.get(`${VITE_API_URL}/playlists`, axiosHeaders(token))
            .then(res => {
                const filteredList = res.data.filter((plst) => {
                    return (
                        plst.created_by._id.toString() === user._id.toString()
                    )
                })
                if (user.is_admin) {
                    setPlaylists(res.data);
                } else {
                    setPlaylists(filteredList)
                }
            }
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    }, [refreshPlst])

    //===================================== FUNZIONI =====================================

    const editTrack = (newData) => {
        const validData = {}
        Object.entries(newData).forEach(([key, value]) => {
            if (value !== '' && value !== undefined && value !== 0) {
                validData[key] = value
            }
        })
        if (Object.keys(validData).length > 0) {

            axios.patch(`${VITE_API_URL}/tracks/${slug}`, validData, axiosHeaders(token))
                .then(res => {
                    setTrack(res.data)
                    setFeedback({ type: 'feedback', message: 'Track updated' })
                    navigate(`/tracks/${res.data.slug}`)
                    setTrkNewData(blankTrack)
                    setDuration(blankDuration)
                    setRefreshTrk(!refreshTrk)
                }).catch(e => console.error(e.message))

        }
    }
    //controlla quali valori sono stati compilati e fa un patch usando come body un oggetto che contiene solo le 
    //proprietà compilate. 

    const deleteTrack = (slug) => {
        axios.delete(`${VITE_API_URL}/tracks/${slug}`, axiosHeaders(token))
            .then(res => {
                setFeedback({ type: 'feedback', message: 'Track deleted' })
                navigate('/tracks')
            }).catch(e => console.error(e.message))
    }
    //elimina la traccia

    const addToPlaylist = (plstSlug) => {
        axios.patch(`${VITE_API_URL}/playlists/${plstSlug}`, { track_list: track._id }, axiosHeaders(token))
            .then(res => {
                setFeedback({ type: 'feedback', message: 'Track added' })
                setRefreshPlst(!refreshPlst)
            }).catch(e => {
                setFeedback({ type: 'warning', message: 'There was an error' })
                console.error(e)
            })
    }
    //aggiunge la traccia alla playlist con slug corrispondente a quello passato come argomento

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
        {error ?
            <NotFound />
            :
            <>
                {track === undefined ?
                    <section className="page">
                        <Loading />
                    </section>
                    :
                    <>
                        <section className="page single-track">
                            <article className="single-track container">
                                <div className="single-track-wrapper">
                                    {/* //dati della traccia */}
                                    <div>
                                        <h1>{track.title}</h1>
                                        <figure>
                                            <img src={track.img_path} alt="Track image" />
                                        </figure>
                                        <div className="info">
                                            <span>visibility</span>
                                            {track.is_public ?
                                                <p className="public">public</p>
                                                : <p className="private">private</p>
                                            }
                                            <span>author</span>
                                            <p>{track.author}</p>
                                            <span>duration</span>
                                            <p>{formatDuration(track.duration_sec)}</p>
                                            <span>posted by</span>
                                            <p>{track.created_by.display_name}</p>
                                            <span>created</span>
                                            <p>{dayjs(track.createdAt).format('DD-MM-YYYY')}</p>
                                            <span>last updated</span>
                                            <p>{dayjs(track.updatedAt).format('DD-MM-YYYY')}</p>
                                        </div>
                                    </div>
                                    {(user.is_admin || user._id === track.created_by._id) &&          //rendering condizionale che mostra il form solo a un admin o all'utente che ha creato la traccia.
                                        //form per modificare i dati della traccia                 
                                        <form className="form">
                                            <div className="toggle-wrapper">
                                                <span>{trkNewData.is_public ? 'Public' : 'Private'}</span>
                                                <input
                                                    id="p_toggle"
                                                    type="checkbox"
                                                    checked={trkNewData.is_public}
                                                    onChange={(e) => {
                                                        setTrkNewData(
                                                            {
                                                                ...trkNewData,
                                                                is_public: e.target.checked
                                                            }
                                                        )
                                                    }}
                                                />
                                                <label htmlFor="p_toggle">
                                                </label>
                                            </div>
                                            <div className="input-wrapper">
                                                <label>Title</label>
                                                <input
                                                    placeholder=""
                                                    required
                                                    maxLength={30}
                                                    value={trkNewData.title}
                                                    onChange={(e) => {
                                                        setTrkNewData(
                                                            {
                                                                ...trkNewData,
                                                                title: e.target.value
                                                            }
                                                        )
                                                    }}
                                                    type='text' />
                                            </div>
                                            <div className="input-wrapper">
                                                <label>Author</label>
                                                <input
                                                    placeholder=""
                                                    required
                                                    maxLength={30}
                                                    value={trkNewData.author}
                                                    onChange={(e) => {
                                                        setTrkNewData(
                                                            {
                                                                ...trkNewData,
                                                                author: e.target.value
                                                            }
                                                        )
                                                    }}
                                                    type='text' />
                                            </div>
                                            <div className="duration">
                                                <div className="input-wrapper">
                                                    <input
                                                        min='0'
                                                        max='60'
                                                        placeholder=""
                                                        required
                                                        value={duration.min > 0 ? duration.min : ''}
                                                        onChange={(e) => {
                                                            if (e.target.value.length <= 2) {
                                                                setDuration(
                                                                    {
                                                                        ...duration,
                                                                        min: e.target.value
                                                                    }
                                                                )
                                                            }

                                                        }}
                                                        type='number' />
                                                    <label>Minutes</label>
                                                </div>
                                                <div className="input-wrapper">
                                                    <input
                                                        min='0'
                                                        max='60'
                                                        placeholder=""
                                                        required
                                                        value={duration.sec > 0 ? duration.sec : ''}
                                                        onChange={(e) => {
                                                            if (e.target.value.length <= 2) {
                                                                setDuration(
                                                                    {
                                                                        ...duration,
                                                                        sec: e.target.value
                                                                    }
                                                                )
                                                            }
                                                        }}
                                                        type='number' />
                                                    <label>Seconds</label>
                                                </div>
                                            </div>
                                            <div className="input-wrapper">
                                                <input
                                                    placeholder=""
                                                    required
                                                    value={trkNewData.img_path}
                                                    onChange={(e) => {
                                                        setTrkNewData(
                                                            {
                                                                ...trkNewData,
                                                                img_path: e.target.value
                                                            }
                                                        )
                                                    }}
                                                    type='text' />
                                                <label>Image url</label>
                                            </div>
                                            <div className="button-wrapper">
                                                <button className="btn edit"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        const editDuration = duration.min !== '' || duration.sec !== ''
                                                        if(editDuration){
                                                            if(duration.min === ''){
                                                                editTrack(
                                                                    {
                                                                        ...trkNewData,
                                                                            duration_sec: Number(duration.sec)
                                                                        
                                                                    })  
                                                            }else{
                                                                editTrack(
                                                                    {
                                                                        ...trkNewData,
                                                                            duration_sec: convertToSeconds(Number(duration.min), Number(duration.sec))
                                                                        
                                                                    })  
                                                            }
                                                        }else{
                                                            editTrack(
                                                                {
                                                                    ...trkNewData
                                                                    
                                                                })
                                                        }
                                                    }}
                                                >Save changes</button>
                                                <button
                                                    className="btn remove"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        deleteTrack(track.slug)
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </form>
                                    }
                                </div>

                                {
                                    feedback.message &&
                                    < InfoBox type={feedback.type} message={feedback.message} onClose={() => {
                                        setFeedback({ type: '', message: '' })
                                    }} />
                                }

                            </article>
                            {(user.is_admin || user._id === track.created_by._id) &&                               //rendering condizionale che mostra la lista solo a un admin o all'utente che ha creato la traccia.
                                <>
                                    {playlists === undefined ?
                                        <Loading />
                                        :
                                        <>
                                            {playlists.length === 0 ?
                                                <div>
                                                    <p>No playlists found</p>
                                                </div>
                                                :
                                                //lista di playlist a cui poter aggiungere la traccia
                                                <section className="playlists list-wrapper container">
                                                    <h2>Add track to existent playlist</h2>
                                                    <ul>
                                                        {playlists.map((p, i) => {
                                                            return (
                                                                <li
                                                                    className="l-item"
                                                                    key={`st_plst_${i}`}
                                                                >
                                                                    <Link
                                                                        to={`/playlists/${p.slug}`}
                                                                        className="l-item-link"
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
                                                                    <button
                                                                        className="btn add"
                                                                        onClick={() => {
                                                                            addToPlaylist(p.slug)
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