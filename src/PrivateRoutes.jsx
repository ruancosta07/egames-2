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
import DashboardContainer from "@components/ui/DashboardContainer";
import Produtos from "./views/privates/Produtos";
import Dashboard from "./views/privates/Dashboard";

const PrivateRoutes = () => {
  const { loadingData, signed, userActive } = useUserStore();
  if (loadingData) return null;
  if (loadingData === false && !signed) return <Navigate to={"/login"} />;
  if(loadingData === false && signed) 
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/conta/perfil"
          element={
            <Container>
              <Perfil />
            </Container>
          }
        />
        <Route
          path="/conta/compras"
          element={
            <Container>
              <Compras />
            </Container>
          }
        />
        <Route
          path="/conta/seguranca"
          element={
            <Container>
              <Seguranca />
            </Container>
          }
        />
          <Route
            path="/admin/dashboard"
            element={
              <DashboardContainer>
                <Dashboard />
              </DashboardContainer>
            }
          />
          <Route
            path="/admin/produtos"
            element={
              <DashboardContainer>
                <Produtos />
              </DashboardContainer>
            }
          />
        <Route path="/conta/carrinho" element={<Carrinho />} />
        <Route path="/conta/favoritos" element={<Favoritos />} />
        <Route path="/conta/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
};

export default PrivateRoutes;
