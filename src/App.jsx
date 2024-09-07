import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import Header from "@components/ui/Header";
import { useEffect } from "react";
import useUserStore from "./store/UserStore";
import CriarConta from "./views/CriarConta";
import axios from "axios";
import Cookies from "js-cookie";
import Produto from "./views/Produto";
import PrivateRoutes from "./PrivateRoutes";
import EsqueceuSenha from "./views/EsqueceuSenha";
import PesquisarProduto from "./views/PesquisarProduto";
function App() {
  const { theme, setSigned, setUserActive, setCart, setFavorites, setLoadingData, setOrders, setPreferences } = useUserStore();
  useEffect(() => {
    if (theme) {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);



  useEffect(()=>{
    async function validateToken() {
      const token = Cookies.get("auth_token_user");
      if (token) {
        setLoadingData(true)
        try{
          const response = (await axios.post(
            `${import.meta.env.VITE_API_PRODUCTION}/token/validar`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )).data
          setSigned(true)
          setUserActive(response.user)
          setCart(response.cart)
          setFavorites(response.favorites)
          setOrders(response.orders)
          setPreferences(response.preferences)
        }
        catch(err){
          console.log(err)
        }finally{
          setLoadingData(false)
        }
      }
      else{
        setSigned(false)
        setLoadingData(false)
      }
    }
    validateToken()
  },[setSigned, setUserActive, setCart, setFavorites, setLoadingData, setOrders, setPreferences])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/criar-conta" element={<CriarConta />} />
          <Route path="/esqueceu-a-senha" element={<EsqueceuSenha />} />
          <Route path="/produto/:id/:slug" element={<>
          <Header/>
            <Produto />
          </>} />
          <Route path="/pesquisar/:search" element={<>
          <Header/>
            <PesquisarProduto />
          </>} />
          <Route path="/conta/*" element={<PrivateRoutes/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
