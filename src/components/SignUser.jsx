import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import InfoBox from "./InfoBox";



export default ({ type }) => {

    const { logIn, signUp, error, loading } = useUser();
    const navigate = useNavigate()

    const title = type === 'login' ? 'Log In' : 'Sign Up';
    const [formData, setFormData] = useState({
        display_name: '',
        email: '',
        password: '',
        password2: ''
    })

    const signUser = (e) => {
        e.preventDefault()
        if (type === 'login') {
            logIn(formData)
        } else {
            signUp(formData)
        }
        if (!error) { navigate('/') }
    }

    return (
        <section className="page signup">
            {loading ?
                <Loading />
                :
                <div className=" form-wrapper container">

                    <h1>{title}</h1>
                    <form className="form">

                        {type === 'signup' &&
                            <div className="input-wrapper">
                                <input
                                    placeholder=""
                                    required
                                    maxLength={24}
                                    value={formData.display_name}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            display_name: e.target.value
                                        })
                                    }}
                                    type='text' />
                                <label>User Name</label>
                            </div>
                        }
                        <div className="input-wrapper">
                            <input
                                placeholder=""
                                required
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        email: e.target.value
                                    })
                                }}
                                type='email' />
                            <label>email</label>
                        </div>
                        <div className="input-wrapper">
                            <input
                                placeholder=""
                                required
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })
                                }}
                                type='password' />
                            <label>password</label>
                        </div>
                        {type === 'signup' &&
                            <>
                                <div className="input-wrapper">
                                    <input
                                        placeholder=""
                                        required
                                        value={formData.password2}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                password2: e.target.value
                                            })
                                        }}
                                        type='password' />
                                    <label>confirm password</label>
                                </div>
                            </>
                        }
                        <div>
                            <button
                                className="btn sign-user"
                                disabled={loading}
                                onClick={(e) => signUser(e)}
                            >
                                {title}
                            </button>
                        </div>
                    </form>
                    {error &&
                        <InfoBox type={'warning'} message={error.message}/>
                    }
                </div>
            }
        </section>
    )
}
//componente che mostra una pagina di login o signup in base al parametro type. 