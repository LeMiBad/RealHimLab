import { useStore } from "effector-react"
import { useEffect } from "react"
import styled from "styled-components"
import usePage from "../../hooks/usePage"
import { pickSale } from "../../store/pickedSaleDot"
import { $acces, $salePoints, getCategories, getSalePoints } from "../../store/skladData"
import { $tgInfo } from "../../store/tgData"
import { ISalePoint } from "../../types/types"
import Loader from "../Ui/Loader/Loader"


const StyledSalePointPicker = styled.div<{dark: boolean}>`
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: ${props => props.dark? 'black' : 'white'};
    position: fixed;
    padding: 10%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const StyledSalePointPickerItem = styled.div<{dark: boolean}>`
    color: ${props => props.dark? 'black' : 'white'};
    padding: 10px 0 10px 20px;
    box-sizing: border-box;
    font-size: 18px;
    background-color: ${props => props.dark? 'white' : 'black'};
    border-radius: 15px;
    position: relative;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    :hover div {
        background-color: ${props => props.dark? '#292929' : '#ffffff94'};;
    }
`

const StyledCrossContainer = styled.div<{dark: boolean}>`
    min-width: 35px;
    min-height: 35px;
    border-radius: 35px;
    margin-right: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.dark? 'black' : 'white'};
`


const SalePointPicker = () => {
    const {dark} = useStore($tgInfo)
    const {account_id} = useStore($acces)
    const {sklads} = useStore($salePoints)
    const {toProductList} = usePage()


    useEffect(() => {
        if(sklads.length === 1) {
            pickSale(sklads[0])
            toProductList()
        }
    })

    const pickSaleDot = (sklad: ISalePoint) => {
        pickSale(sklad)
        toProductList()
    }
    

    useEffect(() => {
        if(account_id.length) {
            getSalePoints(account_id)
            getCategories(account_id)
        }
    }, [account_id])

    

    return <>
        {sklads.length? 
        <>
            <StyledSalePointPicker dark={dark}>
                <h1 style={{color: dark? 'white' : 'black', textAlign: 'center', fontSize: '26px'}}>???????????????? ?????????? ????????????</h1>
                {sklads.map(({user_sklad_name}, i) => {
                    return  <StyledSalePointPickerItem key={user_sklad_name} onClick={() => {pickSaleDot(sklads[i])}} dark={dark}>
                                {user_sklad_name}
                                <StyledCrossContainer dark={dark}>
                                    <svg width="20" height="20" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.0607 13.0607C26.6464 12.4749 26.6464 11.5251 26.0607 10.9393L16.5147 1.3934C15.9289 0.807612 14.9792 0.807612 14.3934 1.3934C13.8076 1.97918 13.8076 2.92893 14.3934 3.51472L22.8787 12L14.3934 20.4853C13.8076 21.0711 13.8076 22.0208 14.3934 22.6066C14.9792 23.1924 15.9289 23.1924 16.5147 22.6066L26.0607 13.0607ZM0 13.5H25V10.5H0V13.5Z" fill={dark? 'white' : 'black'}></path></svg>
                                </StyledCrossContainer>
                            </StyledSalePointPickerItem>
                })}
            </StyledSalePointPicker>
        </> 
        : 
        <Loader/> 
        }
    </>
}

export default SalePointPicker