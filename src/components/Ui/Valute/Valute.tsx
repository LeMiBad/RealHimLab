import useValute from "../../../hooks/useValute"
import { IProduct } from "../../../types/types"






const Valute: React.FC<{data: IProduct}> = ({data}) => {
    const valute = useValute(data)


    return (
        <>
            
        </>
    )
}

export default Valute