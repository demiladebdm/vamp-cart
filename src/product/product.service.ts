import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../types/product';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { User } from '../types/user';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) { }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().populate('owner')
  }

  async findByOwner(userId: string): Promise<Product[]> {
    return await this.productModel.find({ owner: userId }).populate('owner')
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('owner');
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NO_CONTENT);
    }
    return product.populate('owner');
  }

  async create(productDTO: CreateProductDTO, user: User): Promise<Product> {
    const product = await this.productModel.create({
      ...productDTO,
      owner: user
    })
    await product.save();
    return product.populate('owner');
  }

  async update(id: string, productDTO: UpdateProductDTO, userId: string): Promise<Product> {
    const product = await this.productModel.findById(id)
    if (userId !== product.owner.toString()) {
      throw new HttpException(
        'You do not own this product',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await product.updateOne(productDTO);
    return await this.productModel.findById(id).populate('owner');
  }

  async delete(id: string, userId: string): Promise<Product> {
    const product = await this.productModel.findById(id)
    if (userId !== product.owner.toString()) {
      throw new HttpException(
        'You do not own this product',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await product.deleteOne();
    return product.populate('owner');
  }
}
