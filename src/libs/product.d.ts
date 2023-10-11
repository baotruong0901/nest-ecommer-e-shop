export interface createProductParams {
    title: string,
    description: string,
    price: number,
    images: Express.Multer.File[],
    quantity: number,
    coupon: number,
    brand: string,
    categories: string[],
    colors: string[]
}

export interface getAllProductParams {
    searchString: string,
    brand: string,
    category: string
    minPrice: number,
    maxPrice: number,
    pageNumber: number,
    pageSize: number,
    sold: boolean
}