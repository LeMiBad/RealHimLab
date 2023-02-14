import { useStore } from "effector-react"
import styled, { createGlobalStyle } from "styled-components"
import Burger from "../Burger/Burger"
import { $tgInfo } from "../../store/tgData"
import BasketIconButton from "../BasketIconButton/BasketIconButton"
import FindPanel from "../FindPanel/FindPanel"
import { $category } from "../../store/pickedCategory"
import { categoryNameParser } from "../../utils/parsers"


const StyledBody = createGlobalStyle<{dark: boolean}>`
    body {
        background-color: ${props => props.dark? 'black' : "white"};
    }
`

const StyledHeader = styled.div<{dark: boolean}>`
    width: 100%;
    margin: 0 auto;
    position: fixed;
    z-index: 10;
    top: 0;
    gap: 10px;
    padding: 3% calc(5% + 8px) 0 5%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    background-color: ${props => props.dark? 'black' : "white"};
`

const StyledHeaderSection = styled.div`
    display: flex;
`

const Header = () => {
    const {dark} = useStore($tgInfo)
    const cat = useStore($category)


    return <>
        <StyledBody dark={dark}></StyledBody>
        <StyledHeader dark={dark}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 10}}>
                <Burger/>
                <h1 style={{color: dark? 'white' : 'black', fontSize: 18}}>{cat? cat.category.user_folder_name? cat.category.user_folder_name : categoryNameParser(cat.category.folder_name, cat? cat.padding : 0) : 'Все товары'}</h1>
            </div>
            <StyledHeaderSection>
                <FindPanel/>
                <BasketIconButton/>
            </StyledHeaderSection>
        </StyledHeader>
    </>
}

export default Header