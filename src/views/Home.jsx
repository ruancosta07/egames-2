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

const Home = () => {
  const baseUrl = import.meta.env.VITE_API_DEVELOPMENT;
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
          className="w-full object-cover rounded-[3rem]"
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
          <div className="container-width bg-blue-800 min-h-[30vh] rounded-[2rem] flex items-center">
            <div className="flex items-center justify-between w-full pl-[4rem]">
              <div className="flex flex-col relative pl-[3rem] ">
                <Stars className="text-yellow-400 -rotate-45 mr-[1rem] mt-[1rem] absolute -left-4 bottom-4" />
                <h1 className="text-[5rem] font-bold text-yellow-500">
                  Semana do gamer
                </h1>
                <p className="text-dark-100 text-[1.6rem] leading-[1.3]">
                  Tudo que o seu setup merece pelo melhor preço do mercado
                </p>
                <button className="w-fit p-[1rem] text-[1.8rem] bg-yellow-500 font-medium rounded-[.5rem] mt-[1.2rem] text-yellow-950 shadow-md">
                  Conferir ofertas
                </button>
                <LucideCircleFadingArrowUp className="text-dark-50 rotate-45 ml-[1rem] mb-[1rem] absolute -right-4" />
              </div>
              <div className="flex gap-[1rem]">
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
          products={products.filter((p) => p.tags?.includes("setup"))}
        />
        <section className="mt-[10vh]">
          <div className="container-width min-h-[30vh]  grid grid-cols-2 gap-[4rem]">
            <div className="flex items-center justify-between w-full px-[4rem] bg-blue-700 rounded-[2rem]">
              <div className="flex flex-col relative pl-[3rem] ">
                {/* <Stars className="text-yellow-400 -rotate-45 mr-[1rem] mt-[1rem] absolute -left-4 bottom-4" /> */}
                <h1 className="text-[3rem] font-bold text-yellow-400 leading-[1.215]">
                  Gabinetes com até 15% de desconto
                </h1>
                {/* <p className="text-dark-100 text-[1.6rem] leading-[1.3]">
                  Tudo que o seu setup merece pelo melhor preço do mercado
                </p> */}
                {/* <LucideCircleFadingArrowUp className="text-dark-50 rotate-45 ml-[1rem] mb-[1rem] absolute -right-4" /> */}
              </div>
              <div className="flex gap-[1rem]">
                <img src="/images/banner-gabinete.webp" width={500} alt="" />
              </div>
            </div>
            <div className="flex items-center justify-between w-full px-[4rem] bg-blue-800 rounded-[2rem]">
              <div className="flex flex-col relative pl-[3rem] w-full">
                {/* <DollarSign className="text-yellow-400 -rotate-15 mr-[1rem] mt-[1rem] absolute -left-4 bottom-4" /> */}
                <h1 className="text-[3rem] font-bold text-[#53e2c1] leading-[1.215]">
                  Descontos de até 30% em periféricos
                </h1>
                {/* <p className="text-dark-100 text-[1.6rem] leading-[1.3]">
                  Tudo que o seu setup merece pelo melhor preço do mercado
                </p> */}
                {/* <LucideCircleFadingArrowUp className="text-dark-50 rotate-45 ml-[1rem] mb-[1rem] absolute -right-4" /> */}
              </div>
              <div className="flex gap-[1rem]">
                <img src="/images/banner-perifericos.webp" width={600} alt="" />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
};

export default Home;
