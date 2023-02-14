import { useStore } from "effector-react"
import { useState } from "react"
import styled from "styled-components"
import { setLazyLoad } from "../../store/lazyLoadIndex"
import { setCategory } from "../../store/pickedCategory"
import { $pickedSaleDot } from "../../store/pickedSaleDot"
import { $acces, getProducts } from "../../store/skladData"
import { $tgInfo } from "../../store/tgData"
import { CategoryObject } from "../../types/types"
import { categoryNameParser } from "../../utils/parsers"
import ArrowIcon from "../Ui/ArrowIcon/ArrowIcon"


const StyledCategoryItem = styled.h1<{dark: boolean, padding: number}>`
    color: ${props => props.dark? 'white' : 'black'};
    padding-left: ${props => props.padding*10}px;
    margin-bottom: 14px;
    font-size: 18px;
    margin: 0;
`


const CategoryItem: React.FC<{cat: CategoryObject, switchHandler: () => void}> = ({cat, switchHandler}) => {
    const {dark} = useStore($tgInfo)
    const {access_token} = useStore($acces)
    const saleDot = useStore($pickedSaleDot)
    const [openState, setOpenState] = useState(false)

    const pickCategory = (category: CategoryObject) => {
        switchHandler()
        setCategory(category)        
        setLazyLoad(1)
        if(saleDot) getProducts({acces: access_token, category: category.category.folder_name, saleDot})
    }


    return (
        <>
            <div key={cat.category.folder_id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
                <StyledCategoryItem onClick={() => {pickCategory(cat)}} padding={cat.padding} dark={dark}>{cat.category.user_folder_name? cat.category.user_folder_name : categoryNameParser(cat.category.folder_name, cat.padding)}</StyledCategoryItem> 
                {cat.child? 
                    <div style={{transform: openState? 'rotate(270deg)' : 'rotate(180deg)', transition: '0.3s'}}><ArrowIcon func={() => {setOpenState(openState? false : true)}}></ArrowIcon></div> 
                : 
                    null
                }
            </div>
            {openState && cat.child? 
                cat.child.map((categ, index) => <CategoryItem switchHandler={switchHandler} key={cat.category.folder_id + index} cat={categ} />)
            : 
                null
            }
        </>
    )
}

export default CategoryItem