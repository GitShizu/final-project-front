export const axiosHeaders = (token) =>{
    return {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }
}