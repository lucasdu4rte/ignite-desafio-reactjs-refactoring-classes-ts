export interface FoodResponse {
  id: number
  name: string
  description: string
  price: number
  available: boolean
  image: string
}

export type FoodData = {
  name: string
  image: string
  price: number
  description: string
}
