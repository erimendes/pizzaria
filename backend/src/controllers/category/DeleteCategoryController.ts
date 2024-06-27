import { Request, Response } from "express";
import { DeleteCategoryService } from "../../services/category/DeleteCategoryService";

class DeleteCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const deleteCategoryService = new DeleteCategoryService();

        if(id === '') {
            throw new Error("Id invalid");
        }

        const category = await deleteCategoryService.execute({ id });

        return res.json(category);
    }
}

export { DeleteCategoryController };