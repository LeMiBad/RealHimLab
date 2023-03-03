import axios from "axios"
import { useEffect, useState } from "react"
import { IProduct, ISalePrice } from "../../types/types"
import { useStore } from "effector-react"
import { $pickedSaleDot } from "../../store/pickedSaleDot"
import { $acces, $categories } from "../../store/skladData"
import { splitArr, сategoriesParse } from './../../utils/parsers'
import { API } from "../../utils/api"


const useFindProducts = () => {
    const [req, setReq] = useState('')
    const {access_token} = useStore($acces)
    const [isLoading, setIsLoading] = useState(true)
    const [filted, setFilted] = useState<IProduct[]>([])
    const saleDot = useStore($pickedSaleDot)
    const allCategories = useStore($categories)

    useEffect(() => {
        setIsLoading(true)

        
        if (req.length < 3) {
            setFilted([])
            return
        }
        else {
            const caters = splitArr(сategoriesParse(allCategories).map(cat => `pathName=${cat.folder_name};`).filter(str => str.includes(req)), allCategories.length < 11? 1 : 5).map(spl => spl.join(''))

            for(let i = 0; i < caters.length; i++) {
                axios(`${API.path}remap/1.2/entity/product?search=${req}&filter=${caters[i]}`, API.configs.get(access_token))
                .then((data) => {
                    const products = data.data.rows.map((product: IProduct) => {
                        let currentPrice: ISalePrice = product.salePrices[0]
                        product.salePrices.forEach(priceObj => {
                            if(saleDot && saleDot.current_price_type && priceObj.priceType.name === saleDot.current_price_type.price_name) {
                                currentPrice = priceObj
                            }
                        })


                        if(saleDot && saleDot.current_price_type && saleDot.current_price_type.price_id  === 'minimal_price') {
                            product.salePrices[0].value = product.minPrice.value / 100
                        }
                        else {
                            product.salePrices[0].value = currentPrice.value / 100
                        }
                        return product
                    })

                    setFilted(products)
                    setIsLoading(false)
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [req])



    return { req, setReq, filted, isLoading }
}

export default useFindProducts