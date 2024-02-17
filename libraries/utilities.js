export const axiosHeaders = (token) =>{
    return {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }
}

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

export const convertToSeconds = (minutes,seconds) =>{
    const totalSeconds = minutes*60 + seconds
    return totalSeconds
}