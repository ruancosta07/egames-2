import useUserStore from "@store/UserStore";
import { Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import { CircleSlash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MinusCircle } from "lucide-react";
import { PlusCircle } from "lucide-react";
import Loader from "@components/ui/Loader";
import { useState } from "react";
import gsap from "gsap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {v4 as uuidv4} from "uuid"
const Carrinho = () => {
  const { cart, signed, setCart, loadingData, setOrders, orders } = useUserStore();
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate()
  const desconto = () => {
    if (signed) {
      const cartNumber = cart?.map((i) => Number(i.oldPrice * i.quantity));
      return cartNumber.reduce((a, b) => a + b + 0);
    }
  };
  const total = () => {
    if (signed) {
      const cartNumber = cart?.map((i) => Number(i.price * i.quantity));
      return cartNumber.reduce((a, b) => a + b + 0);
    }
  };

  async function removeItemFromCart(id) {
    const token = Cookies.get("auth_token_user");
    setLoading(true);
    if (token) {
      try {
        const response = (
          await axios.delete(
            `${
              import.meta.env.VITE_API_DEVELOPMENT
            }/conta/carrinho/remover/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ).data;
        setCart(response);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

  async function decreaseItemQuantity(item) {
    if (item.quantity > 1) {
      setLoading(true);
      try {
        const produto = {
          quantity: item.quantity - 1,
          id: item.id,
        };
        const response = (
          await axios.patch(
            `${import.meta.env.VITE_API_DEVELOPMENT}/conta/carrinho/atualizar`,
            produto,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("auth_token_user")}`,
              },
            }
          )
        ).data;
        setCart(response.cart);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }
  async function increaseItemQuantity(item) {
    if (item.quantity >= 1) {
      setLoading(true);
      try {
        const produto = {
          quantity: item.quantity + 1,
          id: item.id,
        };
        const response = (
          await axios.patch(
            `${import.meta.env.VITE_API_DEVELOPMENT}/conta/carrinho/atualizar`,
            produto,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("auth_token_user")}`,
              },
            }
          )
        ).data;
        setCart(response.cart);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

   async function confirmOrder(e) {
     e.preventDefault();
     const token = Cookies.get("auth_token_user");
     if (token) {
      setLoading(true)
      if(!orders.some(o=> o.status === 'pending')){
       try {
         const order = {
            items: cart,
            id: uuidv4(),
            status: "pending",
            total: total(),
            discount: desconto()
         };
         const response = (await axios.post(
           `${import.meta.env.VITE_API_DEVELOPMENT}/conta/finalizar-pedido`,
           {order},
           { headers: { Authorization: `Bearer ${token}` } }
         )).data;
         setOrders(response.orders)
         navigateTo("/conta/checkout")
       } catch (err) {
         console.log(err);
       }finally{
        setLoading(false)
       }
     }
     else{
      navigateTo("/conta/checkout")
     }
    }
   }

  useEffect(() => {
    if (cart.length == 0) {
      gsap.fromTo(
        "[data-animate='carrinho']",
        { opacity: 0, y: 32 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, }
      );
    }
  }, [cart]);

  return (
    <>
      <section className="mt-[4rem]">
        {loadingData === false && (
          <div className="container-width">
            {cart.length > 0 && (
              <>
                <h1 className="text-[6rem] font-semibold dark:text-dark-100">
                  Meu carrinho
                </h1>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr .4fr",
                    gap: "4rem",
                  }}
                >
                  <div className="itens flex flex-col justify-start gap-[3rem] mt-[1.2rem]">
                    {cart.map((item) => {
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
                            <div className="flex items-center gap-[1rem] mt-[1.2rem]">
                              <button
                                onClick={() => decreaseItemQuantity(item)}
                                className=" font-semibold dark:text-zinc-300"
                              >
                                {" "}
                                <MinusCircle />{" "}
                              </button>
                              <span className="text-[3rem] dark:text-zinc-300 font-semibold block">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => increaseItemQuantity(item)}
                                className=" font-semibold dark:text-zinc-300"
                              >
                                {" "}
                                <PlusCircle />{" "}
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItemFromCart(item._id)}
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
                        {cart.length}
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
                      <button onClick={confirmOrder} className="dark:bg-zinc-50 dark:text-zinc-700 w-full p-[1.4rem] mt-[1.2rem] text-[2rem] rounded-[.5rem] font-medium block text-center">Finalizar compra</button>
                  </div>
                </div>
              </>
            )}

            {cart.length == 0 && (
              <>
                <CircleSlash2
                  className="w-[12.8rem] h-[12.8rem] dark:text-dark-100 mx-auto mb-[2rem] mt-[15vh]"
                  data-animate="carrinho"
                />
                <h1
                  className="dark:text-dark-100 text-[8rem] font-semibold mx-auto text-center max-w-[20ch] mb-[1.2rem]"
                  data-animate="carrinho"
                >
                  Oops, parece que seu carrinho está vazio
                </h1>
                <p
                  className="text-dark-300 text-[2rem] text-center"
                  data-animate="carrinho"
                >
                  Assim que você adicionar itens no seu carrinho eles irão
                  aparecer aqui.
                </p>
                <Link
                  to={"/"}
                  className="mx-auto block dark:bg-dark-100 dark:text-dark-900 w-fit mt-[2rem] p-[1rem] font-semibold text-[2rem] rounded-md"
                  data-animate="carrinho"
                >
                  Adicionar itens no carrinho
                </Link>
              </>
            )}
          </div>
        )}
        {loadingData || (loading && <Loader />)}
      </section>
    </>
  );
};

export default Carrinho;
