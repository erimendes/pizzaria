import { Request, Response } from "express";
import { ListProductService } from "../../services/product/ListPoductService";


class ListProductController {
    async handle(req: Request, res: Response) {
        const listProductService = new ListProductService();
        
        const products = await listProductService.execute();
        console.log("chegou aqui");
        console.log(products);
        return res.json(products);
    }
}

export { ListProductController };