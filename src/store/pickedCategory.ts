import { createEvent, createStore } from "effector";
import { CategoryObject } from "../types/types";


export const setCategory = createEvent<CategoryObject | null>()
export const $category = createStore<CategoryObject | null>(null)
    .on(setCategory, (_, category) => category)
