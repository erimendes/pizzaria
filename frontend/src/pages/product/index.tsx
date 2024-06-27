// import { useState, ChangeEvent, FormEvent } from 'react'
// import Head from 'next/head';
// import styles from './styles.module.scss';
// import {Header} from '../../components/Header'

// import { FiEdit, FiTrash } from "react-icons/fi";

// import { canSSRAuth } from '../../utils/canSSRAuth'

// import { FiUpload } from 'react-icons/fi'

// import { setupAPIClient } from '../../services/api'

// import { toast } from 'react-toastify'

// type ItemProps = {
//   id: string;
//   name: string;
// }

// interface CategoryProps{
//   categoryList: ItemProps[];
// }

// type Product = {
//   id: string;
//   name: string;
// }

// interface ProductProps {
//   productList: Product[];
// }

// export default function Product(
//   { categoryList }: CategoryProps,
//   { productList }: ProductProps
// ){

//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');

//   const [avatarUrl, setAvatarUrl] = useState('');
//   const [imageAvatar, setImageAvatar] = useState(null);

//   const [categories, setCategories] = useState(categoryList || [])
//   const [categorySelected, setCategorySelected] = useState(0)

//   const [products, setProductList] = useState(productList || []);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editingName, setEditingName] = useState<string>("");


//   function handleFile(e: ChangeEvent<HTMLInputElement>){

//     if(!e.target.files){
//       return;
//     }

//     const image = e.target.files[0];

//     if(!image){
//       return;
//     }

//     if(image.type === 'image/jpeg' || image.type === 'image/png'){

//       setImageAvatar(image);
//       setAvatarUrl(URL.createObjectURL(e.target.files[0]))

//     }

//   }

//   //Quando você seleciona uma nova categoria na lista
//   function handleChangeCategory(event){
//     // console.log("POSICAO DA CATEGORIA SELECIONADA ", event.target.value)
//    //console.log('Categoria selecionada ', categories[event.target.value])

//     setCategorySelected(event.target.value)

//   }

//   async function handleRegister(event: FormEvent){
//     event.preventDefault();

//     try{
//       const data = new FormData();

//       if(name === '' || price === '' || description === '' || imageAvatar === null){
//         toast.error("Preencha todos os campos!");
//         return;
//       }

//       data.append('name', name);
//       data.append('price', price);
//       data.append('description', description);
//       data.append('category_id', categories[categorySelected].id);
//       data.append('file', imageAvatar);

//       const apiClient = setupAPIClient();

//       await apiClient.post('/product', data);

//       toast.success('Cadastrado com sucesso!')

//     }catch(err){
//       console.log(err);
//       toast.error("Ops erro ao cadastrar!")
//     }

//     setName('');
//     setPrice('');
//     setDescription('')
//     setImageAvatar(null);
//     setAvatarUrl('');

//   }

//   async function handleEditProduct(id: string, newName: string) {
//     const apiClient = setupAPIClient();
    
//     try {
//       const response = await apiClient.put(`/product/${id}`, { name: newName });

//       toast.success("Produto editada com sucesso!");
//       setProductList(
//         productList.map((prod) =>
//           prod.id === id ? { ...prod, name: newName } : prod
//         )
//       );
//       setEditingId(null);
//       setEditingName("");
//     } catch (error) {
//       toast.error("Erro ao editar a produto. Tente novamente.");
//     }
//   }

//   async function handleDeleteProduct(id: string) {
//     const apiClient = setupAPIClient();
//     try {
//       alert(id)
//       await apiClient.delete(`/product/${id}`);
//       toast.success("Produto apagada com sucesso!");
//       setProductList(productList.filter((prod) => prod.id !== id));
//     } catch (error) {
//       toast.error("Erro ao apagar a produto. Tente novamente.");
//     }
//   }

//   return(
//     <>
//       <Head>
//         <title>Novo produto - Sujeito Pizzaria</title>
//       </Head>
//       <div>
//         <Header/>

//         <main className={styles.container}>
//           <h1>Novo produto</h1>

//           <form className={styles.form} onSubmit={handleRegister}>

//             <label className={styles.labelAvatar}>
//               <span>
//                 <FiUpload size={30} color="#FFF" />
//               </span>

//               <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

