import { MoonStar } from "lucide-react";
import { SunMedium } from "lucide-react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/UserStore";
import { UserRound } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { Heart } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";
import { Search } from "lucide-react";
import { useEffect } from "react";
import gsap from "gsap";
import { useRef } from "react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { History } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
const Header = ({ products }) => {
  const {
    theme,
    switchTheme,
    signed,
    cart,
    favorites,
    setCart,
    setFavorites,
    setSigned,
    notifications
  } = useUserStore();
  const [modalUser, setModalUser] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [foundProducts, setFoundProducts] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const searchBar = useRef();
  const navigateTo = useNavigate()
  const pathname = useLocation().pathname;
  const [lastProducts, setLastProducts] = useState(() => {
    const localProducts = localStorage.getItem("lastProducts");
    return localProducts ? JSON.parse(localProducts) : [];
  });
  const timeOut = useRef();
  function logoutUser() {
    Cookies.remove("auth_token_user");
    setCart([]);
    setFavorites([]);
    setSigned(false);
  }

  function showSearchBar() {
    // if(searchActive){
    gsap.to(".search-product", { width: "70%" });
    gsap.to(".search-product input", {
      width: "100%",
      onComplete: () => setSearchActive(true),
    });
    // }
  }

  function hiddeSearchbar() {
    if (searchValue == "") {
      gsap.to(".search-product", {
        width: "30%",
        onStart: () => {
          clearTimeout(timeOut.current);
          timeOut.current = setTimeout(() => setSearchActive(false), 100);
        },
      });
    }
    // gsap.to(".search-product input", {width: "fit-content"})
  }

  useEffect(() => {
    function pressCtrlK(e) {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        showSearchBar();
        searchBar.current.focus();
      }
    }

    function pressEsc(e) {
      if (e.key === "Escape" && searchActive && searchValue === "") {
        searchBar.current.blur();
        hiddeSearchbar();
      }
    }

    window.addEventListener("keydown", pressCtrlK);
    window.addEventListener("keyup", pressEsc);
    return () => {
      window.removeEventListener("keydown", pressCtrlK);
      window.removeEventListener("keyup", pressEsc);
    };
  }, [searchActive]);

  useEffect(() => {
    setSearchValue("");
    setSearchActive(false);
    gsap.to(".search-product", {
      width: "30%",
      duration: 0,
    });
  }, [pathname]);

  const queryClient = useQueryClient();

  const {mutate:searchProducts} = useMutation(
    ["pesquisar-produto-header"],
    async(value) => {
      setSearchValue(value);
      if (value === "") {
        setFoundProducts([]);
        return;
      }
      setLoading(true);
      try {
        const response = await (
          await axios.get(
            `${import.meta.env.VITE_API_DEVELOPMENT}/produtos/pesquisar`,
            { params: {search: value} }
          )
        ).data;
        setFoundProducts(response);
        return response;
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData(["pesquisar-produto-header", variables], data);
      },
      onError: (error) => {
        console.error("Erro ao pesquisar produtos:", error);
      },
      cacheTime: 1000 * 60 * 5, // 5 minutos
      staleTime: 1000 * 60 * 2, // 2 minutos
    }
  );

  function saveProductToLastProducts(product) {
    if (!lastProducts.find((p) => p._id == product._id)) {
      setLastProducts([...lastProducts, product]);
    }
  }

  useEffect(() => {
    localStorage.setItem(
      "lastProducts",
      JSON.stringify(lastProducts.reverse())
    );
  }, [lastProducts]);

  return (
    <>
      <header>
        <div className="container-width py-[4rem] flex items-center gap-[2rem]">
          <Link
            to={"/"}
            className="text-[3rem] font-semibold text-dark-900 dark:text-dark-100 flex gap-[.8rem] items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 256 256"
              className="fill-dark-950 dark:fill-dark-50"
            >
              <path d="M176,112H152a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16ZM104,96H96V88a8,8,0,0,0-16,0v8H72a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16ZM241.48,200.65a36,36,0,0,1-54.94,4.81c-.12-.12-.24-.24-.35-.37L146.48,160h-37L69.81,205.09l-.35.37A36.08,36.08,0,0,1,44,216,36,36,0,0,1,8.56,173.75a.68.68,0,0,1,0-.14L24.93,89.52A59.88,59.88,0,0,1,83.89,40H172a60.08,60.08,0,0,1,59,49.25c0,.06,0,.12,0,.18l16.37,84.17a.68.68,0,0,1,0,.14A35.74,35.74,0,0,1,241.48,200.65ZM172,144a44,44,0,0,0,0-88H83.89A43.9,43.9,0,0,0,40.68,92.37l0,.13L24.3,176.59A20,20,0,0,0,58,194.3l41.92-47.59a8,8,0,0,1,6-2.71Zm59.7,32.59-8.74-45A60,60,0,0,1,172,160h-4.2L198,194.31a20.09,20.09,0,0,0,17.46,5.39,20,20,0,0,0,16.23-23.11Z"></path>
            </svg>
            Egames
          </Link>
          <form onSubmit={(e)=> {
            e.preventDefault()
            navigateTo(`/pesquisar/${searchValue.toLowerCase()}`)
          }}
            className={`search-product ml-auto flex items-center justify-end w-[30%] relative`}
          >
            <Search
              className={`${
                searchActive ? "text-dark-500" : "text-dark-500"
              } absolute left-4 w-8 h-8 z-[5]`}
            />
            <input
              ref={searchBar}
              onBlur={hiddeSearchbar}
              onFocus={showSearchBar}
              value={searchValue}
              onChange={({ target }) => searchProducts(target.value)}
              type="text"
              className={`text-[1.8rem] ${
                searchActive
                  ? "bg-dark-100 dark:bg-dark-800"
                  : "bg-dark-300 bg-opacity-30 dark:bg-dark-800"
              } outline-none rounded-md   dark:bg-opacity-80 dark:text-dark-200 ease-in-out duration-300 focus:dark:border-dark-500 hover:dark:border-dark-500 focus:border-dark-300 hover:border-dark-300 border border-transparent pl-[4rem] py-[1rem] placeholder:text-dark-400 w-full z-[4] `}
              placeholder="Pesquisar produto..."
            />
            {searchActive && (
              <div className="products absolute top-[5vh] bg-dark-100 border-dark-300 dark:bg-dark-900 dark:bg-opacity-90 w-full z-[3] border dark:border-dark-700 rounded-[.5rem] flex flex-col p-[2rem] gap-[1rem] max-h-[50vh] overflow-y-auto">
                {loading === false ? (
                  searchValue && (
                    <>
                      <button className="dark:text-dark-100 text-[2rem] font-semibold">
                        Buscar por: {searchValue} ({foundProducts?.length || 0}{" "}
                        resultados){" "}
                      </button>
                      {searchValue &&
                        foundProducts &&
                        foundProducts.map((p) => (
                          <Link
                            onClick={() => {
                              saveProductToLastProducts(p)
                            }}
                            to={`/produto/${p._id}/${p.slug}`}
                            key={p.id}
                            className="flex mt-[1rem] gap-[1rem]"
                          >
                            <img
                              className="max-w-[100px] rounded-[.5rem]"
                              src={p.images[0]}
                              alt=""
                            />
                            <div className="flex flex-col">
                              <span className="text-dark-900 dark:text-dark-100 text-[2rem] font-medium mb-[.4rem]">
                                {p.title}
                              </span>
                              <span className="text-dark-700 dark:text-dark-300 text-[1.8rem]">
                                R$ {p.price}
                              </span>
                            </div>
                          </Link>
                        ))}
                    </>
                  )
                ) : (
                  <Loader2Icon className="dark:text-dark-100 text-dark-900 w-[4.8rem] h-[4.8rem] mx-auto animate-spin ease-in-out" />
                )}
                {searchValue === "" && lastProducts.length > 0 && (
                  <>
                    <span className="text-dark-900 dark:text-dark-100 text-[2rem] font-semibold flex items-center gap-[.4rem]">
                      <History /> Recentes
                    </span>
                    {lastProducts.map((p) => (
                      <Link
                      // onClick={()=> {
                      //   showSearchBar()
                      // }}
                        to={`/produto/${p._id}/${p.slug}`}
                        key={p._id}
                        className="flex mt-[1rem] gap-[1rem]"
                      >
                        <img
                          className="max-w-[100px] rounded-[.5rem]"
                          src={p.images}
                          alt=""
                        />
                        <div className="flex flex-col">
                          <span className="text-dark-800 dark:text-dark-100 text-[2rem] font-medium mb-[.4rem]">
                            {p.title}
                          </span>
                          <span className="text-dark-500 dark:text-dark-300 text-[1.8rem]">
                            R$ {p.price}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}{" "}
            {searchActive && (
              <div className="w-[100vw] h-[100vh] fixed bg-dark-900 left-0 top-0 bg-opacity-50 z-[2]"></div>
            )}
            <span className="text-dark-500 absolute font-semibold text-[1.8rem] right-6 z-[4]">
              {searchActive ? "Esc" : "Ctrl K"}
            </span>
          </form>

          <div className="text-[2.4rem] font-semibold flex gap-[1rem] items-center">
            {!signed && (
              <>
                <Link
                  to={"/login"}
                  className="text-dark-900 dark:text-dark-100 p-[1rem] px-[1.2rem]"
                >
                  Login
                </Link>
                <Link
                  to={"/criar-conta"}
                  className="bg-dark-800 text-dark-50 dark:bg-dark-100 p-[1rem] px-[1.2rem] rounded-md dark:text-dark-900 w-max"
                >
                  Criar conta
                </Link>
              </>
            )}
            {signed && (
              <>
                <button
                  className="relative"
                  onClick={() => setModalUser(!modalUser)}
                >
                  <UserRound className="stroke-dark-900 dark:stroke-dark-100" />
                  {modalUser && (
                    <div className="flex flex-col p-[1rem] border dark:border-dark-700 rounded-md dark:text-dark-300 text-[1.7rem] items-start absolute w-max right-0 dark:bg-dark-900 cursor-auto top-[110%] z-[4]">
                      <Link
                        to={"/conta/perfil"}
                        className="p-[.8rem] dark:hover:bg-dark-800 rounded-md"
                      >
                        Minha conta
                      </Link>
                      <button
                        onClick={logoutUser}
                        className="p-[.8rem] dark:hover:bg-dark-800 rounded-md w-full text-start"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </button>
                <Link to={"/conta/carrinho"} className="relative">
                  <ShoppingCart className="stroke-dark-900 dark:stroke-dark-100" />
                  <span
                    className={`absolute text-[1.5rem] -top-5 ${
                      cart.length < 10
                        ? "-right-[40%] p-[.8rem]"
                        : "-right-[50%] p-[.55rem]"
                    } leading-none bg-dark-900  dark:bg-dark-300 text-dark-100 dark:text-dark-900 rounded-full  py-[.4rem]`}
                  >
                    {cart.length}
                  </span>
                </Link>
                <Link to={"/conta/favoritos"} className="relative">
                  <Heart className="stroke-dark-900 dark:stroke-dark-100" />
                  <span
                    className={`absolute text-[1.5rem] -top-5 ${
                      favorites.length < 10
                        ? "-right-[40%] p-[.8rem]"
                        : "-right-[50%] p-[.55rem]"
                    } leading-none bg-dark-900  dark:bg-dark-300 text-dark-100 dark:text-dark-900 rounded-full py-[.4rem]`}
                  >
                    {favorites.length}
                  </span>
                </Link>
              </>
            )}
            <div className="h-[48px] relative mx-[1rem] w-[2px] bg-dark-100 dark:bg-dark-800"></div>
            <button
              onClick={switchTheme}
              className="p-[1rem] px-[1.5rem] border text-dark-800 dark:text-dark-50 border-dark-100 dark:border-dark-800 rounded-md"
            >
              {theme === "dark" ? <MoonStar /> : <SunMedium />}
            </button>
          </div>
        </div>
      </header>
      
    </>
  );
};

export default Header;
