import Editor from "@components/Editor";
import Input from "@components/ui/Input";
import Loader from "@components/ui/Loader";
import Modal from "@components/ui/Modal";
import Message from "@utils/Message";
import axios from "axios";
import { Plus } from "lucide-react";
import { Trash2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import useUserStore from "@store/UserStore";
import { Navigate } from "react-router-dom";
const Produtos = () => {
  const {userActive, loadingData} = useUserStore()
  const { data: products, refetch: reloadProducts } = useQuery(
    "productsDashboard",
    async () =>
      (await axios.get(import.meta.env.VITE_API_DEVELOPMENT + "/produtos")).data
  );
  const [message, setMessage] = useState(null);
  const [produtoAtivo, setProdutoAtivo] = useState(null);
  const [modalEditarProduto, setModalEditarProduto] = useState(false);
  const [modalCriarProduto, setModalCriarProduto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [precoAntigo, setPrecoAntigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [section, setSection] = useState("");
  const [images, setImages] = useState(null);
  const [tags, setTags] = useState(null);
  const [previewImages, setPreviewImages] = useState(null);
  const { mutate: editarProduto, isLoading: editandoProduto } = useMutation(
    "editarProduto",
    async () => {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_DEVELOPMENT}/editar-produto/${
            produtoAtivo._id
          }`,
          {
            title: titulo,
            price: preco,
            oldPrice: precoAntigo,
            description: descricao.replace(/<p><\/p>/g, "<br>"),
            category: categoria.toLowerCase(),
            tags: produtoAtivo.tags,
            section: section.toLowerCase(),
            images: images,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("auth_token_user")}`,
            },
          }
        );
        setMessage({ type: "success", title: "Produto editado com sucesso" });
      } catch (err) {
        console.log(err);
        setMessage({ type: "error", title: "Erro ao editar produto" });
      }
    },
    {
      onSuccess: () => {
        reloadProducts();
        setModalEditarProduto(false);
        setProdutoAtivo(null);
        setTitulo("");
        setPreco("");
        setPrecoAntigo("");
        setDescricao("");
        setCategoria("");
        setSection("");
        setImages(null);
        setTags(null);
      },
    }
  );
  const { mutate: criarProduto, isLoading: criandoProduto } = useMutation(
    "criarProduto",
    async () => {
      try {
        const formData = new FormData();
        formData.append("title", titulo);
        formData.append("price", preco);
        formData.append("oldPrice", precoAntigo || "");
        formData.append("description", descricao.replace(/<p><\/p>/g, "<br>"));
        formData.append("tags", JSON.stringify(tags)); // Se for um array, converta para string
        formData.append("section", section.toLowerCase());
        formData.append("category", categoria.toLowerCase());

        // Adicionando as imagens
        for (const image of images) {
          formData.append("image", image);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_DEVELOPMENT}/criar-produto/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get("auth_token_user")}`,
            },
          }
        );

        setMessage({ type: "success", title: "Produto criado com sucesso" });
      } catch (err) {
        console.error("Erro ao criar produto:", err);
        setMessage({ type: "error", title: "Erro ao criar produto" });
      }
    },
    { onSuccess: () => reloadProducts() }
  );

  const { mutate: handleImageUpload, isLoading: enviandoImagens } = useMutation(
    "enviarImages",
    async (e) => {
      const files = e.target.files;

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          console.error("Arquivo inválido. Por favor, selecione uma imagem.");
          continue;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await axios.post(
            "https://api-egames.vercel.app/enviar-imagens",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              Authorization: `Bearer ${Cookies.get("auth_token_user")}`,
            }
          );
          console.log("Resposta do backend:", response.data);
          setImages((prevImages) => [...prevImages, ...response.data]);
        } catch (error) {
          console.error("Erro ao enviar imagem:", error);
        }
      }
    }
  );

  const {mutate: deleteProduct} = useMutation("deleteProduct", async(id)=> {
    try{
      const response = await axios.delete("https://api-egames.vercel.app/excluir-produto/" + id, {
        headers: {
          Authorization: `Bearer ${Cookies.get("auth_token_user")}`
        }
      })
      console.log(response)
    }
    catch(err){
      console.log(err)
    }
  }, {onSuccess: ()=> reloadProducts()})
  if(userActive.role !== "admin") return <Navigate to={"/"} />
  if(loadingData === false && userActive.role === "admin")
  return (
    <>
      {(enviandoImagens || editandoProduto || criandoProduto) && <Loader />}
      <div className="grid grid-cols-5 gap-[2rem]">
        {products?.map((p) => (
          <div
            onClick={() => {
              setProdutoAtivo(p);
              setModalEditarProduto(true);
              setTitulo(p.title);
              setPreco(p.price);
              setPrecoAntigo(p.oldPrice);
              setDescricao(p.description);
              setImages(p.images);
              setCategoria(
                p.category[0].toUpperCase() +
                  p.category.split("").slice(1).join("")
              );
              setSection(
                p.section[0].toUpperCase() +
                  p.section.split("").slice(1).join("")
              );
            }}
            key={p._id}
            className="cursor-pointer relative"
          >
            <button onClick={(e)=> {
              e.stopPropagation()
              deleteProduct(p._id)
            }} className="bg-zinc-900 bg-opacity-90 absolute p-[1rem] right-0 top-0 rounded-[.4rem] text-red-400">
              <Trash2 />
            </button>
            <img
              src={p.images[0]}
              alt=""
              className="rounded-lg h-[200px] object-cover mb-[.8rem] w-full"
            />
            <span className="text-zinc-900 dark:text-zinc-100 text-[1.6rem] font-semibold leading-[1.215]">
              {p.title}
            </span>
          </div>
        ))}
        <motion.button
          onClick={() => setModalCriarProduto(true)}
          whileHover={"hover"}
          className="bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-800 fixed right-8 bottom-8 p-[1rem] rounded-full"
        >
          <Plus strokeWidth={2.15} />
          <motion.span
            initial={{ opacity: 0, left: "-200%" }}
            variants={{ hover: { opacity: 1, left: "-250%" } }}
            className="text-[1.3rem] font-semibold p-[.5rem] rounded-full text-zinc-100 bg-zinc-900 px-[1rem] dark:bg-zinc-100 dark:text-zinc-900 absolute w-max top-2/4 -translate-y-2/4"
          >
            Criar produto
          </motion.span>
        </motion.button>
      </div>
      {modalEditarProduto && (
        <Modal
          onCloseModal={() => setProdutoAtivo(null)}
          type={"form"}
          className={"modal-editar-produto min-h-[50%] max-w-[35vw] py-[3rem]"}
          setModal={setModalEditarProduto}
          action={() => {
            // setProdutoAtivo(null);
            editarProduto();
          }}
        >
          <h1 className="dark:text-zinc-50 text-[2rem] font-semibold mb-[.8rem]">
            Editar produto
          </h1>
          <div className=" pb-[1rem]">
            <div className="flex gap-[1rem] overflow-x-auto">
              {images?.map((i, n) => (
                <div className="relative" key={n}>
                  <img
                    className="w-[180px] h-[160px] object-cover rounded-lg"
                    src={i}
                  />
                  <button
                    onClick={() => setImages(images.filter((im) => im != i))}
                    type="button"
                    className="absolute top-0 right-0 p-[.7rem] rounded-[.5rem] bg-zinc-800 bg-opacity-30 text-red-500"
                  >
                    <Trash2 className="w-[2rem] h-[2rem]" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
            <label className="relative flex w-fit h-fit">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                className="absolute h-full w-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="p-[1rem] rounded-[.5rem] dark:bg-zinc-100 text-[1.3rem] font-semibold mt-[1.2rem]"
              >
                Adicionar imagem
              </button>
            </label>
          </div>
          <Input
            label={"Título"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={titulo}
            setValue={setTitulo}
          />
          <Input
            label={"Preço"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={preco}
            setValue={setPreco}
          />
          <Input
            label={"Preço anterior"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={precoAntigo}
            setValue={setPrecoAntigo}
          />
          <Input
            label={"Categoria"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={categoria}
            setValue={setCategoria}
          />
          <Input
            label={"Sessão"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={section}
            setValue={setSection}
          />
          <div className="mt-[1.2rem]">
            <span className="text-[1.8rem] font-medium bricolage text-dark-900 dark:text-dark-100 mb-[.4rem] block">
              Tags
            </span>
            <div className="flex flex-wrap gap-[1rem]">
              {produtoAtivo.tags?.map((t, index) => (
                <p
                  key={index}
                  className="text-[1.4rem] p-[.5rem] px-[1rem] rounded-full dark:bg-zinc-100 font-medium"
                >
                  {t}
                </p>
              ))}
              <button
                type="button"
                className="text-[1.4rem] p-[.5rem] px-[1rem] rounded-full dark:bg-zinc-800 dark:text-zinc-100 font-medium"
              >
                Adicionar +
              </button>
            </div>
          </div>
          <div className="mt-[1.2rem]">
            <span className="text-[1.8rem] font-medium bricolage text-dark-900 dark:text-dark-100 mb-[.4rem] block">
              Descrição do produto
            </span>
            <Editor value={descricao} setValue={setDescricao} />
          </div>
          <button
            type="submit"
            className="bg-zinc-900 text-zinc-100 dark:text-zinc-900 dark:bg-zinc-100 p-[1rem] text-[1.4rem] font-semibold rounded-[.5rem] mt-[1.2rem]"
          >
            Editar produto
          </button>
        </Modal>
      )}
      {modalCriarProduto && (
        <Modal
          onCloseModal={() => {
            setTitulo("");
            setPreco("");
            setPrecoAntigo("");
            setDescricao("");
            setCategoria("");
            setSection("");
            setImages(null);
            setTags(null);
          }}
          type={"form"}
          className={"modal-editar-produto min-h-[50%] max-w-[35vw] py-[3rem]"}
          setModal={setModalCriarProduto}
          action={() => {
            // setProdutoAtivo(null);
            criarProduto();
          }}
        >
          <h1 className="dark:text-zinc-50 text-[2rem] font-semibold mb-[.8rem]">
            Criar produto
          </h1>
          <div className=" pb-[1rem]">
            <div className="flex gap-[1rem] overflow-x-auto">
              {previewImages?.map((i, n) => (
                <div className="relative" key={n}>
                  <img
                    className="w-[180px] h-[160px] object-cover rounded-lg"
                    src={i}
                  />
                  <button
                    onClick={() =>
                      setPreviewImages(previewImages.filter((im) => im != i))
                    }
                    type="button"
                    className="absolute top-0 right-0 p-[.7rem] rounded-[.5rem] bg-zinc-800 bg-opacity-30 text-red-500"
                  >
                    <Trash2 className="w-[2rem] h-[2rem]" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
            <label className="relative flex w-fit h-fit">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setImages(files);

                  const previewImages = files.map((file) => {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        resolve(e.target.result); // Resultado é uma URL de dados (blob)
                      };
                      reader.readAsDataURL(file); // Lê o arquivo como URL de dados
                    });
                  });

                  Promise.all(previewImages)
                    .then((results) => {
                      setPreviewImages(results); // Define o estado com as URLs de dados das imagens
                    })
                    .catch((error) => {
                      console.error("Erro ao ler imagens:", error);
                    });
                }}
                className="absolute h-full w-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="p-[1rem] rounded-[.5rem] dark:bg-zinc-100 text-[1.3rem] font-semibold mt-[1.2rem]"
              >
                Adicionar imagem
              </button>
            </label>
          </div>
          <Input
            label={"Título"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={titulo}
            setValue={setTitulo}
          />
          <Input
            label={"Preço"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={preco}
            setValue={setPreco}
          />
          <Input
            label={"Preço anterior"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={precoAntigo}
            setValue={setPrecoAntigo}
          />
          <Input
            label={"Categoria"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={categoria}
            setValue={setCategoria}
          />
          <Input
            label={"Sessão"}
            className="mt-[1.2rem] "
            inputClassNames="text-[1.4rem]"
            value={section}
            setValue={setSection}
          />
          <div className="mt-[1.2rem]">
            <span className="text-[1.8rem] font-medium bricolage text-dark-900 dark:text-dark-100 mb-[.4rem] block">
              Tags
            </span>
            <div className="flex flex-wrap gap-[1rem]">
              {tags?.map((t, index) => (
                <p
                  key={index}
                  className="text-[1.4rem] p-[.5rem] px-[1rem] rounded-full dark:bg-zinc-100 font-medium"
                >
                  {t}
                </p>
              ))}
              <button
                type="button"
                className="text-[1.4rem] p-[.5rem] px-[1rem] rounded-full dark:bg-zinc-800 dark:text-zinc-100 font-medium"
              >
                Adicionar +
              </button>
            </div>
          </div>
          <div className="mt-[1.2rem]">
            <span className="text-[1.8rem] font-medium bricolage text-dark-900 dark:text-dark-100 mb-[.4rem] block">
              Descrição do produto
            </span>
            <Editor value={descricao} setValue={setDescricao} />
          </div>
          <button
            type="submit"
            className="bg-zinc-900 text-zinc-100 dark:text-zinc-900 dark:bg-zinc-100 p-[1rem] text-[1.4rem] font-semibold rounded-[.5rem] mt-[1.2rem]"
          >
            Editar produto
          </button>
        </Modal>
      )}
      {message && <Message setMessage={setMessage} {...message} />}
    </>
  );
};

export default Produtos;
