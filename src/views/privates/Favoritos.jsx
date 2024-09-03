import Header from "@components/ui/Header";
import useUserStore from "@store/UserStore";
import { Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import { MessageCircleX } from "lucide-react";
import { CircleSlash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MinusCircle } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { HeartCrack } from "lucide-react";
import { useEffect } from "react";
import gsap from "gsap";
import Message from "@utils/Message";
import { useState } from "react";
const Favoritos = () => {
  const { favorites, signed, setFavorites, setCart } = useUserStore();
  const [message, setMessage] = useState(null)
  const desconto = () => {
    if (signed) {
      const cartNumber = favorites?.map((i) => Number(i.oldPrice));
      return cartNumber.reduce((a, b) => a + b + 0);
    }
  };
  const total = () => {
    if (signed) {
      const cartNumber = favorites?.map((i) => Number(i.price));
      return cartNumber.reduce((a, b) => a + b + 0);
    }
  };

  async function removeItemFromFavorites(id) {
    const token = Cookies.get("auth_token_user");
    if (token) {
      try {
        const response = (
          await axios.delete(
            `${
              import.meta.env.VITE_API_DEVELOPMENT
            }/conta/favoritos/remover/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ).data;
        setFavorites(response);
      } catch (err) {
        console.log(err);
      }
    }
  }

 async  function moveItemToCart(id){
    try{
      const response = (await axios.post(`${import.meta.env.VITE_API_DEVELOPMENT}/conta/mover-para-carrinho`, {id}, {headers: {Authorization: `Bearer ${Cookies.get("auth_token_user")}`}})).data
      setFavorites(response.favorites)
      setCart(response.cart)
      setMessage({type: "success", title: "Item movido para o carrinho"})
    }
    catch(err){
      console.log(err)
      setMessage({type: "error", title: "Esse item já está no seu carrinho"})
    }
  }

  useEffect(()=>{
    if(favorites.length == 0){
      gsap.fromTo("[data-animate='favoritos']", {opacity: 0, y: 32}, {opacity: 1, y: 0, stagger: .1})
    }
  },[favorites])

  if (favorites)
    return (
      <>
        <section className="mt-[4rem]">
          <div className="container-width">
            {favorites.length > 0 && (
              <>
                <h1 className="text-[6rem] font-semibold dark:text-dark-100">
                  Meus Favoritos
                </h1>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr .4fr",
                    gap: "4rem",
                  }}
                >
                  <div className="itens flex flex-col justify-start gap-[3rem] mt-[1.2rem]">
                    {favorites.map((item) => {
                      return (
                        <div key={item.id} className="flex gap-[2rem]">
                          <img
                            src={item.images[0]}
                            className="max-w-[240px] min-w-[240px] max-h-[240px] min-h-[240px] rounded-[1rem] object-cover"
                            alt=""
                          />
                          <div>
                            <span className="dark:text-dark-100 text-[3rem] font-semibold mb-[1rem] block">
                              {item.title}
                            </span>
                            <div className="flex gap-[1rem] items-center">
                              <span className="dark:text-dark-100 text-[2.4rem] font-semibold">
                                R$ {item.price}
                              </span>
                              <span className="dark:text-dark-500 text-[1.8rem] font-semibold line-through italic">
                                R$ {item.oldPrice}
                              </span>
                            </div>
                            <button onClick={()=> moveItemToCart(item._id)} className="p-[1rem] dark:bg-dark-50 dark:text-dark-900 text-[1.7rem] mt-[1.2rem] rounded-[.5rem] font-medium">Mover para o carrinho</button>
                          </div>
                          <button
                            onClick={() => removeItemFromFavorites(item._id)}
                            className="h-fit ml-auto"
                          >
                            <Trash2 className="text-red-600" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="resumo sticky top-8 h-fit">
                    <h3 className="dark:text-dark-100 text-[3rem] font-semibold mb-[.8rem]">
                      Resumo do pedido
                    </h3>
                    <div className="flex justify-between mb-[1.2rem]">
                      <span className="dark:text-dark-300 text-[1.75rem]">
                        Total de itens
                      </span>
                      <span className="dark:text-dark-300 text-[1.75rem]">
                        {favorites.length}
                      </span>
                    </div>
                    <div className="flex justify-between mb-[1.2rem]">
                      <span className="dark:text-dark-300 text-[1.75rem]">
                        Desconto
                      </span>
                      <span className="dark:text-dark-300 text-[1.75rem]">
                        R$ {(desconto() - total()).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="dark:text-dark-100 text-[2.4rem] font-semibold">
                        Total
                      </span>
                      <span className="dark:text-dark-100 text-[2.4rem] font-semibold">
                        R$ {total().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {favorites.length == 0 && (
              <>
                <HeartCrack className="w-[12.8rem] h-[12.8rem] dark:text-dark-100 mx-auto mb-[2rem] mt-[15vh]" data-animate="favoritos" />
                <h1 className="dark:text-dark-100 text-[8rem] font-semibold mx-auto text-center max-w-[20ch] mb-[1.2rem]" data-animate="favoritos">
                  Oops, parece que sua lista de favoritos está vazia
                </h1>
                <p className="text-dark-300 text-[2rem] text-center" data-animate="favoritos">
                  Assim que você adicionar itens aos seus favoritos eles irão
                  aparecer aqui.
                </p>
                <Link
                  to={"/"}
                  className="mx-auto block dark:bg-dark-100 dark:text-dark-900 w-fit mt-[2rem] p-[1rem] font-semibold text-[2rem] rounded-md" data-animate="favoritos"
                >
                  Adicionar itens aos favoritos
                </Link>
              </>
            )}
          </div>
        </section>
        {message && <Message {...message} setMessage={setMessage} />}
      </>
    );
};

export default Favoritos;