//               {avatarUrl && (     
//                   <img 
//                     className={styles.preview}
//                     src={avatarUrl}
//                     alt="Foto do produto" 
//                     width={250}
//                     height={250}
//                   />
//               )}

//             </label>


//             <select value={categorySelected} onChange={handleChangeCategory} >
//                 {categories.map( (item, index) => {
//                   return(
//                     <option key={item.id} value={index}>
//                       {item.name}
//                     </option>
//                   )
//                 })}
//             </select>

//             <input 
//             type="text"
//             placeholder="Digite o nome do produto"
//             className={styles.input}
//             value={name}
//             onChange={ (e) => setName(e.target.value) }
//             />

//             <input 
//             type="text"
//             placeholder="Preço do produto"
//             className={styles.input}
//             value={price}
//             onChange={ (e) => setPrice(e.target.value) }
//             />      

//             <textarea 
//               placeholder="Descreva seu produto..."
//               className={styles.input}
//               value={description}
//               onChange={ (e) => setDescription(e.target.value) }
//             /> 

//             <button className={styles.buttonAdd} type="submit">
//               Cadastrar  
//             </button>   

//           </form>

//           <h2>Produtos cadastrados:</h2>
//           <ul className={styles.productList}>
//             {categoryList.map((product) => (
//               <li key={product.id} className={styles.productItem}>
//                 {editingId === product.id ? (
//                   <>
//                     <input
//                       type="text"
//                       value={editingName}
//                       onChange={(e) => setEditingName(e.target.value)}
//                       className={styles.editInput}
//                     />
//                     <button
//                       className={styles.buttonSave}
//                       onClick={() =>
//                         handleEditProduct(product.id, editingName)
//                       }
//                     >
//                       Salvar
//                     </button>
//                     <button
//                       className={styles.buttonCancel}
//                       onClick={() => {
//                         setEditingId(null);
//                         setEditingName("");
//                       }}
//                     >
//                       Cancelar
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <span>{product.name}</span>
//                     <div className={styles.actions}>
//                       <FiEdit
//                         size={20}
//                         // color="#3b3b3b"
//                         color="yellow"
//                         onClick={() => {
//                           setEditingId(product.id);
//                           setEditingName(product.name);
//                         }}
//                       />
//                       <FiTrash
//                         size={20}
//                         color="red"
//                         onClick={() => handleDeleteProduct(product.id)}
//                       />
//                     </div>
//                   </>
//                 )}
//               </li>
//             ))}
//           </ul>

//         </main>

//       </div>
//     </>
//   )
// }

// export const getServerSideProps = canSSRAuth(async (ctx) => {
//   const apliClient = setupAPIClient(ctx)

//   const response = await apliClient.get('/category');
//   //console.log(response.data);

//   return {
//     props: {
//       categoryList: response.data
//     }
//   }
// })



// Exemplo 2

// import { useState, ChangeEvent, FormEvent } from 'react';
// import Head from 'next/head';
// import styles from './styles.module.scss';
// import { Header } from '../../components/Header';

// import { FiEdit, FiTrash, FiUpload } from "react-icons/fi";
// import { setupAPIClient } from '../../services/api';
// import { toast } from 'react-toastify';
// import { canSSRAuth } from '../../utils/canSSRAuth';

// type ItemProps = {
//   id: string;
//   name: string;
// }

// type Product = {
//   id: string;
//   name: string;
// }

// interface ProductProps {
//   productList: Product[];
// }

// interface CategoryProps {
//   categoryList: ItemProps[];
// }

// export default function Product({ categoryList }: CategoryProps & ProductProps) {
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [avatarUrl, setAvatarUrl] = useState('');
//   const [imageAvatar, setImageAvatar] = useState<File | null>(null);
//   const [categories, setCategories] = useState(categoryList || []);
//   const [categorySelected, setCategorySelected] = useState(0);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editingName, setEditingName] = useState<string>("");

//   function handleFile(e: ChangeEvent<HTMLInputElement>) {
//     if (!e.target.files) {
//       return;
//     }

//     const image = e.target.files[0];

//     if (!image) {
//       return;
//     }

//     if (image.type === 'image/jpeg' || image.type === 'image/png') {
//       setImageAvatar(image);
//       setAvatarUrl(URL.createObjectURL(image));
//     }
//   }

