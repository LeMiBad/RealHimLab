import { createEvent, createStore } from "effector";




const initialTgInfo = {
    dark: false,
    desktop: false,
    tgUserName: '',
    tgNickName: ''
}


export const darkThemeEnabler = createEvent()
export const desktopEnabler = createEvent()
export const setTgUserName = createEvent<string>()
export const setTgNickName = createEvent<string>()
export const $tgInfo = createStore(initialTgInfo)
    .on(darkThemeEnabler, state => {
        return { ...state, dark: true }
    })
    .on(desktopEnabler, state => {
        return { ...state, desktop: true }
    })
    .on(setTgUserName, (state, name) => {
        return { ...state, tgUserName: name }
    })
    .on(setTgNickName, (state, name) => {
        return { ...state, tgNickName: name }
    })