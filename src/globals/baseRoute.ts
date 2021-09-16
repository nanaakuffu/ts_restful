import { IRoutes } from "./interfaces";

export abstract class BaseRoute implements IRoutes {
  public abstract routes(): void;
}
