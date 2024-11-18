export class OrderLog 
{
    constructor(public id: string,
        public orderTrackingReference: string,
        public sumPrice: number,
        public sumQuantity: number,
        public dateCreated: Date) {

        }
}
