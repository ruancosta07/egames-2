import useUserStore from "../../store/UserStore";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Loader from "@components/ui/Loader";
import Cookies from "js-cookie";
import Modal from "@components/ui/Modal";
import Input from "@components/ui/Input";
import Message from "@utils/Message";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
const Perfil = () => {
  const {
    userActive,
    loadingData,
    setUserActive,
    setSigned,
    setFavorites,
    setCart,
  } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [modalExcluirConta, setModalExcluirConta] = useState(false);
  const [confirmarExcluirConta, setConfirmarExcluirConta] = useState(false);
  const timeOut = useRef();
  useEffect(() => {
    if (loadingData === false) {
      setName(userActive.name);
      setEmail(userActive.email);
    }
  }, [loadingData, userActive]);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigateTo = useNavigate()
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

  useEffect(() => {
    async function retrieveUserData() {
      const token = Cookies.get("auth_token_user");
      if (token) {
        setLoading(true);
        try {
          const response = await (
            await axios.get(`${import.meta.env.VITE_API_PRODUCTION}/conta`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          ).data;
          setEmail(response.email);
          setName(response.name);
          setEndereco(response.adress);
          setUserActive({ ...userActive, adress: response.adress });
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
    }
    retrieveUserData();
  }, [setUserActive]);

  async function getUserAdressByCep({ target }) {
    const { value } = target;
    const formatedValue = value.slice(0, 8);
    setEndereco({ ...endereco, cep: formatedValue });
    if (formatedValue.length === 8) {
      setLoading(true);
      try {
        const viaCepUrl = `https://viacep.com.br/ws/${formatedValue}/json/`;
        const response = (await axios.get(viaCepUrl)).data;
        setEndereco((prevValue) => ({
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

  async function saveAdress(e) {
    e.preventDefault();
    const token = Cookies.get("auth_token_user");
    if (
      name ||
      email ||
      (Object.keys(endereco).every((i) => endereco[i].length !== "") && token)
    ) {
      const adress = endereco;
      setLoading(true);
      try {
        const response = (
          await axios.patch(
            `${import.meta.env.VITE_API_PRODUCTION}/conta/atualizar`,
            { name, email, adress },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ).data;
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

  async function excluirConta() {
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_PRODUCTION}/conta/excluir-conta`,
        { email: confirmEmail, password: confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("auth_token_user")}`,
          },
        }
      );
      console.log(response);
      setMessage({
        type: "success",
        title: "Usuário excluído com sucesso",
      });
      clearTimeout(timeOut.current);
      timeOut.current = setTimeout(() => {
        navigateTo("")
        setUserActive(null);
        setCart([]);
        setFavorites([]);
        setSigned(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      setMessage({
        type: "error",
        title: err.response.data.message,
      });
    }finally{
      setLoading(false)
    }
  }

  if (loadingData === false)
    return (
      <>
        <form
          onSubmit={(e) => saveAdress(e)}
          className="lg:max-w-[60%] mb-[8rem]"
        >
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
            <button
              onClick={() => setModalExcluirConta(true)}
              type="button"
              className=" bg-red-700 bg-opacity-70 text-zinc-200 p-[1rem] mt-[1.2rem] text-[1.6rem] rounded-md font-medium"
            >
              Excluir conta
            </button>
          </div>
        </form>
        {loading && <Loader />}
        {message && <Message {...message} setMessage={setMessage} />}
        {modalExcluirConta && (
          <Modal
            onCloseModal={() => {
              setConfirmarExcluirConta(false);
              setConfirmEmail("");
              setConfirmPassword("");
            }}
            type={"form"}
            action={excluirConta}
            setModal={setModalExcluirConta}
          >
            {!confirmarExcluirConta && (
              <>
                <h1 className="text-dark-900 dark:text-dark-50 text-[2rem] font-semibold max-w-[30ch] leading-[1.115] mb-[1.2rem]">
                  Excluir conta
                </h1>
                <p className="dark:text-dark-300 text-[1.5rem] max-w-[60ch] leading-[1.3]">
                  Iremos excluir sua conta e todos os seus dados do nosso banco
                  de dados, essa ação é irrerversível, tem certeza que quer
                  excluir sua conta?
                </p>
                <div className="flex gap-[1rem] mt-[2rem] justify-end">
                  <button
                    type="button"
                    onClick={() => setModalExcluirConta(false)}
                    className="border border-dark-300 dark:border-dark-700 p-[1rem] text-[1.6rem] dark:text-dark-600 font-medium rounded-[.5rem]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmarExcluirConta(true)}
                    className="bg-red-700 text-dark-50 p-[1rem] text-[1.6rem]  font-medium rounded-[.5rem]"
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}
            {confirmarExcluirConta && (
              <>
                <h1 className="text-dark-900 dark:text-dark-50 text-[2.2rem] font-semibold max-w-[30ch] leading-[1.115] mb-[2rem]">
                  Confirme sua identidade
                </h1>
                <Input
                  value={confirmEmail}
                  label={"Email"}
                  setValue={setConfirmEmail}
                />
                <Input
                  value={confirmPassword}
                  label={"Senha"}
                  setValue={setConfirmPassword}
                  type={"password"}
                  className="mt-[2rem]"
                />
                <button
                  type="submit"
                  onClick={() => setConfirmarExcluirConta(true)}
                  className="bg-red-700 text-dark-50 p-[1rem] text-[1.6rem]  font-medium rounded-[.5rem] mt-[1.2rem]"
                >
                  Excluir conta
                </button>
              </>
            )}
          </Modal>
        )}
      </>
    );
};

export default Perfil;
