import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";



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
            <div className="form-wrapper container">

                <h1>{title}</h1>
                <form className="form">

                    {type === 'signup' &&
                        <div className="input-wrapper">
                            <label>User Name</label>
                            <input
                                value={formData.display_name}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        display_name: e.target.value
                                    })
                                }}
                                type='text' />
                        </div>
                    }
                    <div className="input-wrapper">
                        <label>email</label>
                        <input
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }}
                            type='email' />
                    </div>
                    <div className="input-wrapper">
                        <label>password</label>
                        <input
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    password: e.target.value
                                })
                            }}
                            type='password' />
                    </div>
                    {type === 'signup' &&
                        <>
                            <div className="input-wrapper">
                                <label>confirm password</label>
                                <input
                                    value={formData.password2}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            password2: e.target.value
                                        })
                                    }}
                                    type='password' />
                            </div>
                        </>
                    }
                    <div>
                        <button
                            disabled={loading}
                            onClick={(e) => signUser(e)}
                        >
                            {title}
                        </button>
                    </div>
                    {loading && <div>Loading...</div>}
                    {error && <div>{error.message}</div>}
                </form>
            </div>
        </section>
    )
}