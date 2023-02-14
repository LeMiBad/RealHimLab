export const cashedVariants: { [key: string]: any } = {}

export const cashedVariantsUpdate = ({url, valute}: {url: string, valute: string}) => {
    cashedVariants[url] = valute
}