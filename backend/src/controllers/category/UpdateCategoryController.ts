// UpdateCategoryController.js
import { Request, Response } from "express";
import { UpdateCategoryService } from "../../services/category/UpdateCategoryService";

class UpdateCategoryController {
    async handle(req: Request, res: Response) {
        const { id } = req.params; // Obtém o ID da categoria da URL
        const { name } = req.body; // Obtém o novo nome da categoria do corpo da requisição

        if(name === ''){
            throw new Error('Name invalid')
        }

        try {
            // Aqui você implementaria a lógica para atualizar a categoria com o ID fornecido
            // Exemplo simples apenas para demonstração:
            const updateCategoryService = new UpdateCategoryService();

            const category = await updateCategoryService.execute({
                id,
                name
             });

            return res.json(category);
            
            // Retorna uma resposta de sucesso
            // return res.status(200).json({ message: `Categoria com ID ${id} atualizada com sucesso` });
        } catch (error) {
            // Retorna uma resposta de erro caso haja um problema
            return res.status(500).json({ error: 'Erro ao atualizar categoria' });
        }
    }
}

export { UpdateCategoryController }
