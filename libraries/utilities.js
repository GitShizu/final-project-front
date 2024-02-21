export const axiosHeaders = (token) =>{
    return {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }
}
//funzione d'appoggio che genera l'header per l'autorizzazione via token da includere nelle chiamate. 

export const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    if(hours>0){
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }else{
        return `${formattedMinutes}:${formattedSeconds}`
    }
    
}
//funzione d'appoggio che accetta come argomento un valore in secondi e restituisce una stringa 
//che rappresenta una durata in ore,minuti e secondi oppure solo minuti e secondi se le ore sono 0.

export const convertToSeconds = (minutes,seconds) =>{
    const totalSeconds = minutes*60 + seconds
    return totalSeconds
}
//funzione d'appoggio che accetta come argomenti un valore in minuti e uno in secondi. 
//converte la durata in secondi e la restituisce.