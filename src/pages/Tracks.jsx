import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { axiosHeaders } from "../../libraries/utilities"
const { VITE_API_URL } = import.meta.env
import { RiDeleteBin6Line } from "react-icons/ri";

export default () => {

    const { user, token } = useUser();

    const blankTrack = { title: '', author: '', duration_sec: 0,is_public: false }
    const [tracks, setTracks] = useState();
    const [newTrack, setNewTrack] = useState(blankTrack)
    const [error, setError] = useState();
    const [feedback, setFeedback] = useState()

    useEffect(() => {
        axios.get(`${VITE_API_URL}/tracks`, axiosHeaders(token))
            .then(obj => setTracks(obj.data)
            )
            .catch(e => {
                setError(e.message)
                console.error(e.message)
            })
    }, [])
    //===================================== FUNCTIONS =====================================

    const addTrack = (track) => {
        axios.post(`${VITE_API_URL}/tracks`, track, axiosHeaders(token))
            .then(res => {
                setTracks(res.data)
                setFeedback('Track added successfully')
                setNewTrack(blankTrack)
            })
            .catch(e => {
                setFeedback('Please insert valid data')
                console.error(e)
            })
    }

    const removeTrack = (slug) => {
        axios.delete(`${VITE_API_URL}/tracks/${slug}`, axiosHeaders(token))
            .then(res => {
                setTracks(res.data)
                setFeedback('Track deleted successfully')
            }).catch(e => console.error(e.message))
    }

    return (<>
        <section className="page tracks">
            {error ?
                <p>{error}</p>
                :
                <>
                    {tracks === undefined ?
                        <p>Loading...</p>
                        :
                        <>
                            {tracks.length === 0 ?
                                <p>No tracks found</p>
                                :
                                <div className="tracks list-wrapper container">
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
                                                        {`${t.title} ${t.author} ${t.duration_sec}`}
                                                    </Link>
                                                    <button
                                                        className="btn remove"
                                                        onClick={() => {
                                                            removeTrack(t.slug)
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
                    <div className="tracks form-wrapper container">
                        <form action="">
                            <h2>Add new Track</h2>
                            <div className="toggle wrapper">
                                <input
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
                                    Set as public
                                </label>
                            </div>
                            <div className="input-wrapper">
                                <label>title</label>
                                <input
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
                            </div>
                            <div className="input-wrapper">
                                <label>Author</label>
                                <input
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
                            </div>
                            <div className="input-wrapper">
                                <label>Duration</label>
                                <input
                                    value={newTrack.duration_sec}
                                    onChange={(e) => {
                                        setNewTrack(
                                            {
                                                ...newTrack,
                                                duration_sec: e.target.value
                                            }
                                        )
                                    }}
                                    type='text' />
                            </div>
                            <button
                                className="btn"
                                onClick={(e) => {
                                    e.preventDefault()
                                    addTrack({
                                        ...newTrack,
                                        created_by: user._id    
                                    })
                                }}
                            >Add
                            </button>
                        </form>


                    </div>
                </>
            }
        </section>
    </>)
}

