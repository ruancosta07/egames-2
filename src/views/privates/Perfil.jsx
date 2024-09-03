import useUserStore from "../../store/UserStore";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Loader from "@components/ui/Loader";
import Cookies from "js-cookie";
const Perfil = () => {
  const { userActive, loadingData, setUserActive, } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (loadingData === false) {
      setName(userActive.name);
      setEmail(userActive.email);
    }
  }, [loadingData, userActive]);
  console.log(userActive)

  const [endereco, setEndereco] = useState({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    async function retrieveUserData(){
      const token = Cookies.get("auth_token_user")
      if(token){
        setLoading(true)
      try{
        const response = await (await axios.get(`${import.meta.env.VITE_API_DEVELOPMENT}/conta`, {headers: {Authorization: `Bearer ${token}`}})).data
        setEmail(response.email)
        setName(response.name)
        setEndereco(response.adress)
        setUserActive({...userActive, adress: response.adress})
      }
      catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    }
    retrieveUserData()
  },[setUserActive])

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
    if(name || email || Object.keys(endereco).every(i => endereco[i].length !== '') && token){
      const adress = endereco
      setLoading(true)
      try{
        const response = (await axios.patch(`${import.meta.env.VITE_API_DEVELOPMENT}/conta/atualizar`, {name, email, adress}, {headers: {Authorization: `Bearer ${token}`}})).data
      }
      catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
  }

  if (loadingData === false)
    return (
      <>
        <form onSubmit={(e) => saveAdress(e)} className="max-w-[60%] mb-[8rem]">
          <h1 className="dark:text-dark-50 text-[3rem] font-semibold mb-[2rem]">
            Informações pessoais
          </h1>

          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
            >
              Nome completo
            </label>
            <input
              defaultValue={name.trim()}
              onChange={({ target }) => {
                setName(target.value);
              }}
              type="text"
              id="name"
              className="input-text"
            />
          </div>
          <div className="flex flex-col mt-[2rem]">
            <label
              htmlFor="email"
              className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
            >
              Email
            </label>
            <input
              defaultValue={email}
              onChange={({ target }) => setEmail(target.value)}
              type="text"
              id="email"
              className="input-text"
            />
            <h1 className="dark:text-dark-50 font-semibold text-[3rem] mt-[2rem]">
              Endereço
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-[1.6rem] mt-[1.2rem]">
            <div className="flex flex-col">
              <label
                htmlFor="cep"
                className="dark:text-dark-100 text-[2rem] bricolage mb-[.4rem]"
              >
                Cep
              </label>
              <input
                value={endereco.cep}
                onChange={({ target }) => getUserAdressByCep({ target })}
                type="text"
                id="cep"
                className="input-text"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="estado"
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
                id="estado"
                className="input-text"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="cidade"
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
                id="cidade"
                className="input-text"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="bairro"
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
                id="bairro"
                className="input-text"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="logradouro"
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
                id="logradouro"
                className="input-text"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="numero"
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
                id="numero"
                className="input-text"
              />
            </div>
            <div className="flex flex-col col-span-full">
              <label
                htmlFor="complemento"
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
                id="complemento"
                className="input-text"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-dark-900 text-dark-100 dark:bg-zinc-50 dark:text-zinc-800 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md font-medium"
            >
              Salvar alteraçoes
            </button>
            <button type="button" className=" bg-red-700 bg-opacity-70 text-zinc-200 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md font-medium">
              Excluir conta
            </button>
          </div>
        </form>
        {loading && <Loader />}
      </>
    );
};

export default Perfil;
