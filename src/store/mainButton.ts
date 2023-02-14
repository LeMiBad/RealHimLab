import { createEvent, createStore } from "effector";

const initialMainButton = {
    text: '',
    func: () => {
        // do nothing
    } ,
    showed: false
}

export const setMainButton = createEvent<{text: string, func: () => {}, showed: boolean}>()
export const $mainButton = createStore(initialMainButton)
    .on(setMainButton, (_, button) => button)