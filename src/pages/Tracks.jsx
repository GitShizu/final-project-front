import axios from "../../libraries/axiosConfig"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { axiosHeaders, convertToSeconds, formatDuration } from "../../libraries/utilities"
const { VITE_API_URL } = import.meta.env
import { RiDeleteBin6Line } from "react-icons/ri";

export default () => {

    const { user, token } = useUser();

    const blankTrack = {
        title: '',
        author: '',
        duration_sec: 0,
        is_public: false,
        img_path: undefined
    }
    const blankDuration = { min: 0, sec: 0 }
    const [tracks, setTracks] = useState();                          //state che contiene la lista di tracce
    const [newTrack, setNewTrack] = useState(blankTrack)             //state che contiene i value degli input (tranne min e sec)
    const [duration, setDuration] = useState(blankDuration)          //state che contiene i value degli input per min e sec
    const [error, setError] = useState();                            //state che contiene eventuali errori nel get delle tracce
    const [feedback, setFeedback] = useState()                       //state che contiene l'esito di un'operazione 

    //================================== GET DELLE TRACCE =================================

    useEffect(() => {
        axios.get(`${VITE_API_URL}/tracks`, axiosHeaders(token))
            .then(obj => setTracks(obj.data)
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    }, [])
    //===================================== FUNZIONI =====================================

    const addTrack = (track) => {
        axios.post(`${VITE_API_URL}/tracks`, track, axiosHeaders(token))
            .then(res => {
                setTracks(res.data)
                setFeedback('Track added successfully')
                setNewTrack(blankTrack)
                setDuration(blankDuration)
            })
            .catch(e => {
                setFeedback('Please insert valid data')
                console.error(e)
            })
    }
    //crea una nuova traccia usando come body l'oggetto che prende come argomento

    const removeTrack = (slug) => {
        axios.delete(`${VITE_API_URL}/tracks/${slug}`, axiosHeaders(token))
            .then(res => {
                setTracks(res.data)
                setFeedback('Track deleted successfully')
            }).catch(e => console.error(e.message))
    }
    //prende come argomento uno slug ed elimina la traccia corrispondente

    return (<>
        <section className="page tracks">
            {error ?
                <p>{error}</p>
                :
                <>
                     {/* contenitore del form per aggiungere nuova traccia */}
                    <article className="tracks form-wrapper container">   
                        <h2>Add new Track</h2>
                        <form className="form">
                            <div className="toggle-wrapper">
                                <span>{newTrack.is_public ? 'Public' : 'Private'}</span>
                                <input
                                    required
                                    id="t_toggle"
                                    type="checkbox"
                                    checked={newTrack.is_public}
                                    onChange={(e) => {
                                        setNewTrack(
                                            {
                                                ...newTrack,
                                                is_public: e.target.checked
                                            }
                                        )
                                    }}
                                />
                                <label htmlFor="t_toggle">
                                </label>
                            </div>
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input
                                        placeholder=""
                                        required
                                        value={newTrack.title}
                                        onChange={(e) => {
                                            setNewTrack(
                                                {
                                                    ...newTrack,
                                                    title: e.target.value
                                                }
                                            )
                                        }}
                                        type='text' />
                                    <label>title</label>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        placeholder=""
                                        required
                                        value={newTrack.author}
                                        onChange={(e) => {
                                            setNewTrack(
                                                {
                                                    ...newTrack,
                                                    author: e.target.value
                                                }
                                            )
                                        }}
                                        type='text' />
                                    <label>Author</label>
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
                                                setDuration(
                                                    {
                                                        ...duration,
                                                        min: e.target.value
                                                    }
                                                )
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
                                            value={duration.sec > 0 ? duration.min : ''}
                                            onChange={(e) => {
                                                setDuration(
                                                    {
                                                        ...duration,
                                                        sec: e.target.value
                                                    }
                                                )
                                            }}
                                            type='number' />
                                        <label>Seconds</label>
                                    </div>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        placeholder=""
                                        required
                                        value={newTrack.img_path}
                                        onChange={(e) => {
                                            setNewTrack(
                                                {
                                                    ...newTrack,
                                                    img_path: e.target.value
                                                }
                                            )
                                        }}
                                        type='text' />
                                    <label>Image</label>
                                </div>
                            </div>
                            <div className="button-wrapper">
                                <button
                                    className="btn add"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        addTrack({
                                            ...newTrack,
                                            created_by: user._id,
                                            duration_sec: convertToSeconds(Number(duration.min), Number(duration.sec))
                                        })
                                    }}
                                >Add
                                </button>
                            </div>
                        </form>


                    </article>
                    {tracks === undefined ?
                        <p>Loading...</p>
                        :
                        <>
                            {tracks.length === 0 ?
                                <p>No tracks found</p>
                                :
                                 //contenitore della lista di tracce
                                <article className="tracks container"> 
                                    <div className="list-wrapper">
                                        <ul>
                                            {tracks.map((t, i) => {
                                                return (
                                                    <li
                                                        className='l-item'
                                                        key={`trk_${i}`}
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
                                                                    <span>{`author: `}</span>
                                                                    <span>{t.author}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`duration: `}</span>
                                                                    <span>{formatDuration(t.duration_sec)}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        {user._id === t.created_by._id &&
                                                            <button
                                                            className="btn remove"
                                                            onClick={() => {
                                                                removeTrack(t.slug)
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
        </section>
    </>)
}

