import { createEvent, createStore } from "effector";




export const setLazyLoad = createEvent<number>()
export const clearLazyLoad = createEvent()
export const $lazyLoad = createStore(1)
    .on(setLazyLoad, (_, i) => i)
    .on(clearLazyLoad, (_) => 1)