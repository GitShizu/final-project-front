import { useEffect, useState } from "react"
import NotFound from "../components/NotFound"
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { axiosHeaders } from "../../libraries/utilities";
import { Link, useNavigate, useParams } from "react-router-dom";
const { VITE_API_URL } = import.meta.env;

export default () => {

    const { user, token } = useUser()
    const { slug } = useParams()

    const blankTrack = { title: '', author: '', duration_sec: 0 }
    const [error, setError] = useState();
    const [feedback, setFeedback] = useState();
    const [track, setTrack] = useState();
    const [trkNewData, setTrkNewData] = useState(blankTrack);
    const [playlists, setPlaylists] = useState();
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
    }, [slug])

    useEffect(() => {
        axios.get(`${VITE_API_URL}/playlists`, axiosHeaders(token))
            .then(res => {
                const filteredList = res.data.filter((plst) => {
                    return (
                        plst.created_by.toString() === user._id.toString()
                    )
                })
                setPlaylists(filteredList)
            }
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    }, [])

    //===================================== FUNZIONI =====================================

    const editTrack = (newData) => {
        const validData = {}
        Object.entries(newData).forEach(([key, value]) => {
            if (value !== '' && value !== undefined) {
                validData[key] = value
            }
        })
        if (Object.keys(validData).length > 0) {

            axios.patch(`${VITE_API_URL}/tracks/${slug}`, validData, axiosHeaders(token))
                .then(res => {
                    setTrack(res.data)
                    setFeedback('Track updated')
                    navigate(`/tracks/${res.data.slug}`)
                    setTrkNewData(blankTrack)
                })
        }
    }

    const deleteTrack = (slug) => {
        axios.delete(`${VITE_API_URL}/tracks/${slug}`, axiosHeaders(token))
            .then(res => {
                setFeedback('Track deleted')
                navigate('/tracks')
            }).catch(e => console.error(e.message))
    }

    const addToPlaylist = (plstSlug) => {
        axios.patch(`${VITE_API_URL}/playlists/${plstSlug}`, { track_list: track._id }, axiosHeaders(token))
            .then(res => {
                setFeedback('Track added')
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
                {track === undefined ?
                    <p>Loading...</p>
                    :
                    <>
                        <section className="page single-track">
                            <article className="single-track container">
                                <div className="single-track info">
                                    <h1>{track.title}</h1>
                                    <div className="form-wrapper container">
                                        <form className="form">
                                            <h3>Edit</h3>
                                            <div className="input-wrapper">
                                                <label>Title</label>
                                                <input
                                                    placeholder=""
                                                    required
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
                                            <div className="input-wrapper">
                                                <label>Duration</label>
                                                <input
                                                    placeholder=""
                                                    required
                                                    value={trkNewData.duration}
                                                    onChange={(e) => {
                                                        setTrkNewData(
                                                            {
                                                                ...trkNewData,
                                                                duration_sec: e.target.value
                                                            }
                                                        )
                                                    }}
                                                    type='number' />
                                            </div>
                                            <div className="button-wrapper">
                                                <button className="btn edit"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        editTrack(trkNewData)
                                                    }}
                                                >Edit</button>
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
                                    </div>
                                </div>
                            </article>
                            {playlists === undefined ?
                                <p>Loading...</p>
                                :
                                <>
                                    {playlists.length === 0 ?
                                        <div>
                                            <p>No playlists found</p>
                                        </div>
                                        :
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
                                                                className="link l-item-link"
                                                            >
                                                                {`${p.title} ${p.track_list.length}${p.track_list.length === 1 ? 'Song' : 'Songs'}`}
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
                        </section>
                    </>
                }
            </>
        }
    </>)
}