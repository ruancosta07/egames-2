import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Perfil from "./views/privates/Perfil";
import useUserStore from "./store/UserStore";
import { Navigate } from "react-router-dom";
import Container from "@components/ui/Container";
import Header from "@components/ui/Header";
import Carrinho from "./views/privates/Carrinho";
import Favoritos from "./views/privates/Favoritos"
import Checkout from "./views/privates/Checkout";
import Compras from "./views/privates/Compras";
import Seguranca from "./views/privates/Seguranca";

const PrivateRoutes = () => {
  const { loadingData, signed } = useUserStore();
  if (loadingData) return null;
  if (loadingData === false && !signed) return <Navigate to={"/login"} />;
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/perfil"
          element={
            <Container>
              <Perfil />
            </Container>
          }
        />
        <Route
          path="/compras"
          element={
            <Container>
              <Compras />
            </Container>
          }
        />
        <Route
          path="/seguranca"
          element={
            <Container>
              <Seguranca />
            </Container>
          }
        />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
};

export default PrivateRoutes;
