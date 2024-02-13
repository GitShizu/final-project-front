import { useEffect, useState } from "react"
import NotFound from "../components/NotFound"
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { axiosHeaders } from "../../libraries/utilities";
import { useNavigate, useParams } from "react-router-dom";
const { VITE_API_URL } = import.meta.env;

export default () => {

    const { token } = useUser()
    const { slug } = useParams()

    const [error, setError] = useState();
    const [feedback, setFeedback] = useState();
    const [playlist, setPlaylist] = useState();
    const blankPlaylist = { title: '' }
    const [plstNewData, setPlstNewData] = useState(blankPlaylist)
    const [tracks, setTracks] = useState();
    const navigate = useNavigate()

    //===================================== GET DI PLAYLISTS E TRACKS =====================================

    useEffect(() => {
        axios.get(`${VITE_API_URL}/playlists/${slug}`, axiosHeaders(token))
            .then(res => {
                setPlaylist(res.data)
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

    const editPlaylist = () => {
        const validData = {}
        Object.entries(plstNewData).forEach(([key, value]) => {
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
                })
        }
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
                            <section className="single-plst container">
                                <div className="single-plst info">
                                    <h1>{playlist.title}</h1>
                                    <h3>Edit</h3>
                                    <div className="input-wrapper">
                                        <label>title</label>
                                        <input
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
                                    </div>
                                    <button className="btn"
                                        onClick={() => {
                                            editPlaylist(plstNewData)
                                        }}
                                    >Edit</button>
                                </div>
                                <div className="list-wrapper container">
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
                                                        {`${t.title} ${t.author} ${t.duration_sec}`}
                                                    </Link>
                                                    <button
                                                        className="btn remove"
                                                        onClick={() => {
                                                            removeTrack(t.slug)
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </section>
                            {tracks === undefined ?
                                <p>Loading...</p>
                                :
                                <>
                                    {tracks.length === 0 ?
                                        <div>
                                            <p>No tracks found</p>
                                        </div>
                                        :
                                        <section className="tracks list-wrapper container">
                                            <ul>
                                                {tracks.map((t, i) => {
                                                    return (
                                                        <li
                                                            className='l-item'
                                                            key={`trk_${i}`}
                                                        >
                                                            {`${t.title} ${t.author} ${t.duration_sec}`}
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
                        </section>
                    </>
                }
            </>
        }
    </>)
}