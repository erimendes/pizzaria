import prismaClient from "../../prisma";

interface CategoryRequest{
    id: string;
    name: string;
  }

class UpdateCategoryService{
  async execute({id, name}: CategoryRequest){

    if(name === ''){
      throw new Error('Name invalid')
    }
    
    const category = await prismaClient.category.update({
        where: {
            id: id,
        },
        data: {
            name:name,
        }
    })

    return category;

  }
}

export { UpdateCategoryService }