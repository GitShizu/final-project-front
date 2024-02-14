export const axiosHeaders = (token) =>{
    return {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }
}

export const secondsToMinutes = (totalSeconds)=>{
    const hours = Math.floor(totalSeconds/60*60)
    const decimalMinutes = (totalSeconds - (decimalHours*60)*60)
}