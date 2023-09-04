import axios from 'axios'

export default (baseURL) => {
    // create axios instance
    let instance = axios.create({
        // baseURL: baseURL ? baseURL : process.env.VUE_APP_API_BASE_PATH
        baseURL: 'http://localhost:3000'
        // baseURL: process.env.VITE_API_BASE_URL
    })
    return instance
}
