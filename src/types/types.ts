declare global {
    interface Window {
        Telegram: {
            WebApp: any
        };
    }
}

export interface ISalePrice {
    currency: {
        meta: {
            href: string
            mediaType: string 
            metadataHref: string
            type: string
            uuidHref: string
        }
    }
    priceType: {
        meta: {
            href: string
            type: string
            mediaType: string
        },
        id: string
        name: string
        externalCode: string
    }
    value: number
}

export interface IProduct {
    [x: string]: any
    counter?: number
    accountId: string
    archived: boolean
    article: string
    barcodes: {
        ean13: string
    }[]
    buyPrice: {
        value: number
        currency: {
            meta: {
                href: string
                mediaType: string 
                metadataHref: string
                type: string
                uuidHref: string
            }
        }
    }
    code: string
    country: {
        meta: {
            href: string
            mediaType: string 
            metadataHref: string
            type: string
            uuidHref: string
        }
    }
    description: string
    discountProhibited: boolean
    externalCode: string
    files: {
        meta: {
            href: string
            limit: number
            mediaType: string
            offset: number
            size: number
            type: string
        } 
    }
    group: {
        meta: {
            href: string
            metadataHref: string
            type: string
            mediaType: string
        }
    }
    id: string
    images: {
        meta: {
            href: string
            type: string
            mediaType: string
            size: number
            limit: number
            offset: number
        }
    }
    isSerialTrackable: boolean
    meta: {
        href: string
        metadataHref: string
        type: string
        mediaType: string 
        uuidHref: string
    }
    minPrice: {
        value: number
        currency: {
            meta: {
                href: string
                mediaType: string 
                metadataHref: string
                type: string
                uuidHref: string
            }
        }
    }
    name: string
    owner: {
        meta: {
            href: string
            mediaType: string 
            metadataHref: string
            type: string
            uuidHref: string
        }
    }
    pathName: string
    paymentItemType: string
    productFolder: {
        meta: {
            href: string
            mediaType: string 
            metadataHref: string
            type: string
            uuidHref: string
        }
    }
    salePrices: ISalePrice[]
    updated: string
}

export interface IAcces {
    access_token: string
    account_id: string
    org_name: string
}

export interface ICategories {
    folder_id: string,
    folder_name: string,
    user_folder_name: string
}

export interface ISalePoint {
    current_price_type?: {
        price_id: string
        price_name: string
    }
    allow_sync_sklad: boolean
    sklad_id: string
    sklad_name: string
    user_sklad_name: string
}

export interface ICategory {
    folder_id: string, 
    folder_name: string, 
    user_folder_name: string
}

export interface CategoryObject {
    padding: number
    category: ICategory
    child: null | CategoryObject[]
}

export interface IImage {
    filename: string
    meta: {
        href: string 
        type: string 
        mediaType: string 
        downloadHref: string
    }
    miniature: {
        type: string
        mediaType: string
    }
    tiny: {
        href: string 
        type: string 
        mediaType: string
    }
    title: string
    updated: string
} 