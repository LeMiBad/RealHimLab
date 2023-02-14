import { useStore } from "effector-react"
import { useEffect } from "react"
import { $category, setCategory } from "../../store/pickedCategory"
import { $pickedSaleDot } from "../../store/pickedSaleDot"
import { $acces, $categories, getCategories, getProducts } from "../../store/skladData"




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
        if(saleDot) getProducts({acces: access_token, category: activeCategory? activeCategory.category.folder_name : categories, saleDot})
    }, [access_token, activeCategory, categories, saleDot])
    
    return {saleDot, categories, access_token}
}

export default useBurgerUtils