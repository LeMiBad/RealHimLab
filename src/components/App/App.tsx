import { useStore } from 'effector-react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import useMainButton from '../../hooks/useMainButton'
import usePage from '../../hooks/usePage'
import { getShopAcces } from '../../store/skladData'
import { $tgInfo, darkThemeEnabler, desktopEnabler, setTgNickName, setTgUserName } from '../../store/tgData'
import './app.css'


const GlobalStyle = createGlobalStyle<{dark: boolean}>`
    * {
        margin: 0;
        padding: 0;
        font-family: 'Montserrat', 'Roboto', sans-serif;
        body {
            background-color: ${props => props.dark? 'black' : "white"};
        }
    }
`

const App = () => {
    const {dark} = useStore($tgInfo)
    const [params] = useSearchParams()
    const mainButton = useMainButton()
    const {currentPage} = usePage()
    const initId = params.get('id') || '3'
    const initName = params.get('name') || ''


    
    useEffect(() => {
        setTgUserName(initName)
        window.Telegram.WebApp.expand()
        console.log('dev ветка')
        if(window.Telegram.WebApp.colorScheme === 'dark') darkThemeEnabler()
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
            .test(navigator.userAgent))  desktopEnabler()
        
        if(window.Telegram.WebApp.initDataUnsafe) {
            if(window.Telegram.WebApp.initDataUnsafe.user){
                if(window.Telegram.WebApp.initDataUnsafe.user.username) {
                    setTgNickName(window.Telegram.WebApp.initDataUnsafe.user.username)
                }
            }
        }
    }, [initName])
    
    
    useEffect(() => {
        getShopAcces(initId)
    }, [initId])
    
    
    return <>
        <GlobalStyle dark={dark}/>
        {mainButton}
        {currentPage}
    </>
}

export default App