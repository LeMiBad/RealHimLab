import axios from "axios"
import { useStore } from "effector-react"
import { useEffect, useState } from "react"
import { $acces } from "../store/skladData"
import { IProduct } from "../types/types"
import useAxiosConfig from "./useAxiosConfig"
import { cashedValute, sizeStoreUpdate } from "../utils/cashedValute"
import { API } from "../utils/api"


const useValute = (data: IProduct | undefined) => {
    const {access_token} = useStore($acces)
    const [size, setSize] = useState('...')
    const config = useAxiosConfig()

    
    useEffect(() => {
        if(data && data.buyPrice.currency.meta.href.split('/')[8]) {
            const priceLink = `${API.path}remap/1.2/entity/uom/${data?.uom.meta.href.split('/')[8]}`
            if(cashedValute[priceLink]) setSize(cashedValute[priceLink])
            
            else axios(priceLink, config)
                .then((data) => {
                        sizeStoreUpdate({url: priceLink, size: data.data.name})
                        setSize(data.data.name)
                    })
        }
        else setSize('шт')
    }, [access_token, data, config])
    

    return size
}

export default useValute