export const API = {
    path: 'https://www.mc.optimiser.website/api/',
    configs: {
        get: (acces?: string) => {
            return {
                headers: {
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Credentials': "true",
                    "Authorization": `${acces? 'Bearer ' + acces : ''}`
                }
            }
        }
    }
}