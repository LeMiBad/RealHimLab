import axios from "axios"
import { useEffect, useState } from "react"
import { IProduct } from "../../types/types"
import useAxiosConfig from "../../hooks/useAxiosConfig"
import { useStore } from "effector-react"
import { $pickedSaleDot } from "../../store/pickedSaleDot"
import { $categories } from "../../store/skladData"
import { сategoriesParse } from './../../utils/parsers'


const useFindProducts = () => {
    const [req, setReq] = useState('')
    const config = useAxiosConfig()
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
            const categoryPath = сategoriesParse(allCategories).map(category => `pathName=${category.folder_name};`).join(';')
            axios(`https://www.mc.optimiser.website/api/remap/1.2/entity/product?search=${req}&filter=${categoryPath}`, config)
                .then((data) => {
                    const products = data.data.rows.map((prod: IProduct) => {
                        if (saleDot && saleDot.current_price_type && saleDot.current_price_type.price_id === 'minimal_price') {
                            prod.salePrices[0].value = prod.minPrice.value / 100
                        }
                        return prod
                    })

                    setFilted(products)
                    setIsLoading(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [req])



    return { req, setReq, filted, isLoading }
}

export default useFindProducts