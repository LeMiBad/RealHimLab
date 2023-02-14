import { useStore } from "effector-react"
import { useEffect, useState } from "react"
import { $acces } from "../store/skladData"
import { IProduct } from "../types/types"
import { getImage } from "../utils/getImage"

//Cash
const cashedImages: any = {}
//Cash

const useImages = (product: IProduct, isVariant?: boolean) => {
    const {access_token} = useStore($acces)
    const [{images, isLoading}, setImages] = useState<{images: string[], isLoading: boolean}>({images: [], isLoading: true})

    
    useEffect(() => {
        if(cashedImages[product.images.meta.href]) { 
            setImages({images: cashedImages[product.images.meta.href], isLoading: false})
        }
        else if(access_token && product.images.meta.href) {
            getImage(product.images.meta.href, access_token, isVariant? isVariant : false)
            .then(data => {
                Promise.all(data)
                    .then(data => {
                        const final: string[] = []
                        data.forEach(item => {
                            final.push(item.data.img_url)
                        })
                        cashedImages[product.images.meta.href] = final
                        setImages({images: final, isLoading: false})
                    })
            })
        }
    
    }, [access_token, isVariant, product.images.meta.href])

    return {images, isLoading}
}

export default useImages