// import { User } from "../types/user";

export interface CreateProductDTO {
  // owner: User;
  title: string;
  description: string;
  image: string;
  price: number;
  count: number;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;