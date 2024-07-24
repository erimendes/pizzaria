// import prismaClient from "../../prisma";

// class ListProductService {

//     async execute(){
//         const findProduct = await prismaClient.product.findMany({});

//         return findProduct;
//     }
// }

// export { ListProductService };

import prismaClient from "../../prisma";
import fs from "fs";
import path from "path";

class ListProductService {
  async execute() {
    const findProduct = await prismaClient.product.findMany({});

    // Mapeia os produtos para incluir a imagem
    const productsWithImages = await Promise.all(
      findProduct.map(async (product) => {
        let image = null;
        if (product.banner) {
          const imagePath = path.resolve(
            __dirname,
            "..",
            "..",
            "public",
            "images",
            product.banner
          );
          try {
            image = await fs.promises.readFile(imagePath, {
              encoding: "base64",
            });
          } catch (error) {
            console.error(`Erro ao ler a imagem ${imagePath}: `, error);
          }
        }

        return {
          ...product,
          banner: image,
        };
      })
    );

    return productsWithImages;
  }
}

export { ListProductService };
