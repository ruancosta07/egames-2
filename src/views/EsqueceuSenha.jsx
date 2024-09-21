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
import { useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
const EsqueceuSenha = () => {
  const {
    setUserActive,
    setCart,
    setSigned,
    setFavorites,
    loadingData,
    signed,
  } = useUserStore();
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
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [codigoRecuperacao, setCodigoRecuperacao] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [codigoConfirmado, setCodigoConfirmado] = useState(false)
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("")
  const [verSenha, setVerSenha] = useState(false)
  const [verConfirmarSenha, setVerConfirmarSenha] = useState(false)
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleCodigoChange = (index, value) => {
    if (value.length > 1) {
      // Lidar com colar
      const novoCodigo = value.slice(0, 6).split("").map(char => char.replace(/\D/g, ""));
      setCodigoRecuperacao(novoCodigo);
      novoCodigo.forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].value = digit;
        }
      });
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    } else {
      // Entrada normal
      const novoCodigo = [...codigoRecuperacao];
      novoCodigo[index] = value.replace(/\D/g, "");
      setCodigoRecuperacao(novoCodigo);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codigoRecuperacao[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, "").slice(0, 6);
    const novoCodigo = pastedText.split("").concat(Array(6 - pastedText.length).fill(""));
    setCodigoRecuperacao(novoCodigo);
    novoCodigo.forEach((digit, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };
  async function enviarEmailRecuperacao(e) {
    e.preventDefault();
    const newUserError = {
      email: !user.email,
    };
    setUserError(newUserError);
    if (!userError.email) {
      setLoading(true);
      try {
        const response = (
          await axios.post(
            `${import.meta.env.VITE_API_PRODUCTION}/login/confirmar-email`,
            {email:user.email}
          )
        ).data;
        setEmailEnviado(true)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    }
  }

  async function confirmarCodigo(e){
    e.preventDefault()
    try{
      const response = await axios.post("https://api-egames.vercel.app/login/confirmar-codigo", {code: codigoRecuperacao.join(""), email: user.email})
      setCodigoConfirmado(true)
    }
    catch(err){
      console.log(err)
    }
  }

  async function alterarSenha(e){
    e.preventDefault()
    if(novaSenha === confirmarNovaSenha && codigoConfirmado && codigoRecuperacao.every(i=> i!== "")){
      setLoading(true)
      try{
        const response = await axios.patch("https://api-egames.vercel.app/conta/recuperar-senha", {password: novaSenha, code: codigoRecuperacao.join(""), email: user.email})
        setMessage({type: "success", title: "Senha alterada com sucesso", text: "Você será redirecionado para a página de login..."})
      }
      catch(err){
        console.log(err)
      }finally{
        setLoading(false)
        clearTimeout(timeOut.current)
        timeOut.current = setTimeout(()=> {
          navigateTo("/login")
        }, 4000)
      }
    }
  }
  if (signed && loadingData === false) return <Navigate to={"/"} />;
  return (
    <section className="">
      <div
        className="max-w-[30%] mx-auto min-h-[75vh] items-center gap-[6rem]"
        // style={{ gridTemplateColumns: "1fr .9fr" }}
      >
        {!emailEnviado && !codigoConfirmado && (
          <form
            className="mt-[25vh]"
            onSubmit={(e) => enviarEmailRecuperacao(e)}
          >
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
              Esqueceu a senha?
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

            <button
              className="mt-[4rem] rounded-md text-[2rem] font-semibold bg-dark-900 text-dark-50 w-full py-[1.4rem] dark:bg-dark-50 dark:text-dark-900"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar email"}
            </button>
            <div className="flex justify-between">
              <Link
                to={"/"}
                className="flex gap-[.4rem] items-center text-[1.4rem] font-semibold mt-[1.2rem] text-dark-900 dark:text-dark-300 text-opacity-60"
              >
                <ArrowLeft className="w-[1.8rem] h-[1.8rem]" />
                Voltar para o início
              </Link>
            </div>
          </form>
        )}
        {emailEnviado && !codigoConfirmado && (
          <form onSubmit={(e)=> confirmarCodigo(e)} className="mt-[25vh]">
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
            <h1 className="dark:text-dark-100 text-[3rem] font-semibold mb-[.8rem]">
              Digite o código de recuperação
            </h1>
            <p className="text-[1.6rem] dark:text-dark-300 leading-[1.3]">Enviamos para o seu email um código de 6 digitos, caso não encontre o email, verifique a caixa de spam.</p>
            <div className="flex gap-[1rem] mt-[3.2rem] text-[4rem]">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
              key={index}
              type="text"
              ref={(el) => (inputRefs.current[index] = el)}
              value={codigoRecuperacao[index]}
              onChange={(e) => handleCodigoChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={twMerge("input-text-opt w-full text-center text-[2rem] p-[1.4rem] font-semibold")}
              maxLength={1}
            />
            ))}
            </div>
            <button className="mt-[4rem] rounded-md text-[2rem] font-semibold bg-dark-900 text-dark-50 w-full py-[1.4rem] dark:bg-dark-50 dark:text-dark-900" disabled={loading}>{loading? 'Confirmando...': 'Confirmar código'}</button>
          </form>
        )}
        {emailEnviado && codigoConfirmado && (
          <form onSubmit={(e)=> alterarSenha(e)} className="mt-[25vh]">
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
            <h1 className="dark:text-dark-100 text-[3rem] font-semibold mb-[.8rem]">
              Digite a sua nova senha
            </h1>
            <p className="text-[1.6rem] dark:text-dark-300 leading-[1.3]">Após confirmar a troca da sua senha, essa será sua nova senha.</p>
            <div className="flex flex-col gap-[1rem] mt-[1.2rem] text-[4rem]">
            <div className="flex flex-col w-full">
              <label className="text-[2rem] font-semibold dark:text-dark-100 bricolage mb-[.4rem]">Senha</label>
            <div className="flex relative items-center">
            <input type={verSenha ? 'text': 'password'} value={novaSenha} onChange={({target})=> setNovaSenha(target.value)} className="input-text w-full" />
            <button onClick={()=> setVerSenha(!verSenha)} className="absolute right-4 dark:text-dark-500">
            {verSenha ? <EyeOff/> : <Eye className=""/>}
            </button>
            </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="text-[2rem] font-semibold dark:text-dark-100 bricolage mb-[.4rem]">Confirmar senha</label>
            <div className="flex items-center relative">
            <input type={verConfirmarSenha? 'text': 'password'} value={confirmarNovaSenha} onChange={({target})=> setConfirmarNovaSenha(target.value)} className="input-text w-full" />
            <button onClick={()=> setVerConfirmarSenha(!verConfirmarSenha)} className="absolute right-4 dark:text-dark-500">
            {verConfirmarSenha ? <EyeOff/> : <Eye className=""/>}
            </button>
            </div>
            </div>
            </div>
            <button className="mt-[4rem] rounded-md text-[2rem] font-semibold bg-dark-900 text-dark-50 w-full py-[1.4rem] dark:bg-dark-50 dark:text-dark-900" disabled={loading}>{loading? 'Alterando...': 'Alterar senha'}</button>
          </form>
        )}
      </div>
      {message && <Message {...message} setMessage={setMessage} />}
    </section>
  );
};

export default EsqueceuSenha;
