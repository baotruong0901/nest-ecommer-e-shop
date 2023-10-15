interface CartItem {
    product: string,
    price: number,
    count: number,
    color: string,
}


export type CartParams = CartItem[]