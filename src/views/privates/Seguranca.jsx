import Input from "@components/ui/Input";
import Loader from "@components/ui/Loader";
import Modal from "@components/ui/Modal";
import axios from "axios";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
import React from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import useUserStore from "@store/UserStore";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Message from "@utils/Message";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
const Seguranca = () => {
  const {setUserActive, setSigned ,setCart, setFavorites, preferences, loadingData} = useUserStore()
  const [verificacaoDuasEtapas, setVerificacaoDuasEtapas] = useState(()=> {
    if(loadingData === false){
      return preferences.twoStepsAuth ? true : false
    }
  });
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [verSenha, setVerSenha] = useState(false)
  const [senhaConfirmada, setSenhaConfirmada] = useState(false)
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const timeOut = useRef()
  const navigateTo = useNavigate()
  async function confirmarSenha(){
    setLoading(true)
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_PRODUCTION}/conta/confirmar-senha`, {password}, {headers: {Authorization: `Bearer ${Cookies.get("auth_token_user")}`}})
      setSenhaConfirmada(true)
    }
    catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }
  async function mudarSenha(){
    setLoading(true)
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_PRODUCTION}/conta/alterar-senha`, {password:newPassword}, {headers: {Authorization: `Bearer ${Cookies.get("auth_token_user")}`}})
      setMessage({type: "success", title: "Senha alterada com sucesso", text: "Por motivos de segurança, você precisa fazer login novamente"})
      console.log(response)
      clearTimeout(timeOut.current)
      timeOut.current = setTimeout(()=> {
        setUserActive({})
        setSigned(false)
        setCart([])
        setFavorites([])
        navigateTo("/login")
        Cookies.remove("auth_token_user")
      }, 5000)
    }
    catch(err){
      console.log(err)
      setMessage({type: "error", title: "Erro ao alterar senha", text: "Se o erro persistir, entre em contato conosco"})
    }finally{
      setLoading(false)
    }
  }

  async function changeTwoStepsAuth(){
    const localstate = !verificacaoDuasEtapas
    setLoading(true)
    setVerificacaoDuasEtapas(!verificacaoDuasEtapas)
    try{
      const response = await axios.patch(`${import.meta.env.VITE_API_PRODUCTION}/conta/atualizar`, {preferences: {twoStepsAuth: localstate}}, {headers: {Authorization: `Bearer ${Cookies.get("auth_token_user")}`}})
    }
    catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      <form className="lg:max-w-[60%] mb-[8rem]">
        <h1 className="dark:text-dark-50 text-[3rem] font-semibold mb-[2rem]">
          Segurança da conta
        </h1>

        <div className="flex gap-[1rem]">
          <Switch
            checked={verificacaoDuasEtapas}
            onCheckedChange={changeTwoStepsAuth}
            id="two-steps-auth"
          />
          <div>
            <Label
              htmlFor="two-steps-auth"
              className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem] block"
            >
              Verificação em duas etapas
            </Label>
            <p className="dark:text-dark-300 text-[1.6rem]">
              Receba um email com um código sempre que você for fazer login
            </p>
          </div>
        </div>

        <div className="mt-[4rem]">
          <button
            type="button"
            onClick={() => setAlterarSenha(!alterarSenha)}
            className="bg-dark-900 text-dark-100 dark:bg-zinc-200 dark:text-zinc-800 p-[1rem] text-[1.6rem] rounded-md font-medium"
          >
            Alterar senha
          </button>
        </div>
      </form>
      {alterarSenha && (
        <Modal
          type="form"
          action={senhaConfirmada ? mudarSenha : confirmarSenha}
          modal={alterarSenha}
          setModal={setAlterarSenha}
        >
          {!senhaConfirmada && (
            <>
              <h1 className="text-[2.6rem] dark:text-dark-50 font-semibold mb-[2rem]">
                Confirme sua identidade
              </h1>
              <Input
                value={password}
                setValue={setPassword}
                type={"password"}
                label={"Digite sua senha"}
                id={"confirmar-senha"}
                seePassword={verSenha}
                setSeePassword={setVerSenha}
              ></Input>
              {/* </div> */}
              <button
                onClick={confirmarSenha}
                className="bg-dark-900 text-dark-100 dark:bg-zinc-50 dark:text-zinc-800 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md font-medium"
              >
                Confirmar senha
              </button>
            </>
          )}
          {senhaConfirmada && (
            <>
              <h1 className="text-[2.6rem] dark:text-dark-50 font-semibold mb-[2rem]">
                Digite sua nova senha
              </h1>
              <Input
                value={newPassword}
                setValue={setNewPassword}
                type={"password"}
                label={"Senha"}
                id={"confirmar-senha"}
                seePassword={verSenha}
                setSeePassword={setVerSenha}
              ></Input>
              {/* </div> */}
              <button
                type="submit"
                onClick={confirmarSenha}
                className="bg-dark-900 text-dark-100 dark:bg-zinc-50 dark:text-zinc-800 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md font-medium"
              >
                Alterar senha
              </button>
            </>
          )}
        </Modal>
      )}
      {loading && <Loader />}
      {message && <Message {...message} setMessage={setMessage} />}
    </>
  );
};

export default Seguranca;
