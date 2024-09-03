import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import Loader from "@components/ui/Loader";
import { Fragment } from "react";
import useUserStore from "@store/UserStore";
import { useState } from "react";
import { Star } from "lucide-react";
import Message from "@utils/Message";
import { X } from "lucide-react";
const Compras = () => {
  const {userActive} = useUserStore()
  const [avaliarProduto, setAvaliarProduto] = useState(false)
  const [produtoAtivo, setProdutoAtivo] = useState(null)
  const [avaliacao, setAvaliacao] = useState(0);
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const { data: compras, isFetching } = useQuery(
    "compras",
    async () =>
      (
        await axios.get(
          `${import.meta.env.VITE_API_DEVELOPMENT}/conta/compras`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("auth_token_user")}`,
            },
          }
        )
      ).data
  );
  const {data:produtos, isLoading: loadingProducts, refetch: reloadComments} = useQuery("produtos-avaliados", async()=> (await axios.get(`${import.meta.env.VITE_API_DEVELOPMENT}/produtos`)).data)

 async function rateProduct(id){
    const comentario = {
      name: userActive.name,
      comment,
      title,
      userId: userActive.id,
      rate: avaliacao
    }
    setLoading(true)
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_DEVELOPMENT}/produto/comentarios/adicionar/${id}`, {...comentario}, {headers: {Authorization: `Bearer ${Cookies.get("auth_token_user")}`}})
      console.log(response)
      setAvaliarProduto(false)
      reloadComments()
      setMessage({type: "success", title: "Avaliação enviada", text: "Sua avaliação foi recebida, muito obrigado por avaliar a gente ;)"})
      setComment("")
      setTitle("")
      setAvaliacao(0)
    }
    catch(err){
      console.log(err)
      setMessage({type: "error", title: "Erro ao enviar avaliação", text: "Ocorreu um erro ao enviar sua avaliação, se o problema persistir, entre em contato conosco."})
    }finally{
      setLoading(false)
    }
  }

  if (isFetching) return <Loader />;
  return (
    <>
    <div>
      <h1 className="dark:text-dark-50 text-[3rem] font-semibold mb-[2rem]">
        Compras
      </h1>
      {compras.map((i) => (
        <div key={i.id} className="mt-[1rem] flex flex-col">
          <h2 className="dark:text-dark-200 text-[2.4rem] mb-[1.2rem]">
            Pedido: {i.id}
          </h2>
            <div className=" gap-[1rem]">
              {i.items.map((p) => (
                <div className=" gap-[1rem] grid  mb-[1rem]" style={{gridTemplateColumns: "auto 1fr"}} key={p.id}>
                  <img
                    className="max-w-[200px] min-w-[200px] min-h-[180px] max-h-[180px] object-cover rounded-[.5rem]"
                    src={p.images[0]}
                    
                  />
                  <div>
                  <span className="text-[2.6rem] dark:text-dark-100 font-medium mb-[.4rem] block">{p.title}</span>
                  <div className="flex gap-[1rem] items-center">
                    <span className="text-dark-200 text-[2.2rem]">R$ {p.price}</span>
                    <span className="text-dark-400 text-[1.6rem] line-through italic">R$ {p.oldPrice}</span>
                  </div>
                  <p className="dark:text-dark-400 text-[1.8rem] mt-[1rem]">Quantidade: {p.quantity}</p>
                  </div>
                  {!loadingProducts && !produtos.find(produto => produto._id === p._id)?.comments.some(comment => comment.userId === userActive.id) && (
                    <button onClick={()=> {
                      setProdutoAtivo(p)
                      setAvaliarProduto(true)
                    }} className="dark:bg-dark-50 rounded-[.5rem] p-[1rem] text-[1.8rem] w-fit">
                      Avaliar produto
                    </button>
                  )}
                </div>
              ))}
            </div>
          
        </div>
      ))}
    </div>
   {avaliarProduto &&  <div className="flex items-center justify-center h-[100vh] w-[100vw] fixed left-0 top-0 bg-dark-900 z-[5] bg-opacity-30">
      <div className="dark:bg-dark-900 border dark:border-dark-700 p-[3rem] rounded-[.5rem] min-w-[30%] min-h-[30%] relative">
        <button onClick={()=> {
          setAvaliarProduto(false)
          setProdutoAtivo(null)
        }} className="absolute top-6 right-6 dark:text-dark-500 p-[.5rem] rounded-[.5rem] hover:bg-dark-800">
        <X/>
        </button>
        <h1 className="dark:text-dark-50 text-[2.4rem] font-semibold mb-[2rem]">O que você achou do produto?</h1>
        <div className="flex gap-[1rem] border-b pb-[1em] dark:border-dark-700">
        <img src={produtoAtivo.images[0]} className="max-w-[100px] rounded-[.5rem]" alt="" />
        <h2 className="dark:text-dark-100 text-[1.8rem] font-medium">{produtoAtivo.title}</h2>
        </div>
        <div className="mt-[1rem]">
          <span className="text-[1.8rem] dark:text-dark-100">Qual sua nota para o produto?</span>
          <div className="flex mt-[.4rem] gap-[.2rem]">
            {[1, 2, 3, 4, 5].map((estrela) => (
              <button
                key={estrela}
                onClick={() => setAvaliacao(estrela)}
                className="focus:outline-none "
              >
                {estrela <= avaliacao ? <Star className="dark:text-dark-50 dark:fill-dark-50"/> : <Star className="dark:text-dark-50 "/>}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-[2rem] flex flex-col">
          <label htmlFor="titulo" className="bricolage text-[2rem] font-medium dark:text-dark-50 mb-[.4rem] after:text-red-500 after:ml-1 after:content-['*']">Título da avaliação</label>
          <input type="text" value={title} onChange={({target})=> setTitle(target.value)} className="input-text" id="titulo" />
        </div>
        <div className="mt-[2rem] flex flex-col">
          <label htmlFor="avaliacao" className="bricolage text-[2rem] font-medium dark:text-dark-50 mb-[.4rem] after:text-red-500 after:ml-1 after:content-['*']">Escreva sua avaliação</label>
          <textarea value={comment} onChange={({target})=> setComment(target.value)} name="" id="avaliacao" className="input-text min-h-[200px] resize-none leading-[1.3]" ></textarea>
        </div>
        <button onClick={()=> rateProduct(produtoAtivo._id)} className="text-[1.6rem] dark:text-dark-900 dark:bg-dark-50 p-[1rem] font-medium mt-[1.2rem] rounded-[.5rem]">Enviar avaliação</button>
      </div>
    </div>}
    {message && <Message {...message} setMessage={setMessage} />}
    {loading && <Loader/>}
    </>
  );
};

export default Compras;
