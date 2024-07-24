// Importa a classe Router da biblioteca express para definir rotas
import { Router } from "express";

// Importa o middleware multer para lidar com uploads de arquivos
import multer from "multer";

// Importa controladores para diferentes funcionalidades de usuários
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailuserController } from "./controllers/user/DetailUserController";

// Importa controladores para diferentes funcionalidades de categorias
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { UpdateCategoryController } from "./controllers/category/UpdateCategoryController";
import { DeleteCategoryController } from "./controllers/category/DeleteCategoryController";

// Importa controladores para diferentes funcionalidades de produtos
import { CreateProductController } from "./controllers/product/CreateProductController";
import { ListByCategoryController } from "./controllers/product/ListByCategoryController";
import { ListProductController } from "./controllers/product/ListProductController";

// Importa controladores para diferentes funcionalidades de pedidos
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { RemoveOrderController } from "./controllers/order/RemoveOrderController";

// Importa controladores para manipulação de itens em pedidos
import { AddItemController } from "./controllers/order/AddItemController";
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { SendOrderController } from "./controllers/order/SendOrderController";

// Importa controladores para listagem e detalhamento de pedidos
import { ListOrdersController } from "./controllers/order/ListOrdersController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";

// Importa um middleware para verificar se o usuário está autenticado
import { isAuthenticated } from "./middlewares/isAuthenticated";

// Importa a configuração de upload para multer
import uploadConfig from "./config/multer";

// Cria uma nova instância do roteador do Express
const router = Router();

// Configura o multer para usar as configurações definidas e armazenar arquivos na pasta ./tmp
const upload = multer(uploadConfig.upload("./tmp"));

//-- ROTAS USER --
// Define a rota para criação de um novo usuário
router.post("/users", new CreateUserController().handle);

// Define a rota para autenticação de usuário (login)
router.post("/session", new AuthUserController().handle);

// Define a rota para obter detalhes do usuário autenticado
router.get("/me", isAuthenticated, new DetailuserController().handle);

//-- ROTAS CATEGORY --
// Define a rota para criação de uma nova categoria
router.post(
  "/category",
  isAuthenticated,
  new CreateCategoryController().handle
);

// Define a rota para listar categorias
router.get("/category", isAuthenticated, new ListCategoryController().handle);

// Define a rota para atualizar uma categoria específica
router.put(
  "/category/:id",
  isAuthenticated,
  new UpdateCategoryController().handle
);

// Define a rota para deletar uma categoria específica
router.delete(
  "/category/:id",
  isAuthenticated,
  new DeleteCategoryController().handle
);

//-- ROTAS PRODUCT --
// Define a rota para criação de um novo produto, incluindo upload de imagem
router.post(
  "/product",
  isAuthenticated,
  upload.single("file"),
  new CreateProductController().handle
);

// Define a rota para listar produtos
router.get("/product", isAuthenticated, new ListProductController().handle);

// Define a rota para listar produtos por categoria
router.get(
  "/category/product",
  isAuthenticated,
  new ListByCategoryController().handle
);

//-- ROTAS ORDER --
// Define a rota para criação de um novo pedido
router.post("/order", isAuthenticated, new CreateOrderController().handle);

// Define a rota para deletar um pedido
router.delete("/order", isAuthenticated, new RemoveOrderController().handle);

// Define a rota para adicionar um item a um pedido
router.post("/order/add", isAuthenticated, new AddItemController().handle);

// Define a rota para remover um item de um pedido
router.delete(
  "/order/remove",
  isAuthenticated,
  new RemoveItemController().handle
);

// Define a rota para enviar um pedido
router.put("/order/send", isAuthenticated, new SendOrderController().handle);

// Define a rota para listar pedidos
router.get("/orders", isAuthenticated, new ListOrdersController().handle);

// Define a rota para obter detalhes de um pedido específico
router.get(
  "/order/detail",
  isAuthenticated,
  new DetailOrderController().handle
);

// Define a rota para finalizar um pedido
router.put(
  "/order/finish",
  isAuthenticated,
  new FinishOrderController().handle
);

// Exporta o roteador configurado para ser usado no arquivo principal do servidor
export { router };
