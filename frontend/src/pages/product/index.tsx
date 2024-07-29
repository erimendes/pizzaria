import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Head from "next/head";
import Image from "next/image"; // Importe o componente Image do Next.js
import styles from "./styles.module.scss";
import { FiEdit, FiTrash, FiUpload } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "@/src/components/Header";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url?: string;
};

interface Props {
  categoryList: Category[];
  productList: Product[];
}

export default function Product({ categoryList, productList }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [imageAvatar, setImageAvatar] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>(productList);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(productList);
  }, [productList]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(image));
    }
  }

  function handleChangeCategory(event: ChangeEvent<HTMLSelectElement>) {
    setCategorySelected(event.target.value);
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      if (
        !name ||
        !price ||
        !description ||
        !imageAvatar ||
        !categorySelected
      ) {
        toast.error("Preencha todos os campos!");
        return;
      }

      const data = new FormData();
      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categorySelected);
      data.append("file", imageAvatar);

      const apiClient = setupAPIClient();

      const response = await apiClient.post("/product", data);

      toast.success("Produto cadastrado com sucesso!");

      setProducts([...products, response.data]);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Ops, ocorreu um erro ao cadastrar o produto!");
    }
  }

  async function handleSaveEdit() {
    if (!editingProduct) {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      const data = new FormData();

      data.append("name", editingProduct.name);
      data.append("price", editingProduct.price.toString());
      data.append("description", editingProduct.description);
      data.append("category_id", editingProduct.category_id);

      if (imageAvatar) {
        data.append("file", imageAvatar);
      }

      await apiClient.put(`/product/${editingProduct.id}`, data);

      toast.success("Produto editado com sucesso!");

      setProducts(
        products.map((prod) =>
          prod.id === editingProduct.id
            ? {
                ...prod,
                ...editingProduct,
                image_url: avatarUrl || prod.image_url,
              }
            : prod
        )
      );

      setEditingProduct(null);
      setAvatarUrl(null);
      setImageAvatar(null);
    } catch (error) {
      console.error("Erro ao editar o produto:", error);
      toast.error("Ops, ocorreu um erro ao editar o produto!");
    }
  }

  async function handleDeleteProduct(id: string) {
    try {
      const apiClient = setupAPIClient();

      await apiClient.delete(`/product/${id}`);

      toast.success("Produto deletado com sucesso!");

      setProducts(products.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error("Erro ao deletar o produto:", error);
      toast.error("Ops, ocorreu um erro ao deletar o produto!");
    }
  }

  function resetForm() {
    setName("");
    setPrice("");
    setDescription("");
    setCategorySelected("");
    setImageAvatar(null);
    setAvatarUrl(null);
  }

  return (
    <>
      <Head>
        <title>Gerenciar Produtos - Sua Loja</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Novo produto</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={30} color="#FFF" />
              </span>

              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFile}
              />

              {avatarUrl && (
                <Image
                  className={styles.preview}
                  src={avatarUrl}
                  alt="Foto do produto"
                  width={250}
                  height={250}
                />
              )}
            </label>

            <select value={categorySelected} onChange={handleChangeCategory}>
              <option value="">Selecione uma categoria</option>
              {categoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Digite o nome do produto"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Preço do produto"
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <textarea
              placeholder="Descrição do produto"
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>

          <h2>Produtos cadastrados:</h2>
          <div className={styles.productList}>
            <div className={styles.headerRow}>
              <span className={styles.headerCell}>Imagem</span>
              <span className={styles.headerCell}>Nome</span>
              <span className={styles.headerCell}>Preço</span>
              <span className={styles.headerCell}>Descrição</span>
              <span className={styles.headerCell}>Categoria</span>
              <span className={styles.headerCell}>Ações</span>
            </div>
            <ul>
              {products.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  {editingProduct?.id === product.id ? (
                    <div className={styles.editForm}>
                      <label className={styles.labelAvatar}>
                        <span>
                          <FiUpload size={20} color="#000" />
                        </span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={handleFile}
                        />
                        {avatarUrl ? (
                          <Image
                            className={styles.smallPreview}
                            src={avatarUrl}
                            alt="Foto do produto"
                            width={50}
                            height={50}
                          />
                        ) : (
                          product.image_url && (
                            <Image
                              className={styles.smallPreview}
                              src={product.image_url}
                              alt="Foto do produto"
                              width={50}
                              height={50}
                            />
                          )
                        )}
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            name: e.target.value,
                          })
                        }
                        className={styles.editInput}
                      />

                      <input
                        type="text"
                        value={editingProduct.price.toString()}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className={styles.editInput}
                      />

                      <textarea
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                        className={styles.editInput}
                      ></textarea>

                      <select
                        value={editingProduct.category_id}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category_id: e.target.value,
                          })
                        }
                        className={styles.editInput}
                      >
                        <option value="">Selecione uma categoria</option>
                        {categoryList.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>

                      <div className={styles.actionButtons}>
                        <button
                          className={styles.buttonSave}
                          onClick={handleSaveEdit}
                        >
                          Salvar
                        </button>
                        <button
                          className={styles.buttonCancel}
                          onClick={() => {
                            setEditingProduct(null);
                            setAvatarUrl(null);
                            setImageAvatar(null);
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span>
                        {product.image_url ? (
                          <Image
                            className={styles.smallPreview}
                            src={product.image_url}
                            alt="Foto do produto"
                            width={50}
                            height={50}
                          />
                        ) : (
                          "Sem imagem"
                        )}
                      </span>
                      <span>{product.name}</span>
                      <span>{product.price}</span>
                      <span>{product.description}</span>
                      <span>
                        {
                          categoryList.find((c) => c.id === product.category_id)
                            ?.name
                        }
                      </span>
                      <div className={styles.actions}>
                        <FiEdit
                          size={20}
                          color="yellow"
                          onClick={() => {
                            setEditingProduct(product);
                            setAvatarUrl(product.image_url || null);
                            setImageAvatar(null);
                          }}
                        />
                        <FiTrash
                          size={20}
                          color="red"
                          onClick={() => handleDeleteProduct(product.id)}
                        />
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const categoryResponse = await apiClient.get("/category");
    const productResponse = await apiClient.get("/product");

    return {
      props: {
        categoryList: categoryResponse.data,
        productList: productResponse.data,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar categorias e produtos:", error);
    return {
      props: {
        categoryList: [],
        productList: [],
      },
    };
  }
});
