// import { GetServerSideProps } from "next";
// import { useState, FormEvent } from "react";
// import Head from "next/head";
// import { Header } from "../../components/Header";
// import styles from "./styles.module.scss";

// import { setupAPIClient } from "../../services/api";
// import { toast } from "react-toastify";

// import { canSSRAuth } from "../../utils/canSSRAuth";

// type Category = {
//   id: string;
//   name: string;
// };

// interface CategoryProps {
//   categories: Category[];
// }

// export default function Category({ categories }: CategoryProps) {
//   const [name, setName] = useState("");
//   const [categoryList, setCategoryList] = useState<Category[]>(categories);

//   async function handleRegister(event: FormEvent) {
//     event.preventDefault();

//     if (name === "") {
//       return;
//     }

//     const apiClient = setupAPIClient();
//     const response = await apiClient.post("/category", {
//       name: name,
//     });

//     toast.success("Categoria cadastrada com sucesso!");
//     setName("");

//     // Adiciona a nova categoria na lista
//     setCategoryList([...categoryList, response.data]);
//   }

//   return (
//     <>
//       <Head>
//         <title>Nova categoria - Sujeito Pizzaria</title>
//       </Head>
//       <div>
//         <Header />

//         <main className={styles.container}>
//           <h1>Cadastrar categorias</h1>

//           <form className={styles.form} onSubmit={handleRegister}>
//             <input
//               type="text"
//               placeholder="Digite o nome da categoria"
//               className={styles.input}
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />

//             <button className={styles.buttonAdd} type="submit">
//               Cadastrar
//             </button>
//           </form>

//           <h2>Categorias cadastradas:</h2>
//           <ul className={styles.categoryList}>
//             {categoryList.map((category) => (
//               <li key={category.id} className={styles.categoryItem}>
//                 {category.name}
//               </li>
//             ))}
//           </ul>
//         </main>
//       </div>
//     </>
//   );
// }

// // Define getServerSideProps para buscar categorias
// export const getServerSideProps: GetServerSideProps<CategoryProps> = canSSRAuth(
//   async (ctx) => {
//     const apiClient = setupAPIClient(ctx);
//     const response = await apiClient.get("/category");

//     return {
//       props: {
//         categories: response.data,
//       },
//     };
//   }
// );

import { GetServerSideProps } from "next";
import { useState, FormEvent } from "react";
import Head from "next/head";
import { FiEdit, FiTrash } from "react-icons/fi";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (name === "") {
      toast.warning("Digite um nome para a categoria!");
      return;
    }

    const apiClient = setupAPIClient();
    try {
      const response = await apiClient.post("/category", {
        name: name,
      });

      toast.success("Categoria cadastrada com sucesso!");
      setName("");

      // Adiciona a nova categoria na lista
      setCategoryList([...categoryList, response.data]);
    } catch (error) {
      toast.error("Erro ao cadastrar a categoria. Tente novamente.");
    }
  }

  async function handleEditCategory(id: string, newName: string) {
    const apiClient = setupAPIClient();
    
    try {
      const response = await apiClient.put(`/category/${id}`, { name: newName });

      toast.success("Categoria editada com sucesso!");
      setCategoryList(
        categoryList.map((cat) =>
          cat.id === id ? { ...cat, name: newName } : cat
        )
      );
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      toast.error("Erro ao editar a categoria. Tente novamente.");
    }
  }

  async function handleDeleteCategory(id: string) {
    const apiClient = setupAPIClient();
    try {
      alert(id)
      await apiClient.delete(`/category/${id}`);
      toast.success("Categoria apagada com sucesso!");
      setCategoryList(categoryList.filter((cat) => cat.id !== id));
    } catch (error) {
      toast.error("Erro ao apagar a categoria. Tente novamente.");
    }
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
                {editingId === category.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className={styles.editInput}
                    />
                    <button
                      className={styles.buttonSave}
                      onClick={() =>
                        handleEditCategory(category.id, editingName)
                      }
                    >
                      Salvar
                    </button>
                    <button
                      className={styles.buttonCancel}
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span>{category.name}</span>
                    <div className={styles.actions}>
                      <FiEdit
                        size={20}
                        // color="#3b3b3b"
                        color="yellow"
                        onClick={() => {
                          setEditingId(category.id);
                          setEditingName(category.name);
                        }}
                      />
                      <FiTrash
                        size={20}
                        color="red"
                        onClick={() => handleDeleteCategory(category.id)}
                      />
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<CategoryProps> = canSSRAuth(
  async (ctx) => {
    try {
      const apiClient = setupAPIClient(ctx);
      const response = await apiClient.get("/category");

      return {
        props: {
          categories: response.data,
        },
      };
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      return {
        props: {
          categories: [],
        },
      };
    }
  }
);
