import useUserStore from "@store/UserStore";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import gsap from "gsap";
import { useRef } from "react";
import { CreditCard } from "lucide-react";
import Message from "@utils/Message";
import Cookies from "js-cookie";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { CheckCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Loader from "@components/ui/Loader";
import { useEffect } from "react";
import { ConfettiSideCannons } from "@components/magicui/confetti";
const Checkout = () => {
  const [step, setStep] = useState(1);
  const { userActive, loadingData, cart, orders, setCart } = useUserStore();
  const timeOut = useRef();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [creditCard, setCreditCard] = useState({
    number: "",
    cvv: "",
    expiration: "",
  });
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null);
  const [complete, setComplete] = useState(false)
  const [endereco, setEndereco] = useState({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
  });
  function limitCreditCard(value) {
    let cleanedValue = value.replace(/\D/g, "");
    let formattedValue = cleanedValue.match(/.{1,4}/g)?.join(" ") || "";

    setCreditCard({ ...creditCard, number: formattedValue.slice(0, 19) });
  }

  function limitCvv(value) {
    let cleanedValue = value.replace(/\D/g, "");
    setCreditCard({ ...creditCard, cvv: cleanedValue.slice(0, 3) });
  }

  function formatDate(value) {
    let cleanedValue = value.replace(/\D/g, "");
    let day = cleanedValue.slice(0, 2); // Dia
    let month = cleanedValue.slice(2, 4); // Mês
    let year = cleanedValue.slice(4, 8); // Ano
    let formattedValue = day;

    if (day.length === 2 && month.length > 0) {
      formattedValue += "/";
    }

    if (month.length === 2 && year.length > 0) {
      formattedValue += month + "/";
    } else if (month.length > 0) {
      formattedValue += month;
    }

    if (year.length > 0) {
      formattedValue += year;
    }

    setCreditCard({ ...creditCard, expiration: formattedValue });
  }

  function advanceToStep3() {
    // Verifica se o método de pagamento é "creditCard" e se os campos de crédito estão completos
    const isCreditCard = paymentMethod === "creditCard";
    const isCreditCardValid =
      creditCard.number.length >= 19 &&
      creditCard.expiration.length >= 10 &&
      creditCard.cvv.length === 3;

    // Verifica se o método de pagamento está definido
    const isPaymentMethodValid = paymentMethod !== "";

    // Verifica se há campos incompletos ou pagamento inválido
    if (
      (isCreditCard && !isCreditCardValid) ||
      (!isCreditCard && !isPaymentMethodValid)
    ) {
      setMessage({
        type: "error",
        title: "Campos incompletos",
        text: "Preencha todos os dados de pagamento antes de prosseguir",
      });
    } else {
      // Transição para o passo 3
      gsap.to(".step-2", {
        opacity: 0,
        x: "-30vw",
        duration: 0.3,
        onComplete: () => {
          setStep(3);
          clearTimeout(timeOut.current);
          timeOut.current = setTimeout(() => {
            gsap.fromTo(
              ".step-3",
              { opacity: 0, x: "30vw" },
              { x: 0, opacity: 1, duration: 0.3 }
            );
          });
        },
      });
    }
  }

  const totalItens = ()=>{
    if(loadingData === false){
    const cartNumber = cart?.map((i) => Number(i.price * i.quantity));
    return cartNumber.reduce((a, b) => a + b + 0);
  }
  }
  const discount = ()=>{
    if(loadingData === false){
    const cartNumber = cart?.map((i) => Number(i.oldPrice * i.quantity));
    return cartNumber.reduce((a, b) => a + b + 0);
  }
  }

  function getFutureDate(daysToAdd) {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + daysToAdd);
    return futureDate.toLocaleDateString();
    // return futureDate.toLocaleDateString('pt-BR', {
    //   weekday: "long",
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric"
    // });
  }

 async function confirmOrder(e){
    e.preventDefault()
    const token = Cookies.get("auth_token_user")
    if(token){
      try{
        const order = {
          id: orders[orders.length - 1].id,
          paymentMethod,
          total: totalItens(),
          discount: discount(),
          shipAdress: userActive.adress,
          orderDate: getFutureDate(Math.round(Math.random() * 30)),
          shipTax: Math.round(Math.random() * 20),
          status: "finished",
        }
        const response = (await axios.post(`${import.meta.env.VITE_API_PRODUCTION}/conta/confirmar-pedido`, {order}, {headers: {Authorization: `Bearer ${token}`}})).data
        setStep(4)
        setCart(response.cart)
        setComplete(true)
        clearTimeout(timeOut.current)
        timeOut.current = setTimeout(()=> setComplete(false), 5000)
      }
      catch(err){
        console.log(err)
      }
    }
  }

  async function getUserAdressByCep({ target }) {
    const { value } = target;
    const formatedValue = value.slice(0, 8);
    setEndereco({ ...endereco, cep: formatedValue });
    if (formatedValue.length === 8) {
      setLoading(true);
      try {
        const viaCepUrl = `https://viacep.com.br/ws/${formatedValue}/json/`;
        const response = (await axios.get(viaCepUrl)).data;
        setEndereco(prevValue=>({
          ...prevValue,
          estado: response.uf,
          bairro: response.bairro,
          logradouro: response.logradouro,
          cidade: response.localidade,
          numero: "",
          complemento: ""
        }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

  async function saveAdress(e){
    e.preventDefault()
    const token = Cookies.get("auth_token_user")
      if(Object.keys(endereco).every(i => endereco[i].length !== '') && token){
        const adress = endereco
        setLoading(true)
        try{
          const response = (await axios.patch(`${import.meta.env.VITE_API_PRODUCTION}/conta/atualizar`, {adress}, {headers: {Authorization: `Bearer ${token}`}})).data
          gsap.to(".step-1", {
            opacity: 0,
            x: "-30vw",
            duration: 0.3,
            onComplete: () => {
              setStep(2);
              clearTimeout(timeOut.current);
              timeOut.current = setTimeout(() => {
                gsap.fromTo(
                  ".step-2",
                  { opacity: 0, x: "30vw" },
                  { x: 0, opacity: 1, duration: 0.3 }
                );
              });
            },
          });
        }
        catch(err){
          console.log(err)
        }finally{
          setLoading(false)
        }
      }
    }
  

  useEffect(()=>{
    if(loadingData === false){
      setEndereco({...userActive.adress})
    }
  }, [loadingData, userActive])

  if(loadingData === false && !orders.some(o=> o.status === 'pending')) return <Navigate to={"/"}/>
  if (loadingData === false && orders.some(o=> o.status === 'pending'))
    return (
      <section>
        <div className="max-w-[85%] lg:max-w-[65%] mx-auto py-[10vh] overflow-x-clip overflow-y-clip">
          {step <= 3 && (
            <ol className="flex max-lg:flex-col lg:items-center max-lg:gap-[.4rem] w-full font-medium text-center text-gray-500 dark:text-gray-400 text-[2.4rem] lg:text-[2rem] bricolage">
              <li
                className={`flex md:w-full items-center text-blue-600 dark:text-zinc-50 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ${
                  step < 1
                    ? "dark:after:border-zinc-700"
                    : "dark:after:border-zinc-50"
                }`}
              >
                <span className="flex items-center after:content-[''] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                  {step == 1 ? (
                    <span className="me-2 max-lg:w-[2.4rem] max-lg:h-[2.4rem]">
                      1
                    </span>
                  ) : (
                    <CheckCircle2 className="dark:stroke-zinc-50 me-2" />
                  )}
                  Informações{" "}
                  <span className="hidden sm:inline-flex sm:ms-2">
                    pessoais
                  </span>
                </span>
              </li>
              <li
                className={`flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 ${
                  step == 3
                    ? "dark:after:border-zinc-50"
                    : "dark:after:border-zinc-700"
                } ${step == 2 ? "dark:text-dark-50" : ""}`}
              >
                <span
                  className={`flex items-center after:content-[''] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500 ${
                    step >= 2 ? "text-dark-50" : "text-dark-300"
                  }`}
                >
                  {step > 2 ? (
                    <CheckCircle2 className="dark:stroke-zinc-50 me-2" />
                  ) : (
                    <span className="me-2 max-lg:w-[2.4rem] max-lg:h-[2.4rem]">
                      2
                    </span>
                  )}
                  Pagamento
                </span>
              </li>
              <li className="flex items-center">
                <span className="me-2 max-lg:w-[2.4rem] max-lg:h-[2.4rem]">
                  3
                </span>
                Confirmação
              </li>
            </ol>
          )}
          {step === 1 && (
            <>
              <div className=" mt-[8rem] step-1">
                <h1 className="dark:text-dark-50 text-[3rem] leading-[1.215] lg:text-[4rem] font-semibold">
                  Endereço de entrega
                </h1>
                <div className="grid lg:grid-cols-2 gap-[1.6rem] mt-[1.2rem]">
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
                    >
                      Cep
                    </label>
                    <input
                      value={endereco.cep}
                      onChange={({ target }) => getUserAdressByCep({ target })}
                      type="text"
                      id="email"
                      className="input-text"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
                    >
                      Estado
                    </label>
                    <input
                      value={endereco.estado}
                      onChange={({ target }) =>
                        setEndereco({ ...endereco, estado: target.value })
                      }
                      type="text"
                      id="email"
                      className="input-text"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
                    >
                      Cidade
                    </label>
                    <input
                      value={endereco.cidade}
                      onChange={({ target }) =>
                        setEndereco({ ...endereco, cidade: target.value })
                      }
                      type="text"
                      id="email"
                      className="input-text"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
                    >
                      Bairro
                    </label>
                    <input
                      value={endereco.bairro}
                      onChange={({ target }) =>
                        setEndereco({ ...endereco, bairro: target.value })
                      }
                      type="text"
                      id="email"
                      className="input-text"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
                    >
                      Logradouro
                    </label>
                    <input
                      value={endereco.logradouro}
                      onChange={({ target }) =>
                        setEndereco({ ...endereco, logradouro: target.value })
                      }
                      type="text"
                      id="email"
                      className="input-text"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
                    >
                      Número
                    </label>
                    <input
                      value={endereco.numero}
                      onChange={({ target }) =>
                        setEndereco({ ...endereco, numero: target.value })
                      }
                      type="text"
                      id="email"
                      className="input-text"
                    />
                  </div>
                  <div className="flex flex-col col-span-full">
                    <label
                      htmlFor="email"
                      className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
                    >
                      Complemento
                    </label>
                    <input
                      value={endereco.complemento}
                      onChange={({ target }) =>
                        setEndereco({ ...endereco, complemento: target.value })
                      }
                      type="text"
                      id="email"
                      className="input-text"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="ml-auto dark:bg-zinc-50 dark:text-zinc-800 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md block"
                  onClick={saveAdress}
                >
                  Avançar
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="step-2 mt-[4rem]">
                <h1 className="dark:text-dark-50 text-[3rem] leading-[1.215] lg:text-[4rem] font-semibold">
                  Informações de pagamento
                </h1>
                <div className="flex max-lg:flex-col mt-[1.2rem] gap-[2rem] justify-start">
                  <label
                    className={`${
                      paymentMethod === "creditCard"
                        ? "dark:text-zinc-900 dark:bg-zinc-50 border-zinc-50"
                        : "dark:text-zinc-500 border-zinc-500"
                    } p-[1.5rem] border flex gap-[1rem] rounded-[.5rem] text-[2rem] items-center bricolage w-full ease-in-out duration-300`}
                  >
                    <input
                      value={"creditCard"}
                      onChange={({ target }) => setPaymentMethod(target.value)}
                      name="payment-method"
                      type="radio"
                      hidden
                    />
                    <CreditCard />
                    Cartão de crédito
                  </label>
                  <label
                    className={`${
                      paymentMethod === "ticket"
                        ? "dark:text-zinc-900 dark:bg-zinc-50 border-zinc-50"
                        : "dark:text-zinc-500 border-zinc-500"
                    } p-[1.5rem] border flex gap-[1rem] rounded-[.5rem] text-[2rem] items-center bricolage w-full ease-in-out duration-300`}
                  >
                    <input
                      value={"ticket"}
                      onChange={({ target }) => setPaymentMethod(target.value)}
                      name="payment-method"
                      type="radio"
                      hidden
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      className={`${
                        paymentMethod === "ticket"
                          ? "dark:fill-zinc-900"
                          : "dark:fill-zinc-500"
                      }`}
                      viewBox="0 0 256 256"
                    >
                      <path d="M232,48V88a8,8,0,0,1-16,0V56H184a8,8,0,0,1,0-16h40A8,8,0,0,1,232,48ZM72,200H40V168a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16Zm152-40a8,8,0,0,0-8,8v32H184a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V168A8,8,0,0,0,224,160ZM32,96a8,8,0,0,0,8-8V56H72a8,8,0,0,0,0-16H32a8,8,0,0,0-8,8V88A8,8,0,0,0,32,96ZM80,80a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,80,80Zm104,88V88a8,8,0,0,0-16,0v80a8,8,0,0,0,16,0ZM144,80a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,144,80Zm-32,0a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,112,80Z"></path>
                    </svg>
                    Boleto bancário
                  </label>
                  <label
                    className={`${
                      paymentMethod === "pix"
                        ? "dark:text-zinc-900 dark:bg-zinc-50 border-zinc-50"
                        : "dark:text-zinc-500 border-zinc-500"
                    } p-[1.5rem] border flex gap-[1rem] rounded-[.5rem] text-[2rem] items-center bricolage ease-in-out duration-300 w-full`}
                  >
                    <input
                      value={"pix"}
                      onChange={({ target }) => setPaymentMethod(target.value)}
                      name="payment-method"
                      type="radio"
                      hidden
                    />
                    <CreditCard />
                    Pix
                  </label>
                </div>

                {paymentMethod === "creditCard" && (
                  <div className="grid grid-cols-2 gap-[2rem] mt-[2rem]">
                    <div className="flex flex-col">
                      <label className="text-[2rem] font-medium dark:text-zinc-200 bricolage mb-[.4rem]">
                        Número do cartão
                      </label>
                      <input
                        type="text"
                        value={creditCard.number}
                        onChange={({ target }) => limitCreditCard(target.value)}
                        className="input-text"
                      />
                    </div>
                    <div className=" flex flex-col">
                      <label className="text-[2rem] font-medium dark:text-zinc-200 bricolage mb-[.4rem]">
                        Data de validade
                      </label>
                      <input
                        type="text"
                        value={creditCard.expiration}
                        onChange={({ target }) => formatDate(target.value)}
                        className="input-text"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[2rem] font-medium dark:text-zinc-200 bricolage mb-[.4rem]">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={creditCard.cvv}
                        onChange={({ target }) => limitCvv(target.value)}
                        className="input-text"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className=" dark:bg-zinc-50 dark:text-zinc-800 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md"
                    onClick={() => {
                      gsap.to(".step-2", {
                        opacity: 0,
                        x: "30vw",
                        duration: 0.3,
                        onComplete: () => {
                          setStep(1);
                          clearTimeout(timeOut.current);
                          timeOut.current = setTimeout(() => {
                            gsap.fromTo(
                              ".step-1",
                              { opacity: 0, x: "-30vw" },
                              { x: 0, opacity: 1, duration: 0.3 }
                            );
                          });
                        },
                      });
                    }}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    className=" dark:bg-zinc-50 dark:text-zinc-800 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md"
                    onClick={advanceToStep3}
                  >
                    Avançar
                  </button>
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <form
              onSubmit={(e) => confirmOrder(e)}
              className="step-3 mt-[4rem] mb-[8rem]"
            >
              <h1 className="dark:text-dark-50 text-[3rem] lg:text-[4rem] font-semibold mb-[2rem]">
                Confirmar pedido
              </h1>
              <div>
                {cart.map((i, index) => (
                  <div key={index} className="flex gap-[1rem] mt-[1.2rem]">
                    <img
                      className="w-[100px] h-[100px] lg:max-w-[200px] lg:max-h-[180px] lg:min-w-[200px] lg:min-h-[180px] object-cover rounded-[.5rem]"
                      src={i.images[0]}
                      alt=""
                    />
                    <div className="flex flex-col">
                      <span className="dark:text-dark-100 text-[2rem] leading-[1.215] lg:text-[2.6rem] font-semibold mb-[.8rem]">
                        {i.title}
                      </span>
                      <div className="flex gap-[1rem] items-center">
                        <span className="dark:text-dark-200 text-[1.8rem] lg:text-[2.3rem] font-medium">
                          R$ {i.price}
                        </span>
                        <span className="dark:text-dark-300 text-[1.4rem] font-medium italic line-through">
                          R$ {i.oldPrice}
                        </span>
                      </div>
                      <p className="mt-[.8rem] text-[1.4rem] lg:text-[1.6rem] dark:text-dark-300 font-medium">
                        Quantidade: {i.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <span className="ml-auto block text-[2rem] dark:text-dark-100 mt-[2rem] font-medium">
                Total do pedido: R$ {totalItens().toFixed(2)}
              </span>
              <div className="flex justify-between">
                <button
                  type="button"
                  className=" dark:bg-zinc-50 dark:text-zinc-800 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md"
                  onClick={() => {
                    gsap.to(".step-3", {
                      opacity: 0,
                      x: "30vw",
                      duration: 0.3,
                      onComplete: () => {
                        setStep(2);
                        clearTimeout(timeOut.current);
                        timeOut.current = setTimeout(() => {
                          gsap.fromTo(
                            ".step-2",
                            { opacity: 0, x: "-30vw" },
                            { x: 0, opacity: 1, duration: 0.3 }
                          );
                        });
                      },
                    });
                  }}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className=" dark:bg-zinc-50 dark:text-zinc-800 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md"
                >
                  Confirmar pedido
                </button>
              </div>
            </form>
          )}
          {step === 4 && (
            <div className="lg:pt-[8vh]">
              <CheckCircle2 className="dark:text-dark-50 mx-auto w-[6rem] h-[6rem] lg:w-[10rem] lg:h-[10rem]" />
              <h1 className="dark:text-dark-50 leading-[1.215] text-[3rem] lg:text-[6rem] text-center font-bold mt-[1.2rem] lg:mt-[2rem] mb-[.8rem]">
                Seu pedido foi confirmado!
              </h1>
              <p className="text-center dark:text-dark-300 text-[1.4rem] lg:text-[2rem] max-w-[70ch] mx-auto leading-[1.3]">
                Obrigado por comprar conosco, você pode continuar comprando ou
                ver mais informações sobre seu pedido no seu perfil.
              </p>
              <div className="flex justify-center mt-[2rem] gap-[1rem]">
                <Link
                  to={"/"}
                  className="border w-fit dark:bg-dark-50 dark:text-dark-900 p-[1rem] px-[2rem] rounded-[.5rem] text-[1.8rem] font-medium"
                >
                  Início
                </Link>
                <Link
                  to={"/conta/compras"}
                  className="border dark:border-dark-700 dark:text-dark-100 p-[1rem] px-[2rem] rounded-[.5rem] text-[1.8rem] font-medium"
                >
                  Ver pedido
                </Link>
              </div>
              {complete && <ConfettiSideCannons/>}
            </div>
          )}
        </div>
        {message && <Message {...message} setMessage={setMessage} />}
        {loading && <Loader />}
      </section>
    );
};

export default Checkout;