//   function handleChangeCategory(event: ChangeEvent<HTMLSelectElement>) {
//     const selectedCategoryIndex = Number(event.target.value);
//     setCategorySelected(selectedCategoryIndex);
//   }

//   async function handleRegister(event: FormEvent) {
//     event.preventDefault();

//     try {
//       const data = new FormData();

//       if (name === '' || price === '' || description === '' || !imageAvatar) {
//         toast.error("Preencha todos os campos!");
//         return;
//       }

//       data.append('name', name);
//       data.append('price', price);
//       data.append('description', description);
//       data.append('category_id', categories[categorySelected].id);
//       data.append('file', imageAvatar);

//       const apiClient = setupAPIClient();

//       await apiClient.post('/product', data);

//       toast.success('Cadastrado com sucesso!')

//       setName('');
//       setPrice('');
//       setDescription('');
//       setImageAvatar(null);
//       setAvatarUrl('');
//     } catch (err) {
//       console.log(err);
//       toast.error("Ops erro ao cadastrar!")
//     }
//   }

//   async function handleEditProduct(id: string, newName: string) {
//     const apiClient = setupAPIClient();

//     try {
//       const response = await apiClient.put(`/product/${id}`, { name: newName });

//       toast.success("Produto editado com sucesso!");
//       setProducts(
//         products.map((prod) =>
//           prod.id === id ? { ...prod, name: newName } : prod
//         )
//       );
//       setEditingId(null);
//       setEditingName("");
//     } catch (error) {
//       toast.error("Erro ao editar o produto. Tente novamente.");
//     }
//   }

//   async function handleDeleteProduct(id: string) {
//     const apiClient = setupAPIClient();
//     try {
//       await apiClient.delete(`/product/${id}`);
//       toast.success("Produto apagado com sucesso!");
//       setProducts(products.filter((prod) => prod.id !== id));
//     } catch (error) {
//       toast.error("Erro ao apagar o produto. Tente novamente.");
//     }
//   }

//   return (
//     <>
//       <Head>
//         <title>Novo produto - Sujeito Pizzaria</title>
//       </Head>
//       <div>
//         <Header />

//         <main className={styles.container}>
//           <h1>Novo produto</h1>

//           <form className={styles.form} onSubmit={handleRegister}>

//             <label className={styles.labelAvatar}>
//               <span>
//                 <FiUpload size={30} color="#FFF" />
//               </span>

//               <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />

//               {avatarUrl && (
//                 <img
//                   className={styles.preview}
//                   src={avatarUrl}
//                   alt="Foto do produto"
//                   width={250}
//                   height={250}
//                 />
//               )}

//             </label>

//             <select value={categorySelected} onChange={handleChangeCategory}>
//               {categories.map((item, index) => (
//                 <option key={item.id} value={index}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               placeholder="Digite o nome do produto"
//               className={styles.input}
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />

//             <input
//               type="text"
//               placeholder="Preço do produto"
//               className={styles.input}
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//             />

//             <textarea
//               placeholder="Descreva seu produto..."
//               className={styles.input}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             <button className={styles.buttonAdd} type="submit">
//               Cadastrar
//             </button>

//           </form>

//           <h2>Produtos cadastrados:</h2>
//           <ul className={styles.productList}>
//             {products.map((product) => (
//               <li key={product.id} className={styles.productItem}>
//                 {editingId === product.id ? (
//                   <>
//                     <input
//                       type="text"
//                       value={editingName}
//                       onChange={(e) => setEditingName(e.target.value)}
//                       className={styles.editInput}
//                     />
//                     <button
//                       className={styles.buttonSave}
//                       onClick={() =>
//                         handleEditProduct(product.id, editingName)
//                       }
//                     >
//                       Salvar
//                     </button>
//                     <button
//                       className={styles.buttonCancel}
//                       onClick={() => {
//                         setEditingId(null);
//                         setEditingName("");
//                       }}
//                     >
//                       Cancelar
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <span>{product.name}</span>
//                     <div className={styles.actions}>
//                       <FiEdit
//                         size={20}
//                         color="yellow"
//                         onClick={() => {
//                           setEditingId(product.id);
//                           setEditingName(product.name);
//                         }}
//                       />
//                       <FiTrash
//                         size={20}
//                         color="red"
//                         onClick={() => handleDeleteProduct(product.id)}
//                       />
//                     </div>
//                   </>
//                 )}
//               </li>
//             ))}
//           </ul>

