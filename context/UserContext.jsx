import axios from "axios";
import { createContext, useContext, useState } from "react";
const { VITE_API_URL } = import.meta.env;


const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const storedData = localStorage.getItem('user_data');

    const [userData, setUserData] = useState(storedData === undefined? {
        user: null
    }: JSON.parse(storedData))

    const changeUserData = (newData) => {
        setUserData(newData);
        localStorage.setItem('user_data', JSON.stringify(newData))
    }

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const signUp = async ({ email, password, password2 }) => {

        if (loading) return;
        // Se loading è true significa che è già in corso un'operazione
        // di signup o login. L'esecuzione viene interrotta. 

        setError(null);         
        setLoading(true);
        //L'errore viene settato al valore iniziale null.
        //Lo state loading viene settato a true per impedire l'esecuzione
        //di ulteriori operazioni di signup o login (come sopra).

        if (password !== password2) {
            throw new Error("Password doesn't match")
        }
        //Se i valori immessi nei campi "password" e "conferma password" non corrispondono
        //viene lanciato un errore. 
        try {
            const { data: userAndToken } = await axios.post(`${VITE_API_URL}/auth/signup`, {
                email,
                password
            })
            changeUserData(userAndToken);
            //Chiamata POST alla rotta /auth/signup. 
            //Nel body viene inviato un oggetto che include come proprietà le credenziali fornite.
            //Nella proprietà data la response ritorna un oggetto che contiene lo user e il token. 
            //Salviamo l'oggetto nella variabile userAndToken.
            //Eseguiamo ChangeUserData con userAndToken come argomento per aggiornare 
            //il valore di userData e salvarlo sul local storage.
        } catch (error) {
            console.error(error)
            setError(error.message);
        } finally {
            setLoading(false)
            //Che sia andata a buon fine o meno, l'operazione di signup è conclusa.
            //Loading viene settato a false.
        }
    }

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
        setUserData({
            user: null
        })
    }
    
    const value = {
        ...userData,
        logIn,
        signUp,
        logOut,
        error,
        loading
    }

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