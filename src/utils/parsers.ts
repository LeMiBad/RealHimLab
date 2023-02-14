import { CategoryObject, ICategory } from './../types/types';


export const сategoriesParse = (arr: CategoryObject[]): ICategory[] => {
    let categories: ICategory[] = [];

    arr.forEach(obj => {
        categories.push(obj.category)

        if (obj.child) categories = categories.concat(сategoriesParse(obj.child))
    })

    return categories;
}

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