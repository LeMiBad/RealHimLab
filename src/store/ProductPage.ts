import { ISalePoint } from './../types/types';
import axios from "axios";
import { createEffect, createEvent, createStore } from "effector";
import { IProduct } from "../types/types";


const initialProduct =  {
    accountId: '',
    archived: false,
    article: '',
    barcodes: [{
        ean13: ''
    }],
    buyPrice: {
        value: 1,
        currency: {
            meta: {
                href: '',
                mediaType: '',
                metadataHref: '',
                type: '',
                uuidHref: ''
            }
        }
    },
    code: '',
    country: {
        meta: {
            href: '',
            mediaType: '',
            metadataHref: '',
            type: '',
            uuidHref: ''
        }
    },
    description: '',
    discountProhibited: false,
    externalCode: '',
    files: {
        meta: {
            href: '',
            limit: 1,
            mediaType: '',
            offset: 1,
            size: 1,
            type: ''
        } 
    },
    group: {
        meta: {
            href: '',
            metadataHref: '',
            type: '',
            mediaType: ''
        }
    },
    id: '',
    images: {
        meta: {
            href: '',
            type: '',
            mediaType: '',
            size: 1,
            limit: 1,
            offset: 1
        }
    },
    isSerialTrackable: false,
    meta: {
        href: '',
        metadataHref: '',
        type: '',
        mediaType: '', 
        uuidHref: ''
    },
    minPrice: {
        value: 1,
        currency: {
            meta: {
                href: '',
                mediaType: '', 
                metadataHref: '',
                type: '',
                uuidHref: ''
            }
        }
    },
    name: '',
    owner: {
        meta: {
            href: '',
            mediaType: '', 
            metadataHref: '',
            type: '',
            uuidHref: ''
        }
    },
    pathName: '',
    paymentItemType: '',
    productFolder: {
        meta: {
            href: '',
            mediaType: '', 
            metadataHref: '',
            type: '',
            uuidHref: ''
        }
    },
    salePrices: [{
        currency: {
            meta: {
                href: '',
                mediaType: '', 
                metadataHref: '',
                type: '',
                uuidHref: ''
            },
        },
        priceType: {
            meta: {
                href: '',
                type: '',
                mediaType: 'string'
            },
            id: '',
            name: '',
            externalCode: ''
        },
        value: 1
    }],
    shared: false,
    supplier: {
        meta: {
            href: '',
            mediaType: '', 
            metadataHref: '',
            type: '',
            uuidHref: ''
        }
    },
    trackingType: '',
    uom: {
        meta: {
            href: '',
            mediaType: '',
            metadataHref: '',
            type: ''
        }
    },
    updated: ''
}



export const productUpdate = createEffect(async ({acces, product, saleDot}: {acces: string, product: IProduct, saleDot: any}) => {
    const config = {
        headers: {
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "Accept": "*/*",
            "Content-Type": "application/json",
            'Access-Control-Allow-Credentials': "true",
            "Authorization": `Bearer ${acces}`
        },
    }

    const url = `https://www.mc.optimiser.website/api/remap/1.2/entity/variant?filter=productid=${product.id}`
    const data = await axios(url, config)


    const final = []
    for(let i = 0; i < data.data.rows.length; i++) {
        const product: IProduct = data.data.rows[i]
        let currentPrice: any
        product.salePrices.forEach(priceObj => {
            if(priceObj.priceType.name === saleDot.current_price_type.price_name) {
                currentPrice = priceObj
            }
        })

        if(saleDot.current_price_type.price_id  === 'minimal_price') {
            product.salePrices[0].value = product.salePrices[0].value / 100
        }
        else {
            product.salePrices[0].value = currentPrice.value / 100
        }
        
        final.push(product)
    }


    if(data.data.rows.length) return [product, ...final]
    else return [product] 
})


export const setCurVariant = createEvent<number>()
export const $ProductPage = createStore<{products: IProduct[], curVariant: number}>({products: [initialProduct], curVariant: 0})
    .on(productUpdate.done, (state, { result }) => {
        return {...state, products: result}
    })
    .on(setCurVariant, (state, i) => {
        return {...state, curVariant: i}
    })