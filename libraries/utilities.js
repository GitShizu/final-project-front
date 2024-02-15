export const axiosHeaders = (token) =>{
    return {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }
}

export const formatDuration = (totalSeconds)=>{
    const hours = Math.floor(totalSeconds/60*60)
    const minutes = Math.floor(totalSeconds - ((hours*60)*60))/60
    const seconds = totalSeconds - (minutes*60)
    const duration = `${hours>0 && `${hours}h`}-${minutes<10?`0${minutes}m`: `${minutes}m`}-${seconds<10?`0${seconds}m`:`${seconds}s`}`
    return duration
}

export const convertToSeconds = (minutes,seconds) =>{
    const totalSeconds = minutes*60 + seconds
    return totalSeconds
}