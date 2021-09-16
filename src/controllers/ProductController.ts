import { Request, Response, NextFunction } from "express";
import { Connection, Repository } from "typeorm";

import { IProductController } from "../globals/interfaces";
import BaseController from "../globals/baseController";
import { configOptions } from "../config/settings";
import Product from "../entity/Product";

class ProductController<
    A extends Request,
    B extends Response,
    C extends NextFunction
  >
  extends BaseController
  implements IProductController
{
  private productRepository: Repository<Product>;

  constructor(dbConnection: Connection) {
    super();
    this.productRepository = dbConnection.getRepository(Product);
  }

  public addNew = async (request: A, response: B, next: C): Promise<void> => {
    try {
      const contact = await this.productRepository.save(request.body);
      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 201, contact);
    } catch (error) {
      next(error);
    }
  };

  public getAllData = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      const contact = await this.productRepository.find({});
      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 200, contact);
    } catch (error) {
      next(error);
    }
  };

  public showData = async (request: A, response: B, next: C): Promise<void> => {
    try {
      const contact = await this.productRepository.findOne(
        request.params.contactId
      );
      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 200, contact);
    } catch (error) {
      next(error);
    }
  };

  /**
   * updateData
   */
  public updateData = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      const contact = await this.productRepository.update(
        request.params.contactId,
        request.body
      );

      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 200, contact);
    } catch (error) {
      next(error);
    }
  };

  public deleteData = async (
    request: A,
    response: B,
    next: C
  ): Promise<void> => {
    try {
      this.productRepository.delete(request.params.contactId);
      this.apiResponse(response, configOptions.SUCCESS_MESSAGE, 200);
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
