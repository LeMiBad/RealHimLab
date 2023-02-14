import { useStore } from "effector-react"
import styled, { keyframes } from "styled-components"
import { $basket } from "../../store/basket"
import { $tgInfo } from "../../store/tgData"
import BasketItem from "../BasketItem/BasketItem"
import BasketIconButton from "../BasketIconButton/BasketIconButton"
import ArrowIcon from "../Ui/ArrowIcon/ArrowIcon"
import usePage from "../../hooks/usePage"
import { useEffect, useState } from "react"
import { setCurVariant } from "../../store/ProductPage"
import OrderModal from "../OrderModal/OrderModal"
import useValute from "../../hooks/useValute"


const enter = keyframes`
    0% {
        left: 100%;
    }
    
    100% {
        left: 0%;
    }
`

const StyledBasketWrapper = styled.div<{dark: boolean}>`
    position: fixed;
    width: 100%;
    left: 0;
    top: 0%;
    padding: 15px 10px 10px 10px;
    animation: ${enter} 0.2s linear forwards;
    box-sizing: border-box;
    background-color: ${props => props.dark? 'black' : 'white'};
`



const Basket = () => {
    const basket = useStore($basket)
    const {dark} = useStore($tgInfo)
    const {toProductList} = usePage()
    const [modal, setModal] = useState(false)
    const valute = useValute(basket.length? basket[0].data : undefined)

    const basketSum = basket.reduce((acc, item) => {
        return acc + +item.data.salePrices[0].value * item.counter
    }, 0)

    useEffect(() => {
        setCurVariant(0)
    }, [])


    const modalHandler = () => setModal(modal? false : true)

    return (
            <>
                {modal? <OrderModal modalHandler={modalHandler}/> : null}
                <StyledBasketWrapper dark={dark}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center', padding: '0 15px 10px 0'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                            <ArrowIcon func={toProductList}/>
                            {basket.length? <h1 style={{color: dark? 'white' : 'black', fontSize: 20}}>Итого: {basketSum} {valute}</h1> :
                            <h1 style={{color: dark? 'white' : 'black', fontSize: 20}}>Ваша корзина {basket.length? '' : 'пуста'}</h1>}
                        </div>
                        <BasketIconButton/>
                    </div>
                    <div style={{overflowY: 'scroll', height: '85vh', paddingTop: 10}}>
                        {basket.map((product, i) => {
                            return <BasketItem key={product.data.code} data={product} i={i}/>
                        })}
                    </div>
                </StyledBasketWrapper>
            </>
    )
}

export default Basket