//         </main>

//       </div>
//     </>
//   )
// }

// export const getServerSideProps = canSSRAuth(async (ctx) => {
//   const apiClient = setupAPIClient(ctx);

//   const categoryResponse = await apiClient.get('/category');
//   const productResponse = await apiClient.get('/product');

//   return {
//     props: {
//       categoryList: categoryResponse.data,
//       productList: productResponse.data,
//     }
//   }
// });




// Exemplo 3

import { GetServerSideProps } from "next";
import { useState, useEffect, FormEvent } from "react";
import Head from "next/head";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";

import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

import { canSSRAuth } from "../../utils/canSSRAuth";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

interface ProductProps {
  products: Product[];
}

export default function Products({ products }: ProductProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [productList, setProductList] = useState<Product[]>(products);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [editingDescription, setEditingDescription] = useState<string>("");
  const [editingPrice, setEditingPrice] = useState<string>("");

  useEffect(() => {
    setProductList(products);
  }, [products]);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (name === "" || description === "" || price === "") {
      toast.warning("Preencha todos os campos!");
      return;
    }

    const apiClient = setupAPIClient();
    try {
      const response = await apiClient.post("/products", {
        name,
        description,
        price: parseFloat(price),
      });

      toast.success("Produto cadastrado com sucesso!");
      setName("");
      setDescription("");
      setPrice("");
      setProductList([...productList, response.data]);
    } catch (error) {
      toast.error("Erro ao cadastrar o produto. Tente novamente.");
    }
  }

  async function handleEditProduct(id: string) {
    const apiClient = setupAPIClient();

    try {
      const response = await apiClient.put(`/products/${id}`, {
        name: editingName,
        description: editingDescription,
        price: parseFloat(editingPrice),
      });

      toast.success("Produto editado com sucesso!");
      setProductList(
        productList.map((prod) =>
          prod.id === id
            ? {
                ...prod,
                name: editingName,
                description: editingDescription,
                price: parseFloat(editingPrice),
              }
            : prod
        )
      );
      setEditingId(null);
      setEditingName("");
      setEditingDescription("");
      setEditingPrice("");
    } catch (error) {
      toast.error("Erro ao editar o produto. Tente novamente.");
    }
  }

  async function handleDeleteProduct(id: string) {
    const apiClient = setupAPIClient();
    try {
      await apiClient.delete(`/products/${id}`);
      toast.success("Produto apagado com sucesso!");
      setProductList(productList.filter((prod) => prod.id !== id));
    } catch (error) {
      toast.error("Erro ao apagar o produto. Tente novamente.");
    }
  }

  return (
    <>
      <Head>
        <title>Gerenciar Produtos - Sua Loja</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Cadastrar produtos</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nome do produto"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Descrição do produto"
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <input
              type="number"
              placeholder="Preço do produto"
              className={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>

          <h2>Produtos cadastrados:</h2>
          <ul className={styles.productList}>
            {productList.map((product) => (
              <li key={product.id} className={styles.productItem}>
                {editingId === product.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className={styles.editInput}
                    />
                    <textarea
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      className={styles.editInput}
                    ></textarea>
                    <input
                      type="number"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                      className={styles.editInput}
                    />
                    <button
                      className={styles.buttonSave}
                      onClick={() => handleEditProduct(product.id)}
                    >
                      Salvar
                    </button>
                    <button
                      className={styles.buttonCancel}
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                        setEditingDescription("");
                        setEditingPrice("");
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span>{product.name}</span>
                    <span>{product.description}</span>
                    <span>{`R$ ${product.price.toFixed(2)}`}</span>
                    <div className={styles.actions}>
                      <FiEdit
                        size={20}
                        color="yellow"
                        onClick={() => {
                          setEditingId(product.id);
                          setEditingName(product.name);
                          setEditingDescription(product.description);
                          setEditingPrice(product.price.toString());
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
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ProductProps> = canSSRAuth(
  async (ctx) => {
    try {
      const apiClient = setupAPIClient(ctx);
      const response = await apiClient.get("/products");

      return {
        props: {
          products: response.data,
        },
      };
    } catch (error) {
      console.error("Error fetching products:", error.message);
      return {
        props: {
          products: [],
        },
      };
    }
  }
);
