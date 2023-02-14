import axios from "axios"
import { useStore } from "effector-react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import useAxiosConfig from "../../hooks/useAxiosConfig"
import { $pickedSaleDot } from "../../store/pickedSaleDot"
import { $allow_sync_sklad } from "../../store/skladData"
import { $tgInfo } from "../../store/tgData"
import { IProduct } from "../../types/types"
import { cashedVariants } from "../../utils/cashedProductVariant"


interface IVariant {
    product: IProduct
    setCurVariant: (i: number) => void
    index: number
}


const VariantItem = styled.div<{dark: boolean, exist: boolean}>`
    padding: 15px;
    background-color: ${props => props.dark? props.exist? '#C0C0C0' : 'white' : props.exist? '#808080' : 'black'};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    cursor: ${props => props.exist? 'defualt' : 'pointer'};
    color: ${props => props.dark? 'black' : props.exist? '#C0C0C0' : props.exist? '#808080' : 'white'};
`


const Variant: React.FC<IVariant> = ({product, setCurVariant, index}) => {
    const {dark} = useStore($tgInfo)
    const config = useAxiosConfig()
    const [exist, setExist] = useState(true)
    const allow_sync = useStore($allow_sync_sklad)
    const saleDot = useStore($pickedSaleDot)
    
    useEffect(() => {
        if(!allow_sync) {
            const url = `https://www.mc.optimiser.website/api/remap/1.2/report/stock/bystore/current?filter=assortmentId=${product.id};storeId=${saleDot? saleDot.sklad_id : ''}`
            
            if(cashedVariants[url]) {
                const data = cashedVariants[url]
                if(data.data.length) {
                    if(data.data[0].stock < 0) {
                        setExist(false)
                    }
                    else {
                        setExist(true)
                    }
                }
                else {
                    setExist(false)
                }
            }
            
            else axios(url, config)
            .then(data => {
                if(data.data.length) {
                    if(data.data[0].stock < 0) {
                        setExist(false)
                    }
                    else {
                        setExist(true)
                    }
                }
                else {
                    setExist(false)
                }
            })
        }
    }, [])

    const existHandler = () => {
        if(exist) setCurVariant(index)
    }

    return (
        <VariantItem exist={!exist} onClick={existHandler} dark={dark}>
            {product.name}
        </VariantItem>
    )
}

export default Variant