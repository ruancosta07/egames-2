import Message from "@utils/Message";
import axios from "axios";
import { EyeOff } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Eye } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const CriarConta = () => {
  const [seePassword, setSeePassword] = useState(false);
  const [message, setMessage] = useState(null);
  const name = useRef();
  const timeOut = useRef();
  const navigateTo = useNavigate()
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [newUserError, setNewUserError] = useState({
    name: null,
    email: null,
    password: null,
  });

  async function createAccount(e) {
    e.preventDefault();
    let updatedErrors = { ...newUserError };
    if (newUser.name === "") {
      updatedErrors.name = true;
    } else {
      updatedErrors.name = false;
    }

    if (newUser.email === "") {
      updatedErrors.email = true;
    } else {
      updatedErrors.email = false; // Corrigir erro se o campo não estiver vazio
    }

    if (newUser.password === "") {
      updatedErrors.password = true;
    } else {
      updatedErrors.password = false; // Corrigir erro se o campo não estiver vazio
    }

    // Atualize o estado com o objeto atualizado
    setNewUserError(updatedErrors);
    if (Object.values(updatedErrors).every((i) => !!i === false)) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_PRODUCTION}/criar-conta`,
          { ...newUser }
        );
        setMessage({
          type: "success",
          title: "Usuário criado com sucesso",
          text: "Você será redirecionado(a) para a página de login...",
        });
        clearTimeout(timeOut.current)
        timeOut.current = setTimeout(()=> {
          navigateTo("/login")
        }, 3000)
      } catch (err) {
        console.log(err)
        setMessage({
          type: "error",
          title: err.response.data.message,
        });
      }
    }
  }

  return (
    <>
      <section className="">
        <div className="container-width grid min-h-[100vh] lg:grid-cols-[1fr_.9fr] items-center gap-[6rem]">
          <form className="grid" onSubmit={(e) => createAccount(e)}>
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
              {/* Egames */}
            </Link>
            <h1 className="dark:text-dark-100 text-[3rem] font-semibold">
              Crie sua conta
            </h1>
            <div className="mt-[2rem] flex flex-col">
              <label
                htmlFor="nome"
                className="text-[2.4rem] dark:text-dark-100 bricolage font-medium mb-[.4rem]"
              >
                Nome completo
              </label>
              <div>
                <input
                  type="text"
                  id="nome"
                  spellCheck={false}
                  ref={name}
                  value={newUser.name}
                  onChange={({ target }) => {
                    setNewUser({ ...newUser, name: target.value });
                    if (target.value.length > 0) {
                      setNewUserError({ ...newUserError, name: null });
                    }
                  }}
                  className={`p-[1rem] text-[1.8rem] outline-none rounded-md bg-dark-200 bg-opacity-30 dark:bg-dark-800 dark:bg-opacity-80  ease-in-out duration-300 border w-full dark:text-dark-200 ${
                    newUserError.name
                      ? "border-red-600 "
                      : "border-transparent  focus:dark:border-dark-500 hover:dark:border-dark-500 focus:border-dark-300 hover:border-dark-300 "
                  }`}
                />
                {newUserError.name && (
                  <span className="text-red-600 text-[1.3rem] block mt-[.4rem]">
                    Preencha o campo acima
                  </span>
                )}
              </div>
            </div>
            <div className="mt-[2rem] flex flex-col">
              <label
                htmlFor="email"
                className="text-[2.4rem] dark:text-dark-100 bricolage font-medium mb-[.4rem]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={newUser.email}
                onChange={({ target }) => {
                  setNewUser({ ...newUser, email: target.value });
                  if (target.value.length > 0) {
                    setNewUserError({ ...newUserError, email: false });
                  }
                }}
                className={`p-[1rem] text-[1.8rem] outline-none rounded-md bg-dark-200 bg-opacity-30 dark:bg-dark-800 dark:bg-opacity-80  ease-in-out duration-300 border dark:text-dark-200  ${
                  newUserError.email
                    ? "border-red-600 "
                    : "border-transparent  focus:dark:border-dark-500 hover:dark:border-dark-500 focus:border-dark-300 hover:border-dark-300 "
                }`}
              />
              {newUserError.email && (
                <span className="text-red-600 text-[1.3rem] block mt-[.4rem]">
                  Preencha o campo acima
                </span>
              )}
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
                  value={newUser.password}
                  onChange={({ target }) => {
                    setNewUser({ ...newUser, password: target.value });
                    if (target.value.length > 0) {
                      setNewUserError({ ...newUserError, password: false });
                    }
                  }}
                  className={`p-[1rem] text-[1.8rem] outline-none rounded-md bg-dark-200 bg-opacity-30 dark:bg-dark-800 dark:bg-opacity-80  ease-in-out duration-300 border w-full dark:text-dark-200 ${
                    newUserError.password
                      ? "border-red-600 "
                      : "border-transparent  focus:dark:border-dark-500 hover:dark:border-dark-500 focus:border-dark-300 hover:border-dark-300 "
                  }`}
                />
                {newUserError.password && (
                  <span className="text-red-600 text-[1.3rem] block mt-[.4rem]">
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
            <button
              type="submit"
              className="mt-[4rem] rounded-md text-[2.4rem] font-semibold bg-dark-900 text-dark-50 w-full py-[1.4rem] dark:bg-dark-50 dark:text-dark-900"
            >
              Criar conta
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
                to={"/login"}
                className="flex gap-[.4rem] items-center text-[1.4rem] font-semibold mt-[1.2rem] text-dark-900 dark:text-dark-300 text-opacity-60"
              >
                Já possuo uma conta
              </Link>
            </div>
          </form>
          <img
            src="/images/bg-2.webp"
            className="h-[90%] max-lg:hidden object-cover rounded-[2rem]"
            alt=""
          />
        </div>
      </section>
      {message && <Message setMessage={setMessage} {...message} />}
    </>
  );
};

export default CriarConta;
