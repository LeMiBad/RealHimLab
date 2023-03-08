import axios from "axios"
import { useStore } from "effector-react"
import { useEffect, useState } from "react"
import MainButton from "../components/MainButton/MainButton"
import OrderModal from "../components/OrderModal/OrderModal"
import Tost from "../components/Product/Tost"
import { $basket, addBasketItem } from "../store/basket"
import { $pageId } from "../store/pages"
import { $pickedSaleDot } from "../store/pickedSaleDot"
import { $ProductPage } from "../store/ProductPage"
import { $allow_sync_sklad } from "../store/skladData"
import useAxiosConfig from "./useAxiosConfig"
import usePage from "./usePage"
import useTost from "./useTost"




const useMainButton = () => {
    const pageId = useStore($pageId)
    const basket = useStore($basket)
    const [modal, setModal] = useState(false)
    const {products, curVariant} = useStore($ProductPage)
    const saleDot = useStore($pickedSaleDot)
    const [exist, setExist] = useState(true)
    const {toBasket, toProductList} = usePage()
    const allowSync = useStore($allow_sync_sklad)
    const {tost, setTost} = useTost()
    const config = useAxiosConfig()

    const basketSum = basket.reduce((acc, item) => {
        return acc + +item.data.salePrices[0].value * item.counter
    }, 0)

    const modalHandler = () => setModal(modal? false : true)

    if(allowSync) {
        if(products[curVariant].id.length) {
            const url = `https://www.mc.optimiser.website/api/remap/1.2/report/stock/bystore/current?filter=assortmentId=${products[curVariant].id};storeId=${saleDot? saleDot.sklad_id : ''}`
            axios(url, config)
            .then(data => {
                if(data.data.length) {
                    if(data.data[0].stock < 0) {
                        setExist(false)
                    }
                    else {
                        setExist(true)
                    }
                }
                else {
                    setExist(false)
                }
            })
        }
    }

    useEffect(() => {
        setTost([''])
    }, [products, setTost])


    if(pageId === 1) {
        if(basket.length) return <MainButton func={toBasket}>{`Оформить заказ`}</MainButton>
        else return null
    }
    else if(pageId === 2) {
        if(basket.length) return <>
            {modal? <OrderModal modalHandler={modalHandler}/> : null}
            <MainButton func={() => {modalHandler();toBasket()}}>{`Перейти к оформлению`}</MainButton>
        </>
        else return <MainButton func={toProductList}>Назад к товарам</MainButton>
    }
    else if(pageId === 3 && products[curVariant] ) {
        if(products[curVariant].salePrices[0].value && exist) return <>
            <MainButton func={() => {
                setTost([...tost, products[curVariant].name])
                addBasketItem({
                    data: products[curVariant],
                    counter: 1
                })
            }}>{`Добавить в корзину`}</MainButton>
            {tost.map((tost, i) => tost.length? <Tost key={i}>{tost}</Tost> : null)}
        </>
        else return <MainButton func={toProductList}>Товара нет в наличии</MainButton>
    }
}

export default useMainButton