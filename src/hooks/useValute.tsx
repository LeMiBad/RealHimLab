import axios from "axios"
import { useStore } from "effector-react"
import { useEffect, useState } from "react"
import { $acces } from "../store/skladData"
import { IProduct } from "../types/types"
import useAxiosConfig from "./useAxiosConfig"
import { cashedValute, valStoreUpdate } from "../utils/cashedValute"


const useValute = (data: IProduct | undefined) => {
    const {access_token} = useStore($acces)
    const [valute, setValute] = useState('...')
    const config = useAxiosConfig()

    
    
    useEffect(() => {
        if(data && data.buyPrice.currency.meta.href.split('/')[8]) {
            const priceLink = `https://www.mc.optimiser.website/api/remap/1.2/entity/currency/${data.salePrices[0].currency.meta.href.split('/')[8]}`
            if(cashedValute[priceLink]) setValute(cashedValute[priceLink])
            
            else axios(priceLink, config)
                .then((data) => {
                        valStoreUpdate({url: priceLink, valute: data.data.name})
                        setValute(data.data.name)
                    })
        }
        else setValute('руб')
    }, [access_token, data, config])
    

    return valute
}

export default useValute