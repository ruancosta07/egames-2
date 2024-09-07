import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import propTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useState } from "react";
import useUserStore from "@store/UserStore";
import Cookies from "js-cookie";
import {Heart, CircleX, CheckCircle, ShoppingCart} from "lucide-react"
const GridSection = ({ produtos }) => {
    const { setCart, setFavorites, favorites, signed } = useUserStore();
    const [message, setMessage] = useState(null);
    const timeOut = useRef();
    const navigateTo = useNavigate()
    async function addProductCart(id) {
      try {
  
        const response = (
          await axios.post(
            `${import.meta.env.VITE_API_PRODUCTION}/conta/carrinho/adicionar`,
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
            `${import.meta.env.VITE_API_PRODUCTION}/conta/favoritos/adicionar`,
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
    <div className="grid lg:grid-cols-4 gap-[2rem] my-[1rem]">
      {produtos.map((p) => (
        <Link
          to={`/produto/${p._id}/${p.slug}`}
          key={p._id}
          className="flex flex-col relative"
        >
          <button
            onClick={(e) => {
              if (!signed) {
                navigateTo("/login");
              }
              e.preventDefault();
              favorites.find(f=> f._id == p._id) ? removeProductFavorites(p._id) : addProductFavorites(p._id);
            }}
            className="absolute p-[1.2rem] rounded-full bg-dark-200 dark:bg-dark-800 -right-5 -top-5 z-[4]"
          >
            {favorites.find(f=> f._id == p._id) ? (
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
            src={p.images[0]}
            className=" rounded-[1rem] max-h-[240px] min-h-[240px] object-cover mb-[1.2rem]"
            alt=""
          />
          <h1 className="text-[2.4rem] font-semibold text-dark-900 dark:text-dark-100 leading-[1.115] mb-[.8rem] ">
            {p.title}
          </h1>
          <div className="flex gap-[1.4rem] items-center font-semibold mb-[1.2rem]">
            <span className="text-[1.8rem] text-dark-900 text-opacity-80 dark:text-dark-200">
              R$ {p.price}
            </span>
            <span className="text-[1.6rem] text-dark-900 dark:text-dark-200 italic line-through text-opacity-50">
              R$ {p.oldPrice}
            </span>
          </div>
          <div className="flex gap-[1rem] dark:text-dark-900 text-dark-100 mt-auto ">
            <button
              onClick={(e) => {
                if (!signed) {
                  navigateTo("/login");
                }
                addProductCart();
                e.preventDefault();
              }}
              className="bg-dark-900 dark:bg-dark-100 w-full justify-center flex items-center gap-[1rem] p-[1rem] text-[1.6rem] rounded-md font-semibold hover:invert duration-300 ease-in-out"
            >
              {message === null && (
                <>
                  Adicionar ao carrinho <ShoppingCart width={20} height={20} />
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
          </div>
        </Link>
      ))}
    </div>
  );
};

GridSection.propTypes = {
    produtos: propTypes.array
}

export default GridSection;
