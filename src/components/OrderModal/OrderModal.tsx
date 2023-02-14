import axios from "axios"
import { useStore } from "effector-react"
import { useState } from "react"
import PhoneInput from "react-phone-input-2"
import styled, { keyframes } from "styled-components"
import { $basket } from "../../store/basket"
import { $pickedSaleDot } from "../../store/pickedSaleDot"
import { $acces } from "../../store/skladData"
import { $tgInfo } from "../../store/tgData"
import 'react-phone-input-2/lib/style.css'
import Loader from "../Ui/Loader/Loader"
import { Controller, useForm } from "react-hook-form"
import { IForm } from "./form"


interface OrderModalProps {
    modalHandler: () => void
}

const openModal = keyframes`
    0% {
        bottom: -100%;
    }
    
    100%{
        bottom: 0;
    }
`

const Wrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;   
    animation: ${openModal} 0.3s forwards;
    z-index: 304;
    display: flex;
    flex-direction: column;
`

const Modal = styled.form<{dark: boolean, focus: boolean}>`
    background-color: ${props => props.dark? 'white' : 'black'};
    width: 100%;
    transition: 0.3s;
    height: ${props => props.focus? "600%" : "100%"};   
    display: flex;
    z-index: 302;
    justify-content: flex-start;
    flex-direction: column;
    padding: 10% 10%;
    box-sizing: border-box;
    gap: 5%;
    position: relative;
`

const Input = styled.input`
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
`

const MainButton = styled.button<{dark: boolean, warning?: boolean, focus?: boolean}>`
    ${props => !props.focus? 'position: fixed;' : ''}
    width: 100%;
    padding: 2.5vh 0;
    z-index: 300;
    bottom: -1px;
    font-size: 16px;
    border: 0;
    outline: none;
    cursor: pointer;
    left: 0;
    background-color: ${props => props.warning? 'red' : props.dark? 'white' : 'black'};
    color: ${props => props.dark? 'black' : 'white'};
`

const OrderModal: React.FC<OrderModalProps> = ({modalHandler}) => {
    const {dark, tgUserName, tgNickName} = useStore($tgInfo)
    const sklad = useStore($pickedSaleDot)
    const {access_token} = useStore($acces)
    const basket = useStore($basket)
    const [focus, setFocus] = useState(false)    
    const tg = window.Telegram.WebApp
    const {desktop} = useStore($tgInfo)
    const [isEnd, setIsEnd] = useState(false)
    const [validate, setValidate] = useState(false)
    const {register, control, getValues} = useForm<IForm>({defaultValues: {phone: '', name: tgUserName}})


    const accepHandler = async () => {
        setIsEnd(true)
        const configForAgent = {
            method: 'post',
            url: "https://www.mc.optimiser.website/api/agent_id",
            headers: { 
                'Authorization': `Bearer ${access_token}`, 
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "token": access_token,
                "phone": getValues('phone').replace(/[^\d]/g, ''),
                "tg_username": tgNickName,
                "name": getValues('name')
            })
        }
        
        const agent = await axios(configForAgent)
        
        
        const org = await axios('https://www.mc.optimiser.website/api/remap/1.2/entity/organization', {
            headers: {"Authorization": `Bearer ${access_token}`}
        })
        
        const body = JSON.stringify({
            "organization": {
                "meta": {
                    "href": `https://online.moysklad.ru/api/remap/1.2/entity/organization/${org.data.rows[0].id}`,
                    "type": "organization",
                    "mediaType": "application/json"
                }
            },
            "agent": {
                "meta": {
                    "href": `https://online.moysklad.ru/api/remap/1.2/entity/counterparty/${agent.data.agent_id}`,
                    "type": "counterparty",
                    "mediaType": "application/json"
                }
            },
            "store": {
                "meta": {
                    "href": `https://online.moysklad.ru/api/remap/1.2/entity/store/${sklad? sklad.sklad_id : ''}`,
                    "type": "store",
                    "mediaType": "application/json"
                }
            },
            "positions": basket.map(prod => {
                const type = typeof prod.data.variantsCount === 'number'? "product" : "variant"
                
                return {
                    "quantity": prod.counter,
                    "price": prod.data.salePrices[0].value * 100,
                    "discount": 0,
                    "vat": 0,
                    "assortment": {
                        "meta": {
                            "href": `https://online.moysklad.ru/api/remap/1.2/entity/product/${prod.data.id}`,
                            "type": type,
                            "mediaType": "application/json"
                        }
                    }
                }
            }),
            "shipmentAddress": getValues('location'),
            "description": `Имя клиента: ${getValues('name')}\nНомер телефона: ${getValues('phone').replace(/[^\d]/g, '')}\nКомментарий: ${getValues('desk')}`
        })
        const config = {
            method: 'post',
            url: "https://www.mc.optimiser.website/api/create_order",
            headers: { 
                'Authorization': `Bearer ${access_token}`, 
                'Content-Type': 'application/json'
            },
            data: body
        }
        
        
        const order = await axios(config)
        
        tg.sendData(JSON.stringify({order: order.data.id, acces: access_token}))
        tg.close()
    }
    
    const validateInputs = () => setValidate(getValues('phone').length > 9 && getValues('name').length > 0)
    
    const focusHandler = () => {
        if(!desktop) setFocus(true)
    }
    const unFocusHandler = () => {
        if(!desktop) setFocus(false)
    }
    
    if(isEnd) return (
        <Wrapper>
            <div onClick={modalHandler} style={{backgroundColor: 'white',width: '100%', height: '100%'}}>
                <Loader/>
            </div>
        </Wrapper>
    )


    return (
        <>
            <Wrapper>
                <div onClick={modalHandler} style={{width: '100%', height: '60%'}}></div>
                <Modal focus={focus} dark={dark} onChange={validateInputs} style={{width: '100%'}}>
                    <Input {...register('name')} onFocus={focusHandler} onBlur={unFocusHandler} placeholder="Имя"></Input>
                    <Controller
                        control={control}
                        name="phone"
                        rules={{ required: true }}
                        render={({ field: { ref, onBlur, ...field } }) => (
                            <PhoneInput
                                onFocus={focusHandler} 
                                onBlur={unFocusHandler}
                                {...field}
                                inputProps={{
                                    ref,
                                    required: true,
                                    autoFocus: true
                                }}
                                country={"ru"}
                                specialLabel={"Player Mobile Number"}
                            />
                        )}
                    />
                    <Input {...register('desk')} onFocus={focusHandler} onBlur={unFocusHandler} placeholder="Коментарий (необязательно)"></Input>
                    <Input {...register('location')} onFocus={focusHandler} onBlur={unFocusHandler} placeholder={'Адрес доставки'}></Input>
                    {validate? <MainButton focus={focus} onClick={accepHandler} dark={dark}>Оформить</MainButton>
                    : <MainButton warning={true} focus={focus} dark={dark}>Оформить</MainButton>}
                </Modal>
            </Wrapper>
        </>
    )
}

export default OrderModal