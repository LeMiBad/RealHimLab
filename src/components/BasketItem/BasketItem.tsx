import { useStore } from "effector-react"
import styled from "styled-components"
import BusketDelete from "../Ui/BusketDelete/BusketDelete"
import { addBasketItem, deleteBasketItem, deleteBasketItems, IBasket } from "../../store/basket"
import useProductImages from "../../hooks/useImages"
import { $tgInfo } from "../../store/tgData"
import LoadImage from "../Ui/LoadImage/LoadImage"
import NotAImage from "../Product/NotImage"
import useValute from "../../hooks/useValute"


interface BasketItemProps {
    data: IBasket 
    i: number
}

const StyledBasketItem = styled.div<{dark: boolean}>`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    max-height: 100%;
    box-shadow: 8px 8px 11px ${props => props.dark? "#ffffff40" : "#00000040"};
    border-radius: 10px;
    margin-bottom: 20px;
`

const StyledBasketImg = styled.img`
    width: 20vw;
    height: 20vw;
    border-radius: 10px;
    margin-right: 10px  ;
`

const StyledBasketProps = styled.div<{dark: boolean}>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    color: ${props => props.dark? 'white' : 'black'};
`

const StyledActionButtons = styled.div<{dark: boolean}>`
    width: 25%;
    background-color: ${props => props.dark? 'white' : 'black'};
    display: flex;
    flex-direction: column;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    div:nth-child(2) {
        border-top: 0.4px solid ${props => props.dark? 'black' : 'white'};
        border-bottom: 0.4px solid ${props => props.dark? 'black' : 'white'};
    }
`

const ActionWrapper = styled.div<{height: string, dark: boolean, red?: boolean}>`
    height: ${props => props.height}%;
    color: ${props => props.dark? 'black' : 'white'};
    ${props => props.red? 'background-color: rgb(242,18,71)' : ''};
    font-size: 38px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`


const BasketItem: React.FC<BasketItemProps> = ({ data, i }) => {
    const {dark} = useStore($tgInfo)
    const {images, isLoading} = useProductImages(data.data)
    const valute = useValute(data.data)    

    return <StyledBasketItem dark={dark}>
        <div style={{display: 'flex', alignItems: "center", gap: 5}}>
            {isLoading? 
                <LoadImage/>
                : 
                images[0]? 
                    <StyledBasketImg src={images[0]}/>
                : 
                    <div style={{width: '20vw', padding: 5, boxSizing: 'border-box'}}><NotAImage/></div>
            }
            <StyledBasketProps dark={dark}>
                <div style={{marginTop: "10px", fontSize: 16, fontWeight: 500, width: '170px', wordWrap: 'break-word'}}>{data.data.name}</div>
                <div>
                    <h4 style={{fontWeight: 400, fontSize: 14}}>Количество: {data.counter} шт</h4>
                    <h4 style={{fontWeight: 400, fontSize: 14}}>Цена/ед.товара {data.data.salePrices[0].value}₽</h4>
                </div>
                <h3 style={{marginBottom: "10px", fontWeight: 600}}>{+data.data.salePrices[0].value * data.counter} {valute}</h3>
            </StyledBasketProps>
        </div>
        <StyledActionButtons dark={dark}> 
            <ActionWrapper dark={dark} height="30" onClick={() => {deleteBasketItem(i)}}>-</ActionWrapper>
            <ActionWrapper dark={dark} height="30" onClick={() => {addBasketItem(data)}}>+</ActionWrapper>
            <ActionWrapper dark={dark} red={true} height="40" onClick={() => {deleteBasketItems(i)}}><BusketDelete/></ActionWrapper> 
        </StyledActionButtons>
    </StyledBasketItem>
}

export default BasketItem