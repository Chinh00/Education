import axios, {AxiosInstance} from "axios";
import Auth, {Authenticate} from "./utils/auth.ts";
import store from "@/app/stores/stores.ts";
import {setAuthenticate, setIsConfirm} from "@/app/stores/common_slice.ts";


function sleep(ms = 500): Promise<void> {
    console.log('Kindly remember to remove `sleep`');
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const cancelToken = axios.CancelToken
export const source = cancelToken.source()


class Http {
    instance: AxiosInstance

    constructor() {
        const {access_token} = Auth.GetToken()
        
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_URL,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`   
            },
            cancelToken: source.token
        })

        

        this.instance.interceptors.request.use(options => {
            const {access_token} = Auth.GetToken()
            options.headers.Authorization = `Bearer ${access_token}`
            return options
        }, error => {



            return Promise.reject(error)
        })

        this.instance.interceptors.response.use( async res => {
            const {url} = res.config
            if (url === "/identityservice/connect/token") {
                const authenticate = res.data as Authenticate
                Auth.SaveToken(authenticate)
            }
            if (url === "Auth/logout") {
               
            }
            return res
        }, error => {
            if (error?.response?.status === 401) {
                store.dispatch(setAuthenticate(false));
                store.dispatch(setIsConfirm(false));
            }


            return Promise.reject(error)
        })

    }
}

export default new Http().instance