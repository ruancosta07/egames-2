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
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { ChartNoAxesColumnDecreasing } from "lucide-react";
import { Home } from "lucide-react";
import { SunDim } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { LogOutIcon } from "lucide-react";
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
    notifications,
    userActive
  } = useUserStore();
  const [modalUser, setModalUser] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [foundProducts, setFoundProducts] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const searchBar = useRef();
  const navigateTo = useNavigate();
  const pathname = useLocation().pathname;
  const [desktop, setDesktop] = useState(null);
  const [lastProducts, setLastProducts] = useState(() => {
    const localProducts = localStorage.getItem("lastProducts");
    return localProducts ? JSON.parse(localProducts) : [];
  });
  const timeOut = useRef();

  useEffect(() => {
    function resizeScreen() {
      if (innerWidth < 1024) {
        setDesktop(false);
      } else {
        setDesktop(true);
      }
    }
    window.addEventListener("resize", resizeScreen);
    return () => window.removeEventListener("resize", resizeScreen);
  }, []);

  useEffect(() => {
    if (innerWidth < 1024) {
      setDesktop(false);
    } else {
      setDesktop(true);
    }
  }, []);

  function logoutUser() {
    Cookies.remove("auth_token_user");
    setCart([]);
    setFavorites([]);
    setSigned(false);
  }

  function showSearchBar() {
    // if(searchActive){
    gsap.to(".search-product", { width: desktop ? "50%" : "100%" });
    gsap.to(".search-product input", {
      width: "100%",
      onComplete: () => setSearchActive(true),
    });
    // }
  }

  function hiddeSearchbar() {
    if (searchValue == "") {
      gsap.to(".search-product", {
        width: desktop ? "30%" : "100%",
        onStart: () => {
          clearTimeout(timeOut.current);
          timeOut.current = setTimeout(() => setSearchActive(false), 100);
        },
      });
    }
    // gsap.to(".search-product input", {width: "fit-content"})
  }

  useEffect(() => {
    if (desktop) {
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
    }
  }, [searchActive, searchValue, desktop]);

  useEffect(() => {
    setSearchValue("");
    setSearchActive(false);
    gsap.to(".search-product", {
      width: desktop ? "30%" : "100%",
      duration: 0,
    });
  }, [pathname, desktop]);

  const queryClient = useQueryClient();

  const { mutate: searchProducts } = useMutation(
    ["pesquisar-produto-header"],
    async (value) => {
      setSearchValue(value);
      if (value === "") {
        setFoundProducts([]);
        return;
      }
      setLoading(true);
      try {
        const response = await (
          await axios.get(
            `${import.meta.env.VITE_API_PRODUCTION}/produtos/pesquisar`,
            { params: { search: value } }
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
  function activeSidebar() {
    const menuLocal = !menuMobile;
    setMenuMobile(menuLocal);
    if (menuLocal) {
      const tl = gsap.timeline();
      tl.to(".sidebar-container", { display: "block", duration: 0.05 });
      tl.fromTo(
        ".sidebar-mobile",
        { right: "-20%", opacity: 0 },
        { opacity: 1, right: 0, duration: 0.15 }
      );
    } else {
      const tl = gsap.timeline();
      tl.fromTo(
        ".sidebar-mobile",
        { right: 0, opacity: 1 },
        { opacity: 0, right: "-100%", duration: 0.15 }
      );
      tl.to(".sidebar-container", { display: "none", duration: 0.15 });
    }
  }

  useEffect(() => {
    if (modalUser) {
      gsap.fromTo(
        ".modal-user",
        { opacity: 0, scale: 0.7, y: -12 },
        { opacity: 1, scale: 1, y: 0, duration: .1 }
      );
    }
  }, [modalUser]);

  useEffect(()=> {
    if(theme && theme === "dark"){
      gsap.to(".theme-container button", {x: "100%", duration: .15})
    }
    else{
      gsap.to(".theme-container button", {x: "0%", duration: .15})
    }
  }, [theme])

  return (
    <>
      <header>
        <div className="container-width py-[4rem]  flex-wrap flex items-center gap-[2rem]">
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
          {!desktop && (
            <>
              <label className="flex ml-auto">
                <input
                  type="checkbox"
                  checked={menuMobile}
                  onChange={() => {
                    activeSidebar();
                  }}
                  hidden
                />

                <ChartNoAxesColumnDecreasing className="text-dark-800 dark:text-dark-100 w-[3.2rem] h-[3.2rem] -rotate-[90deg]" />
              </label>
              <div
                onClick={activeSidebar}
                className="sidebar-container w-[100vw] h-[100dvh] z-[30] bg-dark-900 fixed top-0 left-0 bg-opacity-30 hidden"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="sidebar-mobile h-full bg-dark-900 w-[80%] absolute right-0 border-l border-dark-700 px-[4rem] py-[6rem]"
                >
                  <button
                    onClick={activeSidebar}
                    className="text-dark-50 p-[1rem] rounded-[.5rem] absolute left-[2.5rem] top-4"
                  >
                    <X />
                  </button>
                  {!signed && (
                    <div className="flex flex-col h-full">
                      <Link
                        className="text-dark-100 text-[2rem] py-[1rem] font-medium"
                        to={"/login"}
                      >
                        Login
                      </Link>
                      <Link
                        className="text-dark-100 text-[2rem] py-[1rem] font-medium"
                        to={"/criar-conta"}
                      >
                        Criar conta
                      </Link>
                    </div>
                  )}
                  {signed && (
                    <div className="flex flex-col h-full">
                      <Link
                        className="text-dark-100 text-[2rem] py-[1rem] font-medium flex gap-[.8rem]"
                        to={"/"}
                      >
                        <Home />
                        Início
                      </Link>
                      <Link
                        className="text-dark-100 text-[2rem] py-[1rem] font-medium flex gap-[.8rem]"
                        to={"/conta/perfil"}
                      >
                        <UserRound />
                        Conta
                      </Link>
                      <Link
                        className="text-dark-100 text-[2rem] py-[1rem] font-medium flex gap-[.8rem]"
                        to={"/conta/carrinho"}
                      >
                        <ShoppingCart />
                        Carrinho
                      </Link>
                      <Link
                        className="text-dark-100 text-[2rem] py-[1rem] font-medium flex gap-[.8rem]"
                        to={"/conta/favoritos"}
                      >
                        <Heart />
                        Favoritos
                      </Link>
                    </div>
                  )}
                  {/* <div className="h-[48px] relative mx-[1rem] w-[2px] bg-dark-100 dark:bg-dark-800"></div> */}
                  <button
                    onClick={switchTheme}
                    className="p-[1rem] px-[1.5rem] border text-dark-800 bg-dark-100 dark:bg-dark-900 dark:text-dark-50 border-dark-100 dark:border-dark-800 rounded-md mt-auto block"
                  >
                    {theme === "dark" ? <MoonStar /> : <SunMedium />}
                  </button>
                </div>
              </div>
            </>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigateTo(`/pesquisar/${searchValue.toLowerCase()}`);
            }}
            className={`search-product lg:ml-auto flex items-center justify-end w-full max-lg:mt-[1rem] lg:w-[30%] relative`}
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
                      <button className="dark:text-dark-100 text-[1.4rem] lg:text-[2rem] font-semibold">
                        Buscar por: {searchValue} ({foundProducts?.length || 0}{" "}
                        resultados){" "}
                      </button>
                      {searchValue &&
                        foundProducts &&
                        foundProducts.map((p) => (
                          <Link
                            onClick={() => {
                              saveProductToLastProducts(p);
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
            <span className="text-dark-500 absolute max-lg:hidden font-semibold text-[1.8rem] right-6 z-[4]">
              {searchActive ? "Esc" : "Ctrl K"}
            </span>
          </form>

          {desktop && (
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
                  <button
                    className="relative"
                    onClick={() => setModalUser(!modalUser)}
                  >
                    <div className="w-[35px] h-[35px] bg-gradient-to-tr from-orange-500 to-fuchsia-900 rounded-full border border-zinc-300 dark:border-zinc-800">

                    </div>
                    {modalUser && (
                      <div className="opacity modal-user bg-dark-50 flex flex-col border dark:border-dark-800 rounded-md dark:text-dark-100 items-start absolute w-max right-0 dark:bg-zinc-900 cursor-auto top-[110%] z-[4] inter gap-[.5rem] rounded-lg">
                       <div className="flex flex-col border-b pb-[.6rem] dark:border-zinc-800 p-[1rem]">
                       <span className="text-[1.4rem] mb-[.4rem] text-start">{userActive.name}</span>
                        <p className="text-[1.2rem] font-normal dark:text-dark-300">{userActive.email}</p>
                       </div>
                        <div className="flex flex-col w-full p-[.5rem] border-b dark:border-zinc-800">
                        <Link
                          to={"/conta/perfil"}
                          className="text-[1.3rem] hover:bg-zinc-200 hover:dark:bg-dark-800 dark:text-dark-300 duration-200 ease-in-out font-normal w-full text-start flex items-center gap-[.6rem] p-[.8rem] rounded-lg cursor-default"
                        >
                          <UserRound className="w-[1.6rem] h-[1.6rem]"/>
                          Minha conta
                        </Link>
                        <Link
                          to={"/admin/dashboard"}
                          className="text-[1.3rem] hover:bg-zinc-200 hover:dark:bg-dark-800 dark:text-dark-300 duration-200 ease-in-out font-normal w-full text-start flex items-center gap-[.6rem] p-[.8rem] rounded-lg cursor-default"
                        >
                          <LayoutDashboard className="w-[1.6rem] h-[1.6rem]"/>
                          Dashboard
                        </Link>
                        <button
                          onClick={logoutUser}
                          className="text-[1.3rem] hover:bg-zinc-200 hover:dark:bg-dark-800 dark:text-dark-300 duration-200 ease-in-out font-normal w-full text-start flex items-center gap-[.6rem] p-[.8rem] rounded-lg cursor-default"
                        >
                          <LogOutIcon className="w-[1.6rem] h-[1.6rem]"/>
                          Sair
                        </button>

                        </div>
                        <div onClick={(e)=> e.stopPropagation()} className="flex w-full justify-between cursor-pointer p-[.8rem] px-[1.3rem]">
                        <button
                          className="text-[1.3rem] hover:dark:text-dark-100 dark:text-dark-300 py-[.4rem]  duration-200 ease-in-out font-normal w-full text-start"
                        >
                          Tema
                        </button>
                        <div onClick={()=> switchTheme(theme === "dark" ? "light": "dark")} className={`theme-container w-[56px] rounded-full border dark:border-zinc-800 p-[.3rem] flex duration-200`}>
                          <button  className={`  flex bg-zinc-300 dark:bg-zinc-800 rounded-full  justify-end `}>
                            {theme === "dark" ? <MoonStar className="w-[1.8rem] h-[1.8rem]"/> : <SunDim className="w-[1.8rem] h-[1.8rem]"/>  }
                          </button>
                        </div>
                        </div>
                      </div>
                    )}
                  </button>
                </>
              )}
              {/* <div className="h-[48px] relative mx-[1rem] w-[2px] bg-dark-100 dark:bg-dark-800"></div>
              <button
                onClick={switchTheme}
                className="p-[1rem] px-[1.5rem] border text-dark-800 dark:text-dark-50 border-dark-100 dark:border-dark-800 rounded-md"
              >
                {theme === "dark" ? <MoonStar /> : <SunMedium />}
              </button> */}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
