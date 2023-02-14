import { createEvent, createStore } from "effector";
import { ISalePoint } from "../types/types";


export const pickSale = createEvent<ISalePoint>()
export const $pickedSaleDot = createStore<ISalePoint | null>(null)
    .on(pickSale, (_, sklad) => sklad)