import { createEvent } from "effector";
import { useStore } from "effector-react";


const initialCashedValute: any = {}

interface addValuteAttr {
    url: string 
    valute: string
}

export const addValute = createEvent<addValuteAttr>() 
export const $cashedValute = useStore<any>(initialCashedValute)
    .on(addValute, (state: any, newOpt: any) => {
        const newState = {...state}
        newState[newOpt.url] = newOpt.valute
        return newState
    })