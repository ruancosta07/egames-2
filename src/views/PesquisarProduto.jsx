import GridSection from '@components/ui/GridSection'
import axios from 'axios'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
const PesquisarProduto = () => {
    const { search } = useParams()
    const { data: produtos, isFetching } = useQuery(
      ["produtos-pesquisa", search],
      async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_DEVELOPMENT}/produtos/pesquisar`, {
          params: { search },
        })
        return response.data
      },
      {
        staleTime: 1000 * 60 * 5, // 5 minutos
        cacheTime: 1000 * 60 * 30, // 30 minutos
      }
    )
    if (!isFetching)
  return (
    <section>
        <div className="container-width flex gap-[2rem]">
            <div className='p-[1rem] bg-dark-100 min-w-[20%] border dark:border-dark-700 rounded-[.5rem]'>
            </div>
           <div>
           <h1 className='dark:text-dark-50 text-[3rem] font-semibold mb-[2rem]'>Mostrando resultados para {`"${search}"`}</h1>
           <GridSection produtos={produtos}/> 
           </div>
        </div>
    </section>
  )
}

export default PesquisarProduto