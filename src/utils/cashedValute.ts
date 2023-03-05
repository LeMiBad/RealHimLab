export const cashedValute: { [key: string]: string } = {}

export const valStoreUpdate = ({url, valute}: {url: string, valute: string}) => {
    cashedValute[url] = valute
}


export const cashedSize: { [key: string]: string } = {}

export const sizeStoreUpdate = ({url, size}: {url: string, size: string}) => {
    cashedValute[url] = size
}