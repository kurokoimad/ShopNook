export class Product 
{
    constructor(
        public id: string,
        public sku: string,
        public name: string,
        public description: string,
        public itemPrice: number,
        public pictureUrl: string,
        public active: boolean,
        public quantityInStock: number,
        public dateCreated: Date,
        public lastUpdated: Date)
        {

        }
}
