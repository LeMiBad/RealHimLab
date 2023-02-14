import { useStore } from "effector-react"
import { $acces } from "../store/skladData"



const useAxiosConfig = () => {
    const {access_token} = useStore($acces)

    return {
        headers: {
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "Accept": "*/*",
            "Content-Type": "application/json",
            'Access-Control-Allow-Credentials': "true",
            "Authorization": `Bearer ${access_token}`
        },
    }
}

export default useAxiosConfig