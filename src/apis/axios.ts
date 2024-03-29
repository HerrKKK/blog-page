import axios, {AxiosError, type AxiosRequestConfig, type AxiosResponse} from "axios";
import {refreshTokenAPI} from "@/apis/user";
import {useUserStore} from "@/stores/user";


const myAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    withCredentials: true,
})

myAxios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const userStore = useUserStore()
        const access_token = userStore.access_token
        if (access_token && access_token !== '') {
            config.headers!.Authorization = `Bearer ${access_token}`
        }
        const refresh_token = userStore.refresh_token
        if (refresh_token && refresh_token !== '') {
            config.headers!['refresh-token'] = refresh_token
        }
        return config
    },
    (error: AxiosError) => {
        console.log(error.message)
        return Promise.reject(error)
    }
)

myAxios.interceptors.response.use(
    (res: AxiosResponse) => {
        if (res.headers['x-token-need-refresh'] === 'true') {
            refreshTokenAPI()
        }
        return res;
    },

    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export default myAxios