import { useStore } from "effector-react"
import styled, { keyframes } from "styled-components"
import { $tgInfo } from "../../store/tgData"

const anim = keyframes`
    0% {
        transform: translateY(-100%);
        -webkit-transform: translateY(-100%);
        /* transform: scale(1); */
    }
    
    85% {
        transform: translateY(0);
        -webkit-transform: translateY(0);
        /* transform: scaleX(1); */
    }
    100% {
        transform: translateY(-100%);
        -webkit-transform: translateY(-100%);
        /* transform: scaleX(0); */
    }
`

const StyledTost = styled.p<{dark: boolean}>`
    font-size: 21px;
    padding: 18px 0;
    background-color: ${props => props.dark? 'white' : 'black'};
    color: ${props => props.dark? 'black' : 'white'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 300000;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: ${anim} 0.7s forwards;
`


const Tost: React.FC<{children: string}> = ({children}) => {
    const {dark} = useStore($tgInfo)

    return <StyledTost dark={dark}>{children}</StyledTost>
}

export default Tost