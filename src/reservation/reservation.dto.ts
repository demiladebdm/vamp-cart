export interface CreateReservationDTO {
  products: {
    product: string;
    quantity: number;
    stock: number;
  }[];
}