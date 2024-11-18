export class ProductCategory 
{
    constructor(public id: number,
        public categoryName: string, parentCategoryId?: number, public subcategories?: ProductCategory[])
        {

        }
}
