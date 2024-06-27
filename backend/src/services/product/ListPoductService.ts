import prismaClient from "../../prisma";

class ListProductService {

    async execute(){
        const findProduct = await prismaClient.product.findMany({});

        return findProduct;
    }
}

export { ListProductService };