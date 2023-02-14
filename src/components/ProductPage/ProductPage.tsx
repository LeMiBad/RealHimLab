import { useStore } from "effector-react"
import styled, { keyframes } from "styled-components"
import ArrowIcon from "../Ui/ArrowIcon/ArrowIcon"
import useProductImages from "../../hooks/useImages"
import { $ProductPage, setCurVariant } from "../../store/ProductPage"
import { $tgInfo } from "../../store/tgData"
import BigArrow from "../Ui/BigArrow/BigArrow"
import { useState } from "react"
import BasketIconButton from "../BasketIconButton/BasketIconButton"
import LoadImage from "../Ui/LoadImage/LoadImage"
import NotAImage from "../Product/NotImage"
import Variant from "./Variant"
import useValute from "../../hooks/useValute"


interface IProps {
    exit: () => void
}

const enter = keyframes`
    0% {
        left: -100%;
    }

    100% {
        left: 0;
    }
`


const Wrapper = styled.div<{dark: boolean}>`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    width: 100%;
    height: 90%;
    background-color: ${props => props.dark? 'black' : 'white'};
    padding: 5% 5% 10% 5%;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    animation: ${enter} 0.2s forwards;
`

const Navbar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    box-sizing: border-box;
`

const ImgWrapper = styled.div`
    width: 100%;
    height: 35vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding-bottom: 10px;
    img {
        width: 65vw;
        height: 65vw;
        border-radius: 30px;
    }
`

const InfoWrapper = styled.div`
    margin-top: 4px;
    margin-left: -6%;
    padding: 0 5%;
    width: 112%;
    box-sizing: border-box;
`

const NameWrapper = styled.div<{dark: boolean}>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
        color: ${props => props.dark? 'white' : 'black'};
        font-size: 24px;
        font-weight: 600;
    }
    h2 {
        font-size: 20px;
        color: ${props => props.dark? 'white' : 'black'};
    }
`

const VariantsWrapper = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
    overflow-x: scroll;
    margin: 0 0 30px 0;
`


const ArrowWrapper = styled.div<{dark: boolean}>`
    min-width: 30px;
    min-height: 30px;
    border-radius: 50px;
    background-color: ${props => props.dark? 'white' : 'black'};
    display: flex;
    justify-content: center;
    align-items: center;
`

const ProductPage: React.FC<IProps>  = ({exit}) => {
    const {dark} = useStore($tgInfo)
    const {products, curVariant} = useStore($ProductPage)
    const {images, isLoading} = useProductImages(products[curVariant], curVariant? true : false)
    const [{imgIndex}, setCurImg] = useState<{imgIndex: number, slideState: string}>({imgIndex: 0, slideState: 'left'})
    const valute = useValute(products[curVariant])

    const rightSlide = () => {
        if(imgIndex+1 === images.length) {
            setCurImg({imgIndex: imgIndex+1, slideState: 'right'})
        }
        else setCurImg({imgIndex: imgIndex+1, slideState: ''})
    }

    const leftSlide = () => {
        if(imgIndex === 1 || imgIndex === 0) {
            setCurImg({imgIndex: 0, slideState: 'left'})
        }
        else {
            setCurImg({imgIndex: imgIndex-1, slideState: ''})
        }
    }


    return  <>
        <Wrapper dark={dark}>
            <Navbar style={{display: 'flex', justifyContent: 'space-between'}}>
                <ArrowIcon func={exit}/>
                <BasketIconButton/>
            </Navbar>
            <ImgWrapper>
                {imgIndex? <ArrowWrapper onClick={leftSlide} dark={dark}>
                    <BigArrow left/>
                </ArrowWrapper> : <div style={{width: 50, height: 50}}></div>}
                { isLoading? 
                    <LoadImage/>
                : 
                    images[imgIndex]? <img src={images[imgIndex]} alt="Изображение отсутствует" /> : <NotAImage></NotAImage>
                }
                {imgIndex < images.length-1? <ArrowWrapper onClick={rightSlide} dark={dark}>
                        <BigArrow/>
                    </ArrowWrapper> : <div style={{width: 50, height: 50}}></div>
                }
            </ImgWrapper>
            <InfoWrapper>
                <NameWrapper dark={dark}>
                    <h1>{products[curVariant].name}</h1>
                    <h2>{products[curVariant].salePrices[0].value} {valute}</h2>
                </NameWrapper>
                {(products.length > 1)? <h1 style={{color: dark? 'white' : 'black', fontSize: 18, margin: '10px 0 10px 0'}}>Выберите тип</h1> : null}
                <VariantsWrapper>
                    {(products.length > 1)? 
                        products.map((prod, i) => <Variant key={prod.id} setCurVariant={setCurVariant} index={i} product={products[i]}/>)
                    : 
                        null
                    }
                </VariantsWrapper>
                <h1 style={{fontSize: '22px', margin: '15px 0 10px 0', fontWeight: 500, color: dark? 'white' : 'black'}}>Описание</h1>
                <p style={{color: dark? 'white' : 'black'}}>{products[0].description}</p>
            </InfoWrapper>
        </Wrapper>
    </>
}

export default ProductPage