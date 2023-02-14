export const cashedValute: { [key: string]: string } = {}

export const valStoreUpdate = ({url, valute}: {url: string, valute: string}) => {
    cashedValute[url] = valute
}