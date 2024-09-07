import GridSection from "@components/ui/GridSection";
import Input from "@components/ui/Input";
import axios from "axios";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { ListFilter } from "lucide-react";
import { Dot } from "lucide-react";
import { useMemo } from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
const PesquisarProduto = () => {
  const { search } = useParams();
  const [initialPrice, setInicialPrice] = useState("R$ ");
  const [finalPrice, setFinalPrice] = useState("R$ ");
  const [categories, setCategories] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState(null);
  const [filtros, setFiltros] = useState(true)
  const { data: produtos, isFetching } = useQuery(
    ["produtos-pesquisa", search],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_PRODUCTION}/produtos/pesquisar`,
        {
          params: { search },
        }
      );
      return response.data;
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      cacheTime: 1000 * 60 * 30, // 30 minutos
    }
  );
  const categorias = useMemo(() => {
    if (!isFetching) {
      const c = [...new Set(produtos.map((p) => p.category))].sort();
      return c;
    }
  }, [produtos, isFetching]);

  function changeInitialPrice(value) {
    const valor = value.replace(/\D/g, "");
    setInicialPrice(`R$ ${valor}`);
  }
  function changeFinalPrice(value) {
    const valor = value.replace(/\D/g, "");
    setFinalPrice(`R$ ${valor}`);
  }

  function changeCategories(value) {
    if (categories.includes(value)) {
      return setCategories(
        categories.filter((c) => c.toLowerCase() != value.toLowerCase())
      );
    } else {
      return setCategories([...categories, value.toLowerCase()]);
    }
  }

  function applyFilters() {
    if (!produtos) {
      setProdutosFiltrados([]);
      return;
    }

    const filtered = produtos.filter((produto) => {
      const preco = parseFloat(
        produto.price.replace(/[^\d,]/g, "").replace(",", ".")
      );
      const precoInicial = parseFloat(
        initialPrice.replace(/[^\d,]/g, "").replace(",", ".")
      );
      const precoFinal = parseFloat(
        finalPrice.replace(/[^\d,]/g, "").replace(",", ".")
      );

      const precoFiltrado =
        (isNaN(precoInicial) || preco >= precoInicial) &&
        (isNaN(precoFinal) || preco <= precoFinal);

      const categoriaFiltrada =
        categories.length === 0 ||
        categories.includes(produto.category.toLowerCase());

      return precoFiltrado && categoriaFiltrada;
    });
    setProdutosFiltrados(filtered);
  }
  

  if (!isFetching)
    return (
      <section>
        <div className="container-width flex gap-[2rem]">
          <div
            className={`p-[1.6rem] bg-dark-50 dark:bg-dark-900 min-w-[20%] border dark:border-dark-700 rounded-[.5rem] w-[10%] mb-auto max-lg:fixed max-lg:w-[85%] z-[5] ease-in-out duration-300 transition-all ${
              filtros ? "max-lg:top-2/4 max-lg:-translate-y-2/4 max-lg:w-full" : "max-lg:-right-[85%]"
            }`}
          >
            <button onClick={()=> setFiltros(false)} className="lg:hidden absolute right-4 top-4 p-[.5rem] rounded-[.5rem] dark:text-dark-500">
              <X />
            </button>
            {filtros && (
              <div className="lg:hidden w-[200vw] h-[200vh] bg-dark-900 bg-opacity-50 absolute -left-full -top-full z-[-2]"></div>
            )}
            <span className="text-[2.4rem] dark:text-dark-100 font-semibold">
              Preço
            </span>
            <div className="grid grid-cols-2 gap-[2rem] mt-[1rem]">
              <Input
                label={"De"}
                value={initialPrice}
                setValue={changeInitialPrice}
              />
              <Input
                label={"Até"}
                value={finalPrice}
                setValue={(value)=> changeFinalPrice(value)}
              />
            </div>
            <span className="text-[2.4rem] dark:text-dark-100 font-semibold mt-[2rem] mb-[1.2rem] block">
              Categorias
            </span>
            <div className="flex flex-col gap-[.5rem]">
              {categorias.map((c, index) => (
                <label
                  onClick={() => changeCategories(c)}
                  key={index}
                  className="text-[1.6rem] dark:text-dark-400 flex items-center gap-[.8rem] bricolage"
                >
                  {/* <input type="checkbox" name="" id="" /> */}
                  <div
                    className={`w-8 h-8 border-dark-400 border dark:border-dark-700 rounded-[.5rem] flex items-center justify-center transition-all ease-in-out duration-100 ${
                      categories.includes(c.toLowerCase())
                        ? "bg-dark-100 text-dark-900"
                        : ""
                    }`}
                  >
                    {categories.includes(c.toLowerCase()) && (
                      <Check strokeWidth={2.5} />
                    )}
                  </div>
                  {c.split("")[0].toUpperCase() + c.slice(1)}
                  <span className="ml-auto font-semibold">{`(${
                    categorias.filter(
                      (cat) => cat.toLowerCase() == c.toLowerCase()
                    ).length
                  })`}</span>
                </label>
              ))}
            </div>
            <button
              onClick={applyFilters}
              className="p-[1rem] mt-[2rem] bg-dark-900 text-dark-100 dark:text-dark-900 dark:bg-dark-100 block text-[1.4rem] font-medium rounded-[.5rem]"
            >
              Aplicar filtros
            </button>
          </div>
          <div>
            <button onClick={()=> setFiltros(true)} className="lg:hidden p-[1rem] dark:text-dark-900 dark:bg-dark-50 bg-dark-900 text-dark-50 rounded-[.5rem] text-[1.6rem] font-medium flex items-center gap-[.6rem] mb-[1.2rem]">
              Filtros
              <ListFilter className="w-[2rem] h-[2rem]"/>
            </button>
            <h1 className="dark:text-dark-50 text-[3rem] font-semibold mb-[2rem]">
              Mostrando resultados para {`"${search}"`}
            </h1>
            <GridSection
              produtos={produtosFiltrados ? produtosFiltrados : produtos}
            />
          </div>
        </div>
      </section>
    );
};

export default PesquisarProduto;
