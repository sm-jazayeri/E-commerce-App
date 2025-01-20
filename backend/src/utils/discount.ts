
export const calculateDiscountedPrice  = (price: number, discount: number | null) => {
    if (!discount || discount <= 0) return price;     // no discount
    return price - (price * discount) / 100           // apply discounta
}