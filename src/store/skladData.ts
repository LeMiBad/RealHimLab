import { sortProductPairsByNames, splitArr } from './../utils/parsers';
import { ISalePrice } from './../types/types';
import axios from "axios";
import { createEvent, createStore } from "effector";
import { createEffect } from 'effector'
import { CategoryObject, IAcces, ICategory, IProduct, ISalePoint } from "../types/types";
import { API } from '../utils/api';



// Cash
interface ICachedCategory {
    [category: string]: any;
}

const cashedCategory: ICachedCategory = {};
// Cash

export const setAccId = createEvent<string>()
export const $accId = createStore('')
    .on(setAccId, (_, id) => id)


const initialAcces = { access_token: '', account_id: '', org_name: '' }

export const getShopAcces = createEffect(async (id: string) => {
    const url = `${API.path}optimiser/2.0/apps/shop_info/${id}`
    const data = await axios(url)
    setAccId(data.data.account_id)
    return data.data
})

export const $acces = createStore<IAcces>(initialAcces)
    .on(getShopAcces.done, (state, { result }) => result)


export const getSalePoints = createEffect(async (clientId: string) => {
    const config = API.configs.get()

    const url = `${API.path}optimiser/2.0/apps/configure/${clientId}`
    const data = await axios(url, config)
    return {sklads: data.data.current_sklad_id, skladSync: data.data.allow_sync_sklad}
})

export const $salePoints = createStore<{sklads: ISalePoint[], skladSync: boolean}>({sklads: [], skladSync: false})
.on(getSalePoints.done, (_, { result }) => result)


export const getCategories = createEffect(async (clientId: string) => {
    const config = API.configs.get()

    const url = `${API.path}optimiser/2.0/apps/configure/${clientId}`
    const data = await axios(url, config)
    // allow_sync_sklad = data.data.allow_sync_sklad
    const categoriesParse = ({folders, current_folder_id}: { folders: ICategory[], current_folder_id: ICategory[] }) => {

        const slashCounter = (url: string) => (url.match(/\//g) || []).length

        const findChild = (name: string, padding: number) => {
            const final: CategoryObject[] = []
            folders.forEach((cat: ICategory) => {
                if(cat.folder_name.includes(name+'/') && slashCounter(cat.folder_name) === slashCounter(`${name}/`)) final.push({
                    padding: padding+1,
                    category: cat,
                    child: findChild(cat.folder_name, padding+1)
                })
            })
            return final.length? final : null
        }

        const foldersName = current_folder_id.map((cat: ICategory) => {
            return {
                padding: 0,
                category: cat,
                child: findChild(cat.folder_name, 0)
            }
        })

        return foldersName
    }

    return categoriesParse({folders: data.data.folders, current_folder_id: data.data.current_folder_id})
})

export const $categories = createStore<CategoryObject[]>([])
    .on(getCategories.done, (_, { result }) => result)


export const setAllowSyncSklad = createEffect(async (clientId: string) => {
    const config = API.configs.get()

    const url = `${API.path}optimiser/2.0/apps/configure/${clientId}`
    const data = await axios(url, config)

    return data.data.allow_sync_sklad
})

export const $allow_sync_sklad = createStore<boolean>(false)
    .on(setAllowSyncSklad.done, (_, { result }) => result)

    
    export const getProducts = createEffect(async ({acces, category, saleDot}: {acces: string, category: string | CategoryObject[], saleDot: any}) => {
        const config = API.configs.get(acces)
        let urls: any[]
        let Allcategories: string
        
        
        if(typeof category !== 'string') {
            const caters = splitArr(category.map(cat => `pathName=${cat.category.folder_name};`), category.length < 16? 1 : Math.round(category.length/20)).map(spl => spl.join(''))
            
        
            urls = caters
            Allcategories = category.map(cat => `pathName=${cat.category.folder_name};`).join('')
        }
        else {
            urls = ['pathName=' + category]
            Allcategories = 'pathName=' + category
        }
        
        
        if (cashedCategory[Allcategories]) return cashedCategory[Allcategories]
        
        const result: any = []
        let beetweenArr: any = []

        const data = await Promise.all(urls.map(url => axios.get(`${API.path}remap/1.2/entity/product?filter=${url}`, config)))

        data.forEach(row => {
            row.data.rows.forEach((product: IProduct, i: number, arr: IProduct[]) => {
                let currentPrice: ISalePrice = product.salePrices[0]
                product.salePrices.forEach(priceObj => {
                    if(priceObj.priceType.name === saleDot.current_price_type.price_name) {
                        currentPrice = priceObj
                    }
                })


                if(saleDot.current_price_type.price_id  === 'minimal_price') {
                    product.salePrices[0].value = product.minPrice.value / 100
                }
                else {
                    product.salePrices[0].value = currentPrice.value / 100
                }

                beetweenArr.push(product)


                if(beetweenArr.length === 2) {
                    result.push(beetweenArr)
                    beetweenArr =[]
                }
                else if(beetweenArr.length === 1 && i === arr.length-1) {
                    result.push([product, null])
                }
            })
        })

        
        cashedCategory[Allcategories] = sortProductPairsByNames(result)
        return sortProductPairsByNames(result)
    })
    


export const $products = createStore<IProduct[] | null>(null)
    .on(getProducts.done, (state, { result }) => result)