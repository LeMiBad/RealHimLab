import { useStore } from "effector-react"
import styled from "styled-components"
import useOpen from "../../hooks/useOpeningSwitcher"
import { setLazyLoad } from "../../store/lazyLoadIndex"
import { getProducts } from "../../store/skladData"
import { $tgInfo } from "../../store/tgData"
import ArrowIcon from "../Ui/ArrowIcon/ArrowIcon"
import useBurgerUtils from "./useBurgerUtils"
import { setCategory } from "../../store/pickedCategory"
import CategoryItem from "../CategoryItem/CategoryItem"
import { getChildsFolders } from "../../utils/parsers"


const BurgerMenuWrapper = styled.div<{dark: boolean}>`
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 400;
    animation: burgerOpen 0.3s forwards;
    padding-bottom: 5vh;
    box-sizing: border-box;
    background-color: ${props => props.dark? 'black' : 'white'};
    overflow-y: scroll;
`

const BurgerHeader = styled.div<{dark: boolean}>`
    width: 100%; 
    height: 8%; 
    display: flex; 
    align-items: center;
    justify-content: space-between;
    padding: 1% 3% 1% 3%;
    box-sizing: border-box;
    border-bottom: 0.4px solid ${props => props.dark? 'white' : 'black'};
    color: ${props => props.dark? 'white' : 'black'};
`

const CategoryWrapper = styled.div`
    min-height: 100%;
    width: 100%;
    padding: 5%;
    box-sizing: border-box;
`

const StyledCategoryItem = styled.h1<{dark: boolean}>`
    color: ${props => props.dark? 'white' : 'black'};
    margin-bottom: 14px;
    font-size: 18px;
    margin: 0;
`

const Burger = () => {
    const {openState, switchHandler} = useOpen()
    const {dark} = useStore($tgInfo)
    const {saleDot, categories, access_token} = useBurgerUtils()
    

    const pickAllProducts = () => {
        if(categories.length) {
            switchHandler()
            setLazyLoad(1)
            setCategory(null)
            if(saleDot) {
                const final: any = []

                categories.forEach(cat => {
                    final.push(...getChildsFolders(cat))
                })
            
                getProducts({acces: access_token, category: final, saleDot})
            }
        }
    }


    return (
        <>
            <svg onClick={switchHandler} style={{width: 30, height: 30}} viewBox="0 0 32 32" ><defs></defs><title/><g data-name="Layer 2" id="Layer_2"><path style={{fill: dark? 'white' : 'black'}} d="M28,10H4A1,1,0,0,1,4,8H28a1,1,0,0,1,0,2Z"/><path style={{fill: dark? 'white' : 'black'}} d="M28,17H4a1,1,0,0,1,0-2H28a1,1,0,0,1,0,2Z"/><path style={{fill: dark? 'white' : 'black'}} d="M28,24H4a1,1,0,0,1,0-2H28a1,1,0,0,1,0,2Z"/></g><g id="frame"><rect style={{fill: 'none'}} height="32" width="32"/></g></svg>
            {openState? 
                <BurgerMenuWrapper dark={dark}>
                    <BurgerHeader dark={dark}>
                        <ArrowIcon func={switchHandler}></ArrowIcon>
                        <h1 style={{fontSize: 30}}>Категории</h1>
                    </BurgerHeader>
                    <CategoryWrapper>
                        <div onClick={() => {pickAllProducts()}} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15}}>
                            <StyledCategoryItem dark={dark}>Все товары</StyledCategoryItem> 
                        </div>
                        {categories.map((cat) => {
                            return <CategoryItem key={cat.category.folder_id} switchHandler={switchHandler} cat={cat}/>
                        })}
                    </CategoryWrapper>
                </BurgerMenuWrapper>
            : 
                null
            }
        </>
    )
}

export default Burger