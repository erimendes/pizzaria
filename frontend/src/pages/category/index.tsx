import { GetServerSideProps } from "next";
import { useState, FormEvent } from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";

import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

import { canSSRAuth } from "../../utils/canSSRAuth";

type Category = {
  id: string;
  name: string;
};

interface CategoryProps {
  categories: Category[];
}

export default function Category({ categories }: CategoryProps) {
  const [name, setName] = useState("");
  const [categoryList, setCategoryList] = useState<Category[]>(categories);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (name === "") {
      return;
    }

    const apiClient = setupAPIClient();
    const response = await apiClient.post("/category", {
      name: name,
    });

    toast.success("Categoria cadastrada com sucesso!");
    setName("");

    // Adiciona a nova categoria na lista
    setCategoryList([...categoryList, response.data]);
  }

  return (
    <>
      <Head>
        <title>Nova categoria - Sujeito Pizzaria</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Cadastrar categorias</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Digite o nome da categoria"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>

          <h2>Categorias cadastradas:</h2>
          <ul className={styles.categoryList}>
            {categoryList.map((category) => (
              <li key={category.id} className={styles.categoryItem}>
                {category.name}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}

// Define getServerSideProps para buscar categorias
export const getServerSideProps: GetServerSideProps<CategoryProps> = canSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/category");

    return {
      props: {
        categories: response.data,
      },
    };
  }
);
