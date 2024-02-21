import axios from "axios";
import { createContext, useContext, useState } from "react";
const { VITE_API_URL } = import.meta.env;


const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const storedData = localStorage.getItem('user_data');

    const [userData, setUserData] = useState(storedData ?
        JSON.parse(storedData)
        : { user: null })

    const changeUserData = (newData) => {
        setUserData(newData);
        localStorage.setItem('user_data', JSON.stringify(newData))
    }

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const signUp = async ({ display_name, email, password, password2 }) => {

        if (loading) return; 

        setError(null);
        setLoading(true);        

        if (password !== password2) {
            throw new Error("Password doesn't match")
        }
        try {
            const { data: userAndToken } = await axios.post(`${VITE_API_URL}/auth/signup`, {
                display_name,
                email,
                password
            })
            changeUserData(userAndToken);
        } catch (error) {
            console.error(error)
            setError(error.message);
        } finally {
            setLoading(false)
            
        }
    }
    // Se loading è true significa che è già in corso un signup o login. L'esecuzione viene interrotta.
    //Lo state loading viene settato a true per impedire l'esecuzione contemporanea di altri login o signup.
    //funzione per il signup. Chiamata post alla rotta signup che restituisce un oggetto contenente user e token in response.data.
    //Aggiorna il valore di userData con l'oggetto restituito dalla response e lo salva sul local storage. 
    //Che sia andata a buon fine o meno, l'operazione di signup è conclusa. Loading viene settato a false.
            

    const logIn = async ({ email, password }) => {
        if (loading) return;

        setError(null);
        setLoading(true);

        try {
            const { data: userAndToken } = await axios.post(`${VITE_API_URL}/auth/login`, {
                email,
                password
            })
            changeUserData(userAndToken);
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false)
        }
    }
    //logIn è sostanzialmente uguale a signUp, cambia solo la rotta della chiamata POST.

    const logOut = () => {
        changeUserData({
            user: null
        })
    }
    //funzione per il logout. Lo user e il valore di user_data nel local storage vengono settati a null.

    const value = {
        ...userData,
        logIn,
        signUp,
        logOut,
        error,
        loading
    }
    //value contiene tutte ciò che sarà accessibile dai componenti racchiusi nel context provider.

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)

    if (context === undefined) {
        throw new Error('useUser hook must be used within a UserProvider')
    }

    return context;
}
//hook per accedere al contenuto di value.