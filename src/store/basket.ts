import { IProduct } from '../types/types';
import { createEvent, createStore } from "effector";

export interface IBasket {
    data: IProduct
    counter: number
}

const initialBasket: IBasket[] = []



export const addBasketItem = createEvent<IBasket>()
export const deleteBasketItems = createEvent<number>()
export const deleteBasketItem = createEvent<number>()
export const $basket = createStore(initialBasket)
    .on(addBasketItem, (state, newBasketItem) => {
        let isHave = false
        for(let i = 0; i < state.length; i++) {
            if(`${state[i].data.name}${state[i].data.salePrices[0].value}` === `${newBasketItem.data.name}${newBasketItem.data.salePrices[0].value}`) {
                isHave = true
            }
        }

        let newState = []

        if(isHave) {
            newState = state.map(prod => {
                if(`${prod.data.name}${prod.data.salePrices[0].value}` === `${newBasketItem.data.name}${newBasketItem.data.salePrices[0].value}`) {
                    if(prod.counter) prod.counter += 1
                    return prod
                }
                else {
                    return prod
                }
            })
        }
        else {
            newState = [...state, {...newBasketItem, counter: 1}]
        }

        return newState
    })
    .on(deleteBasketItems, (state, index) => {
        state.splice(index, 1)
        return [...state]
    })
    .on(deleteBasketItem, (state, index) => {
        if(state[index].counter === 1) {
            state.splice(index, 1)
            return [...state]
        }
        else {
            state[index].counter -= 1
            return [...state] 
        }
    })