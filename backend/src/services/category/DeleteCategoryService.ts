import prismaClient from "../../prisma";

interface CategoryRequest {
    id: string;
}

class DeleteCategoryService {
    async execute( { id }: CategoryRequest){
        if(id === ''){
            throw new Error('Id invalid');
        }

        const category = await prismaClient.category.delete({
            where: {
                id: id
            }
        });

        return category;
    }
}

export { DeleteCategoryService };