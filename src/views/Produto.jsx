import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { CircleX } from "lucide-react";
import { Star } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import useUserStore from "../store/UserStore";
import { useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
import { FileText } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Tags } from "lucide-react";
import SlideSection from "@components/ui/SlideSection";
import { useQuery } from "react-query";
import Footer from "@components/ui/Footer";
import dayjs from "@utils/Dayjs"
const Produto = () => {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgActive, setImgActive] = useState(null);
  const { id, slug } = useParams();
  const pathname = useLocation().pathname;
  const [message, setMessage] = useState(null);
  const [favProduct, setFavProduct] = useState(null);
  const { favorites, setFavorites, setCart, signed } = useUserStore();
  const navigateTo = useNavigate();
  const { data: products, isFetching } = useQuery(
    "produtos-relacionados",
    async () => {
      return (
        await axios.get(`${import.meta.env.VITE_API_DEVELOPMENT}/produtos`)
      ).data;
    }
  );
  

  function calcularMediaAvaliacoes(avaliacoes) {
    if (avaliacoes.length === 0) return 0;

    const somaNotas = avaliacoes.reduce(
      (soma, avaliacao) => soma + avaliacao.rate,
      0
    );

    const media = somaNotas / avaliacoes.length;

    return Math.round(media);
  }

  function criarElementoEstrelas(notaMedia) {
    const totalEstrelas = 5;

    // Cria um array de JSX para as estrelas
    const estrelas = [];

    // Adiciona estrelas completas
    for (let i = 0; i < notaMedia; i++) {
      estrelas.push(
        <Star
          key={`filled-${i}`}
          className="dark:fill-dark-300 dark:stroke-dark-300"
        />
      );
    }

    // Adiciona estrelas vazias
    for (let i = notaMedia; i < totalEstrelas; i++) {
      estrelas.push(
        <Star
          key={`empty-${i}`}
          className="dark:fill-dark-700 dark:stroke-dark-700"
        />
      );
    }

    return <div className="flex gap-[.3rem]">{estrelas}</div>;
  }
  // Exemplo de uso:

  const timeOut = useRef();
  async function addProductCart() {
    try {
      const response = (
        await axios.post(
          `${import.meta.env.VITE_API_DEVELOPMENT}/conta/carrinho/adicionar`,
          {id},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("auth_token_user")}`,
            },
          }
        )
      ).data;
      setCart(response.cart);
      setMessage({ type: "success", title: "Produto adicionado ao carrinho" });
    } catch {
      setMessage({ type: "error", title: "Produto já adicionado ao carrinho" });
    } finally {
      clearTimeout(timeOut.current);
      timeOut.current = setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  }

  async function addProductFavorites(id) {
    try {
      const response = (
        await axios.post(
          `${import.meta.env.VITE_API_DEVELOPMENT}/conta/favoritos/adicionar`,
          {id},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("auth_token_user")}`,
            },
          }
        )
      ).data;
      setFavorites(response);
    } catch (err) {
      console.log(err);
    }
  }

  async function removeProductFavorites(id) {
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

  //  async function confirmOrder(e){
  //   e.preventDefault()
  //   const token = Cookies.get("auth_token_user")
  //   if(token){
  //     try{
  //       const orders = cart
  //       const response = await axios.post(`${import.meta.env.VITE_API_DEVELOPMENT}/conta/confirmar-pedido`, orders, {headers: {Authorization: `Bearer ${token}`}})
  //       console.log(response.data)
  //     }
  //     catch(err){
  //       console.log(err)
  //     }
  //   }
  // }

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const response = (
          await axios.get(
            `${import.meta.env.VITE_API_DEVELOPMENT}/produto/${id}/${slug}`
          )
        ).data;
        setProduto(response);
        setImgActive(response.images[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, slug]);

  useEffect(()=> {
    scrollTo(0,0)
  },[])
  if (loading) return <Loader />;
  if (!loading && produto)
    return (
      <>
        <section>
          <div
            className="container-width grid gap-[4rem] mt-[4vh]"
            style={{ gridTemplateColumns: "auto 1fr .5fr" }}
          >
            {/* <div className="flex flex-col gap-[1rem]"> */}

            <div
              className="images flex flex-col gap-[1rem]"
              data-animate="produto-inicio"
            >
              {produto?.images.map((i) => (
                <img
                  onClick={() => setImgActive(i)}
                  key={i}
                  src={i}
                  className={`max-w-[180px] min-h-[160px] max-h-[160px] rounded-[1rem] object-cover ${
                    imgActive === i ? "" : "brightness-[.40]"
                  }`}
                />
              ))}
            </div>
            <div data-animate="produto-inicio">
              <img
                src={imgActive}
                alt=""
                className="max-h-[70vh] min-h-[70vh]  object-cover object-top rounded-[1rem]"
              />
            </div>
            {/* </div> */}
            <div className="mr-auto" data-animate="produto-inicio">
              <h1 className="text-[4rem] text-dark-900 font-semibold leading-[1.115] mb-[.4rem] dark:text-dark-100">
                {produto?.title}
              </h1>
              <div className="flex items-center gap-[2rem] mb-[1.2rem]">
                <div className="flex">
                  {/* <Star className="stroke-dark-100 fill-dark-100" />
                  <Star className="stroke-dark-100 fill-dark-100" />
                  <Star className="stroke-dark-100 fill-dark-100" />
                  <Star className="stroke-dark-700 fill-dark-700" />
                  <Star className="stroke-dark-700 fill-dark-700" /> */}
                  {criarElementoEstrelas(
                    calcularMediaAvaliacoes(produto?.comments)
                  )}
                </div>
                <span className="dark:text-dark-200 text-[2rem] font-medium">
                  ({produto.comments.length} avaliações)
                </span>
              </div>
              <div className="flex gap-[2rem] items-center mb-[.8rem]">
                <span className="text-[3rem] font-semibold dark:text-dark-100">
                  R$ {produto.price}
                </span>
                <span className="text-[2rem] font-medium dark:text-dark-500 line-through italic">
                  R$ {produto.oldPrice}
                </span>
              </div>
              <p className="text-dark-900 dark:text-dark-300 text-[1.6rem] leading-[1.4] max-w-[90%]">
                À vista no pix com até 5% off Em até 10x de R$ 23,40 sem juros
                no cartão ou em 1x com 5% off
              </p>
              <div className="flex gap-[1rem] mt-[1.2rem]">
                <button
                  onClick={(e) => {
                    if (!signed) {
                      navigateTo("/login");
                    }
                    addProductCart();
                    e.preventDefault();
                  }}
                  className="bg-dark-900 text-dark-100 dark:text-dark-900 dark:bg-dark-100 w-full justify-center flex items-center gap-[1rem] p-[1.4rem] text-[2rem] rounded-md font-semibold hover:invert duration-300 ease-in-out"
                >
                  {message === null && (
                    <>
                      Adicionar ao carrinho <ShoppingCart />
                    </>
                  )}
                  {message && message.type === "success" && (
                    <>
                      Produto adicionado <CheckCircle />
                    </>
                  )}
                  {message && message.type !== "success" && (
                    <>
                      Já está no carrinho <CircleX />
                    </>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    if (!signed) {
                      navigateTo("/login");
                    }
                    e.preventDefault();
                    setFavProduct(!favProduct);
                    favProduct
                      ? removeProductFavorites(produto._id)
                      : addProductFavorites(produto._id);
                  }}
                  className="bg-dark-900 dark:bg-dark-100 flex items-center gap-[1rem] p-[1rem] rounded-md font-semibold "
                >
                  {favProduct || favorites.some((f) => f._id == produto._id) ? (
                    <Heart
                      width={28}
                      height={28}
                      strokeWidth={1.75}
                      className="stroke-dark-50 dark:stroke-dark-900 fill-dark-50 dark:fill-dark-900 duration-300 ease-in-out"
                    />
                  ) : (
                    <Heart
                      width={28}
                      height={28}
                      strokeWidth={1.75}
                      className="stroke-dark-50 dark:stroke-dark-900 duration-300 ease-in-out"
                    />
                  )}
                </button>
              </div>
            </div>
            <div
              className="col-span-full mb-[6vh]"
              data-animate="produto-descricao"
            >
              <h1 className="text-[4rem] font-semibold dark:text-dark-100 mt-[4rem] mb-[1.2rem] flex gap-[1rem] items-center">
                <FileText />
                Descrição do produto
              </h1>
              <div
                className="dark:text-dark-300 text-[1.8rem] descricao"
                dangerouslySetInnerHTML={{ __html: produto.description }}
              ></div>
            </div>
            <div className="col-span-full mb-[6vh]">
              <h1 className="text-[4rem] font-semibold dark:text-dark-100 mt-[4rem] mb-[1.2rem] flex gap-[1rem] items-center">
                <MessageCircle />
                Avaliações do produto
              </h1>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(0,33%))] gap-[2rem] comentarios">
                {produto.comments.map((c, index) => (
                  <div
                    key={index}
                    className=" p-[2rem] rounded-[.5rem] border dark:border-dark-800 w-full"
                    data-animate="comentarios"
                  >
                    <span className="text-[2rem] dark:text-dark-100 font-semibold block mb-[.4rem]">
                      {c.user}
                    </span>

                    {criarElementoEstrelas(
                      calcularMediaAvaliacoes(produto?.comments)
                    )}
                    <p className="text-dark-300 mt-[.8rem] text-[1.6rem]">
                      Avaliado em {dayjs(c.createdAt).tz("America/Sao_Paulo").format("DD/MM/YYYY")}
                    </p>
                    <h2 className="mt-[1.2rem] font-semibold dark:text-dark-100 text-[2.4rem] leading-[1.15]">
                      {c.title}
                    </h2>
                    <p className="text-[1.6rem] text-dark-400 mt-[.4rem] leading-[1.3]">
                      {c.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-full mb-[6vh]">
            <h1 className="container-width text-[4rem] font-semibold dark:text-dark-100 mt-[4rem] mb-[1.2rem] flex gap-[1rem] items-center">
              <Tags />
              Produtos relacionados
            </h1>
            {!isFetching && (
              <SlideSection
                products={products.filter(
                  (p) => p.category === produto.category
                )}
              />
            )}
          </div>
        </section>
        <Footer />
        {loading && <Loader />}
      </>
    );
};

export default Produto;
