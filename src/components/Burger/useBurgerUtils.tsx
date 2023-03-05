import { useStore } from "effector-react"
import { useEffect } from "react"
import { $category, setCategory } from "../../store/pickedCategory"
import { $pickedSaleDot } from "../../store/pickedSaleDot"
import { $acces, $categories, getCategories, getProducts } from "../../store/skladData"
import { getChildsFolders } from "../../utils/parsers"




const useBurgerUtils = () => {
    const activeCategory  = useStore($category)
    const {access_token, account_id} = useStore($acces)
    const saleDot = useStore($pickedSaleDot)
    const categories = useStore($categories)

    useEffect(() => {
        if(categories.length) setCategory(activeCategory ? activeCategory : null)
    }, [activeCategory, categories])

    useEffect(() => {
        if(account_id.length) {
            getCategories(account_id)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if(saleDot) {
            if(activeCategory) getProducts({acces: access_token, category: getChildsFolders(activeCategory), saleDot})
            else {
                const final: any = []

                categories.forEach(cat => {
                    final.push(...getChildsFolders(cat))
                })

                getProducts({acces: access_token, category: final, saleDot})
            }
        }
    }, [access_token, activeCategory, categories, saleDot])

    
    return {saleDot, categories, access_token}
}

export default useBurgerUtils