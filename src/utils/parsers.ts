import { CategoryObject, ICategory, IProduct } from './../types/types';


export const сategoriesParse = (arr: CategoryObject[]): ICategory[] => {
    let categories: ICategory[] = [];

    arr.forEach(obj => {
        categories.push(obj.category)

        if (obj.child) categories = categories.concat(сategoriesParse(obj.child))
    })

    return categories;
}


export const splitArr = (arr: any[], chunks: number) =>
    [...Array(chunks)].map((_, c) => arr.filter((n, i) => i % chunks === c));


// export const returnParentCategory = (allCategories: CategoryObject[] | null, category: CategoryObject, branch?: CategoryObject) => {
//     if(allCategories) {
//         allCategories.forEach(categoryObj => {
//             returnParentCategory(null, category, categoryObj)
//         })
//     }

//     if(branch && branch.child) {
//         const childs = branch.child
//         for(let i = 0; i < childs.length; i++) {
//             if(childs[i].category.folder_name === category.category.folder_name) {
//                 return branch
//             }
//             else return returnParentCategory(null, category, childs[i])
//         }
//     }
// }


export const getChildsFolders = (currentCategory: CategoryObject) => {
    if(currentCategory.child === null) return [currentCategory]
    let folders: CategoryObject[] = [];
    folders.push(currentCategory);
    if (currentCategory.child) {
        for (const child of currentCategory.child) {
            folders = folders.concat(getChildsFolders(child));
        }
    }

    
    folders.reverse()
    return folders
}


export function sortProductPairsByNames(products: Array<IProduct | null>[]): IProduct[][] {
    

    const result: IProduct[] = []

    products.forEach(arr => {
        arr.forEach((item: IProduct | null) => {
            if(item)result.push(item)
        })
    })

    const sortedProducts = result.sort((a, b) => a.name.localeCompare(b.name));
    const numProducts = sortedProducts.length;
    const numPairs = Math.floor(numProducts / 2);
    
    const productPairs = new Array(numPairs);
    for (let i = 0; i < numPairs; i++) {
        productPairs[i] = [sortedProducts[2 * i], sortedProducts[2 * i + 1]];
    }
    
    if (numProducts % 2 !== 0) {
        productPairs.push([sortedProducts[numProducts - 1], null]);
    }
    
    return productPairs;
}



export const findParentCategory = (categories: CategoryObject[], currentCategory: CategoryObject): CategoryObject | null => {
    for (const category of categories) {
        if (category.child) {
            const childFound = category.child.find(c => c === currentCategory);
            if (childFound) {
                return category;
            }
            const parent = findParentCategory(category.child, currentCategory);
            if (parent) {
                return parent;
            }
        }
    }
    return null;
}


export const categoryNameParser = (name: string, padding: number) => name.split('/')[padding]