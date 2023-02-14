import { useState } from "react"




const useTost = () => {
    const [tost, setTost] = useState<string[]>([''])

    return {tost, setTost}
}

export default useTost