import { useStore } from "effector-react"
import styled from "styled-components"
import useFindProducts from "./useFindProducts"
import useOpen from "../../hooks/useOpeningSwitcher"
import usePage from "../../hooks/usePage"
import FinderIcon from "../Ui/FinderIcon/FinderIcon"
import { $pickedSaleDot } from "../../store/pickedSaleDot"
import { productUpdate } from "../../store/ProductPage"
import { $acces } from "../../store/skladData"
import { $tgInfo } from "../../store/tgData"
import { IProduct } from "../../types/types"
import ArrowIcon from "../Ui/ArrowIcon/ArrowIcon"



const Wrapper = styled.div<{dark: boolean}>`
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    position: absolute;
    background-color: ${props => props.dark? 'white' : '#0000005e'};
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 5vh;
    box-sizing: border-box;
`

const Input = styled.input<{dark: boolean}>`
    height: 100%;
    width: 100%;
    border: 0;
    outline: none;
    background-color: ${props => props.dark? 'black' : 'white'};
    color: ${props => props.dark? 'white' : 'black'};
    padding: 0 0 0 10px;
    border-radius: 10px 10px 10px 10px;
    box-sizing: border-box;
    z-index: 11;
`

const FindetItemsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: -10px;
    overflow-y: scroll;
    max-height: 80%;
    width: 90%;
`

const FindetItem = styled.div`
    width: 100%;
    padding: 10px 0 10px 10px;
    box-sizing: border-box;
    background-color: white;
    border-top: 1px solid black;
`

const NotFound = styled.div`
    width: 100%;
    padding: 10px 0 10px 10px;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    justify-content: center;
`


const FindPanel = () => {
    const {switchHandler, openState} = useOpen()
    const {req, setReq, filted, isLoading} = useFindProducts()
    const {dark} = useStore($tgInfo)
    const {toProductPage} = usePage() 
    const saleDot = useStore($pickedSaleDot)
    const {access_token} = useStore($acces)

    const toProduct = (data: IProduct) => {
        productUpdate({acces: access_token, product: data, saleDot})
        toProductPage()
    }


    return (
        <>
            <FinderIcon func={switchHandler}></FinderIcon>
            {
                !openState? <></> : 
                <Wrapper dark={dark}>
                    <div style={{position: 'relative', height: '5%', width: '90%'}}>
                        <Input  dark={dark} autoFocus={true} value={req} onChange={(e) => setReq(e.currentTarget.value)}/>
                        <div onClick={switchHandler} style={{position: 'absolute', right: 0, top: 0, transform: 'scale(0.7)'}}><ArrowIcon/></div>
                    </div>
                    <FindetItemsWrapper>
                        {isLoading && req.length >= 3? <div style={{width: '100%', height: '300px', position: 'relative'}}><NotFound>Загрузка...</NotFound></div>
                        :
                        filted.length? 
                            filted.map((prod) => <FindetItem onClick={() => toProduct(prod)} key={prod.id}>{prod.name}</FindetItem>) 
                        : 
                            <NotFound>{`Ничего не ${req.length? 'найдено:)' : 'введено'}`}</NotFound>
                        }
                    </FindetItemsWrapper>
                </Wrapper>
            }
        </>
    )
}

export default FindPanel