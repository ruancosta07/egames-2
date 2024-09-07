import Message from "@utils/Message";
import axios from "axios";
import { EyeOff } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Eye } from "lucide-react";
import { Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../store/UserStore";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
const Login = () => {
  const { setUserActive, setCart, setSigned, setFavorites, setPreferences, loadingData, signed } = useUserStore();
  const [rememberMe, setRememberMe] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [userError, setUserError] = useState({
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigateTo = useNavigate();
  const timeOut = useRef();

  async function login(e) {
    e.preventDefault();
    const newUserError = {
      email: !user.email,
      password: !user.password,
    };
    setUserError(newUserError);
    if (!userError.email && !userError.password) {
      setLoading(true);
      try {
        const response = (
          await axios.post(
            `${import.meta.env.VITE_API_PRODUCTION}/login`,
            user
          )
        ).data;
        setSigned(true);
        setUserActive(response.user);
        setMessage({
          type: "success",
          title: "Login feito com sucesso",
          text: "Você será redirecionado(a) para a página inicial...",
        });
        setCart(response.cart);
        setFavorites(response.favorites);
        setPreferences(response.preferences)
        Cookies.set("auth_token_user", response.token, {
          expires: rememberMe ? 100 : null,
        });
        clearTimeout(timeOut.current);
        timeOut.current = setTimeout(() => {
          navigateTo("/");
        }, 4000);
      } catch (err) {
        setMessage({
          type: "error",
          title: "Email ou senha incorretos",
          text: "Verifique seu email e senha antes de tentar entrar novamente",
        });
      } finally {
        setLoading(false);
      }
    }
  }
  if(signed && loadingData === false) return <Navigate to={"/"}/>
  return (
    <section className="">
      <div
        className="container-width grid lg:grid-cols-[1fr_.9fr] min-h-[100vh] items-center gap-[6rem]"
        // style={{ gridTemplateColumns: "1fr .9fr" }}
      >
        <img
          src="/images/bg-1.jpg"
          className="h-[90%] object-cover rounded-[2rem] max-lg:hidden"
          alt=""
        />
        <form className="" onSubmit={(e) => login(e)}>
          <Link
            to={"/"}
            className="text-[3rem] font-semibold text-dark-900 dark:text-dark-100 flex gap-[.8rem] items-center col-span-full mb-[4vh]"
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
          </Link>
          <h1 className="dark:text-dark-100 text-[3rem] font-semibold">
            Bem vindo(a) de volta
          </h1>
          <div className="mt-[2rem] flex flex-col">
            <label
              htmlFor="email"
              className="text-[2.4rem] dark:text-dark-100 bricolage font-medium mb-[.4rem]"
            >
              Email
            </label>
            <div>
              <input
                type="email"
                id="email"
                value={user.email}
                onChange={({ target }) => {
                  setUser({ ...user, email: target.value });
                  if (target.value.length > 0) {
                    setUserError({ ...userError, email: false });
                  }
                }}
                className={`p-[1rem] text-[1.8rem] outline-none rounded-md bg-dark-200 bg-opacity-30 dark:bg-dark-800 dark:bg-opacity-80  ease-in-out duration-300 border w-full dark:text-dark-200 ${
                  userError.email
                    ? "border-red-600"
                    : "border-transparent  focus:dark:border-dark-500 hover:dark:border-dark-500 focus:border-dark-300 hover:border-dark-300 "
                }`}
              />
              {userError.email && (
                <span className="text-[1.3rem] text-red-600 block mt-[.4rem]">
                  Preencha o campo acima
                </span>
              )}
            </div>
          </div>
          <div className="mt-[2rem] flex flex-col">
            <label
              htmlFor="senha"
              className="text-[2.4rem] dark:text-dark-100 bricolage font-medium mb-[.4rem]"
            >
              Senha
            </label>
            <div className="relative">
              <input
                type={seePassword ? "text" : "password"}
                id="senha"
                value={user.password}
                onChange={({ target }) => {
                  setUser({ ...user, password: target.value });
                  if (target.value.length > 0) {
                    setUserError({ ...userError, password: false });
                  }
                }}
                className={`p-[1rem] text-[1.8rem] outline-none rounded-md bg-dark-200 bg-opacity-30 dark:bg-dark-800 dark:bg-opacity-80  ease-in-out duration-300 border w-full dark:text-dark-200 ${
                  userError.password
                    ? "border-red-600"
                    : "border-transparent  focus:dark:border-dark-500 hover:dark:border-dark-500 focus:border-dark-300 hover:border-dark-300 "
                }`}
              />
              {userError.password && (
                <span className="text-[1.3rem] text-red-600 block mt-[.4rem]">
                  Preencha o campo acima
                </span>
              )}
              <button
                type="button"
                onClick={() => setSeePassword(!seePassword)}
              >
                {seePassword ? (
                  <EyeOff className="text-dark-700 dark:text-dark-500 absolute right-4 top-2/4 -translate-y-2/4" />
                ) : (
                  <Eye className="text-dark-700 dark:text-dark-500 absolute right-4 top-2/4 -translate-y-2/4" />
                )}
              </button>
            </div>
          </div>
          <div className="flex max-lg:flex-col max-lg:gap-[2rem] justify-between lg:items-center mt-[1rem] lg:mt-[2rem]">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="bricolage flex items-center leading-none gap-[.4rem] text-[1.8rem] font-medium dark:text-dark-300"
            >
              <div
                className={`w-8 h-8 border border-dark-800 dark:border-dark-300 rounded-md border-opacity-50 flex items-center justify-center text-dark-900 ${
                  rememberMe ? "bg-dark-900 dark:bg-dark-100" : ""
                }`}
              >
                {rememberMe && (
                  <Check
                    className={`text-dark-100 dark:text-dark-800`}
                    strokeWidth={2}
                  />
                )}
              </div>
              <span>Lembrar de mim</span>
            </button>
            <Link to={"/esqueceu-a-senha"} className="text-dark-900 dark:text-dark-300 text-opacity-60 underline underline-offset-2 text-[1.8rem] font-medium leading-none">
              Esqueci minha senha
            </Link>
          </div>
          <button
            className="mt-[4rem] rounded-md text-[2.4rem] font-semibold bg-dark-900 text-dark-50 w-full py-[1.4rem] dark:bg-dark-50 dark:text-dark-900"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <div className="flex justify-between">
            <Link
              to={"/"}
              className="flex gap-[.4rem] items-center text-[1.4rem] font-semibold mt-[1.2rem] text-dark-900 dark:text-dark-300 text-opacity-60"
            >
              <ArrowLeft className="w-[1.8rem] h-[1.8rem]" />
              Voltar para o início
            </Link>
            <Link
              to={"/criar-conta"}
              className="flex gap-[.4rem] items-center text-[1.4rem] font-semibold mt-[1.2rem] text-dark-900 dark:text-dark-300 text-opacity-60"
            >
              Ainda não possuo conta
            </Link>
          </div>
        </form>
      </div>
      {message && <Message {...message} setMessage={setMessage} />}
    </section>
  );
};

export default Login;
