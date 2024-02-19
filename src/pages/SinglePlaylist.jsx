import { useEffect, useState } from "react"
import NotFound from "../components/NotFound"
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { axiosHeaders, formatDuration } from "../../libraries/utilities";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
const { VITE_API_URL } = import.meta.env;

export default () => {

    const { user, token } = useUser()
    const { slug } = useParams()

    const blankPlaylist = { title: '', is_public: '' }
    const [error, setError] = useState();
    const [feedback, setFeedback] = useState();
    const [playlist, setPlaylist] = useState();
    const [plstNewData, setPlstNewData] = useState(blankPlaylist)
    const [tracks, setTracks] = useState();
    const navigate = useNavigate();
    let userIsOwner

    //============================== GET DI PLAYLIST E TRACKS ==============================

    useEffect(() => {
        axios.get(`${VITE_API_URL}/playlists/${slug}`, axiosHeaders(token))
            .then(res => {
                setPlaylist(res.data)
                // userIsOwner = user._id === playlist.created_by._id
            })
            .catch((e) => {
                console.log(e.message)
                setError(true)
            })
    }, [slug])

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
                    setFeedback('Playlist updated')
                    navigate(`/playlists/${res.data.slug}`)
                    setPlstNewData(blankPlaylist)
                }).catch(e => console.error(e.message))
        }
    }

    const deletePlaylist = (slug) => {
        axios.delete(`${VITE_API_URL}/playlists/${slug}`, axiosHeaders(token))
            .then(res => {
                setFeedback('Playlist deleted')
                navigate('/playlists')
            }).catch(e => console.error(e.message))
    }

    const addTrack = (trackId) => {
        axios.patch(`${VITE_API_URL}/playlists/${slug}`, { track_list: trackId }, axiosHeaders(token))
            .then(res => {
                setPlaylist(res.data)
                setFeedback('Track added')
            }).catch(e => {
                setFeedback('There was an error')
                console.error(e)
            })
    }

    const removeTrack = (index) => {
        axios.patch(`${VITE_API_URL}/playlists/${slug}/remove_track`, { remove: index }, axiosHeaders(token))
            .then(res => {
                setPlaylist(res.data)
                setFeedback('Track removed')
            }).catch(e => {
                setFeedback('There was an error')
                console.error(e)
            })
    }

    console.log(playlist);
    return (<>
        {error ?
            <NotFound />
            :
            <>
                {playlist === undefined ?
                    <p>Loading...</p>
                    :
                    <>
                        <section className="page single-plst">
                            <article className="single-plst container">
                                <div className="single-plst-wrapper">
                                    <div>
                                        <h1>{playlist.title}</h1>
                                        {playlist.is_public ?
                                            <span className="public">public</span>
                                            : <span className="private">private</span>
                                        }
                                        <div className="info">
                                            <span>posted by</span>
                                            <p>{playlist.created_by.display_name}</p>
                                            <span>created</span>
                                            <p>{dayjs(playlist.createdAt).format('DD-MM-YYYY')}</p>
                                            <span>last updated</span>
                                            <p>{dayjs(playlist.updatedAt).format('DD-MM-YYYY')}</p>
                                        </div>
                                    </div>
                                    {playlist && user && user._id === playlist.created_by._id &&
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
                                                                <span>{`duration: `}</span>
                                                                <span>{formatDuration(t.duration_sec)}</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    {user._id === playlist.created_by._id &&
                                                    <button
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
                            </article>
                            {playlist && user && user._id === playlist.created_by._id &&
                                <>
                                    {tracks === undefined ?
                                        <p>Loading...</p>
                                        :
                                        <>
                                            {tracks.length === 0 ?
                                                <div className="container">
                                                    <p>No tracks found</p>
                                                </div>
                                                :
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