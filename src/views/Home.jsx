import Header from "@components/ui/Header";
import SlideSection from "@components/ui/SlideSection";
import axios from "axios";
import { useQuery } from "react-query";
import Footer from "@components/ui/Footer";
import { Stars } from "lucide-react";
import { LucideCircleFadingArrowUp } from "lucide-react";
import { Tag } from "lucide-react";
import { Gamepad2 } from "lucide-react";
import { Search } from "lucide-react";
import { Target } from "lucide-react";
import { Flame } from "lucide-react";
import { DollarSign } from "lucide-react";
import Loader from "@components/ui/Loader";

const Home = () => {
  const baseUrl = import.meta.env.VITE_API_PRODUCTION;
  const { data: products, isFetching } = useQuery(
    "produtos",
    async () => {
      return (await axios.get(`${baseUrl}/produtos`)).data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 5, // 5 minutos
    }
  );
  if(isFetching) return <Loader/>
  if (!isFetching)
    return (
      <>
        <Header products={products} />
        <main>
          <div className="container-width">
            <div data-animate="main">
              <img
                src="/images/headset-banner.webp"
                className="w-full object-cover rounded-[3rem] max-h-[400px]"
                alt=""
              />
              <span>Descontos de até 15% em headsets</span>
            </div>
            <div className="max-h-[80vh]" data-animate="main">
              <img
                src="/images/placa-banner.webp"
                className="w-full object-cover rounded-[3rem] h-full "
                alt=""
              />
              <span>Descontos de até 10% em gpus</span>
            </div>
            <div className="max-h-[30vh]" data-animate="main">
              <img
                src="/images/teclado-banner.webp"
                className="w-full max-lg:h-full object-cover rounded-[3rem]"
                alt=""
              />
              <span>Descontos de até 15% em teclados</span>
            </div>
            <div className="max-h-[30vh]" data-animate="main">
              <img
                src="/images/mouse-banner.webp"
                className="w-full object-cover rounded-[3rem]"
                alt=""
              />
              <span>Descontos de até 15% em mouses</span>
            </div>
          </div>
        </main>
        <SlideSection
          titleSection={"Ofertas do dia"}
          icon={<Tag className="dark:text-dark-50" />}
          products={products.filter((p) => p.section === "ofertas do dia")}
        />
        <SlideSection
          titleSection={"Jogos"}
          icon={<Gamepad2 className="dark:text-dark-50" />}
          products={products.filter((p) => p.section === "jogos")}
        />

        <section className="mt-[10vh]">
          <div className="container-width bg-blue-800 lg:min-h-[30vh] rounded-[2rem] flex items-center">
            <div className="flex items-center max-lg:py-[4rem] justify-between w-full max-lg:px-[4rem] lg:pl-[4rem]">
              <div className="flex flex-col relative lg:pl-[3rem] ">
                <h1 className="text-[2.6rem] lg:text-[5rem] font-bold text-yellow-500">
                  Semana do gamer
                </h1>
                <p className="text-dark-100 text-[1.4rem] leading-[1.3]">
                  Tudo que o seu setup merece pelo melhor preço do mercado
                </p>
              </div>
              <div className="flex gap-[1rem] max-lg:hidden">
                <img
                  src="/images/banner-semana-gamer.webp"
                  width={500}
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        <SlideSection
          titleSection={"Mais procurados"}
          icon={<Target className="dark:text-dark-50" />}
          products={products.filter((p) => p.views >= 50)}
        />

        <SlideSection
          titleSection={"Para o seu setup"}
          icon={<Flame className="dark:text-dark-50" />}
          products={products.filter(
            (p) => p.tags?.includes("setup") || p.category === "periféricos"
          )}
        />
        <section className="mt-[10vh]">
          <div className="container-width min-h-[30vh] grid lg:grid-cols-2 gap-[4rem]">
            <div className="flex items-center max-lg:py-[3rem] justify-between w-full px-[4rem] bg-blue-700 rounded-[2rem]">
              <h1 className="text-[2rem] 2xl:text-[3rem] font-bold text-yellow-400 leading-[1.215]">
                Gabinetes com até 15% de desconto
              </h1>
              <img
                src="/images/banner-gabinete.webp"
                className="w-[12rem] lg:w-[20rem] 2xl:w-[30rem]"
                alt=""
              />
            </div>
            <div className="flex items-center max-lg:py-[3rem] justify-between w-full px-[4rem] bg-blue-800 rounded-[2rem]">
              <h1 className="text-[2rem] 2xl:text-[3rem] font-bold text-[#53e2c1] leading-[1.215]">
                Descontos de até 30% em periféricos
              </h1>
              <img
                src="/images/banner-perifericos.webp"
                className="w-[12rem] lg:w-[20rem] object-cover 2xl:w-[30rem]"
                alt=""
              />
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
};

export default Home;
