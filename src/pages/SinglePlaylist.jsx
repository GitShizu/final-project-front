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
    const blankFormData = {
        title: '',
    }
    const [plstNewData, setPlstNewData] = useState(blankFormData)
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
    }, [])

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
        Object.entries(validData).forEach(([key, value]) => {
            if (value !== '' && value !== undefined) {
                validData[key] = value
            }
        })
        if (Object.keys(validData).length > 0) {

            axios.patch(`${VITE_API_URL}/playlists/${slug}`, axiosHeaders(token))
                .then(res => {
                    setPlaylist(res.data)
                    setFeedback('Playlist updated')
                    navigate(`/playlists/${res.data.slug}`)
                })
        }
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
                            </section>
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
                                                        className="btn"
                                                        onClick={() => {

                                                        }}
                                                    >
                                                        Add
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </section>
                            }
                        </section>
                    </>
                }
            </>
        }
    </>)
}