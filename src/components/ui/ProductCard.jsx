import axios from "axios";
import { Heart } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import propTypes from "prop-types";
import { useState } from "react";
import Cookies from "js-cookie";
import useUserStore from "../../store/UserStore";
import Message from "@utils/Message";
import { useRef } from "react";
import { CheckCircle } from "lucide-react";
import { CircleX } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const ProductCard = ({ title, image, price, discount, id, slug, ...props }) => {
  const { setCart, setFavorites, favorites, signed } = useUserStore();
  const [favProduct, setFavProduct] = useState(() => {
    return favorites.length > 0 && favorites.some((f) => f._id === id);
  });
  const [message, setMessage] = useState(null);
  const timeOut = useRef();
  const navigateTo = useNavigate();
  async function addProductCart() {
    try {
      const response = (
        await axios.post(
          `${import.meta.env.VITE_API_PRODUCTION}/conta/carrinho/adicionar`,
          { id },
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

  async function addProductFavorites() {
    try {
      const response = (
        await axios.post(
          `${import.meta.env.VITE_API_PRODUCTION}/conta/favoritos/adicionar`,
          { id },
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

  async function removeProductFavorites() {
    const token = Cookies.get("auth_token_user");
    if (token) {
      try {
        const response = (
          await axios.delete(
            `${
              import.meta.env.VITE_API_PRODUCTION
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

  return (
    <>
      <Link
        to={`/produto/${id}/${slug}`}
        {...props}
        className="lg:min-h-[200px] 2xl:min-h-[300px] flex flex-col relative pt-[1rem]"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!signed) {
              return navigateTo("/login");
            }
            setFavProduct(!favProduct);
            favProduct ? removeProductFavorites() : addProductFavorites();
          }}
          className="absolute p-[1.2rem] rounded-full bg-dark-200 dark:bg-dark-800 -right-4 -top-0 z-[4]"
        >
          {favProduct ? (
            <Heart
              className="text-rose-500 fill-rose-500"
              width={28}
              height={28}
            />
          ) : (
            <Heart className="text-rose-500" width={28} height={28} />
          )}
        </button>
        <img
          src={image}
          className="w-full rounded-[1rem] lg:h-[200px] 2xl:h-[240px] object-cover mb-[1.2rem]"
          alt=""
        />
        <h1 className="text-[2.4rem] font-semibold text-dark-900 dark:text-dark-100 leading-[1.115] mb-[.8rem]">
          {title}
        </h1>
        <div className="flex gap-[1.4rem] items-center font-semibold mb-[1.2rem]">
          <span className="text-[2.4rem] text-dark-900 text-opacity-80 dark:text-dark-200">
            R$ {price}
          </span>
          <span className="text-[1.8rem] text-dark-900 dark:text-dark-400 italic line-through text-opacity-50">
            R$ {discount}
          </span>
        </div>
        <div className="flex gap-[1rem] dark:text-dark-900 text-dark-100 2xl:mt-auto ">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!signed) {
                return navigateTo("/login");
              }
              addProductCart();
            }}
            className="bg-dark-900 dark:bg-dark-100 w-full justify-center flex items-center gap-[1rem] p-[1rem] text-[1.6rem] rounded-md font-semibold hover:invert duration-300 ease-in-out"
          >
            {message === null && (
              <>
                Adicionar ao carrinho <ShoppingCart height={20} width={20} />
              </>
            )}
            {message && message.type === "success" && (
              <>
                Adicionado <CheckCircle height={20} width={20} />
              </>
            )}
            {message && message.type !== "success" && (
              <>
                Já está no carrinho <CircleX height={20} width={20} />
              </>
            )}
          </button>
          {/* <button
            onClick={(e) => {
              if(!signed){
                navigateTo("/login")
              }
              e.preventDefault()
              setFavProduct(!favProduct);
              favProduct ? removeProductFavorites() : addProductFavorites();
            }}
            className="bg-dark-900 dark:bg-dark-100 flex items-center gap-[1rem] px-[1rem] rounded-md font-semibold "
          >
            {favProduct && favorites.some((f) => f._id == id) ? (
              <Heart
                width={24}
                height={24}
                strokeWidth={1.75}
                className="stroke-dark-50 dark:stroke-dark-900 fill-dark-50 dark:fill-dark-900 duration-300 ease-in-out"
              />
            ) : (
              <Heart
                width={24}
                height={24}
                strokeWidth={1.75}
                className="stroke-dark-50 dark:stroke-dark-900  duration-300 ease-in-out"
              />
            )}
          </button> */}
        </div>
      </Link>
    </>
  );
};

ProductCard.propTypes = {
  title: propTypes.string,
  image: propTypes.string,
  price: propTypes.string,
  discount: propTypes.string,
  productLink: propTypes.string,
  quantity: propTypes.number,
  category: propTypes.string,
  id: propTypes.string,
  slug: propTypes.string,
};

export default ProductCard;
