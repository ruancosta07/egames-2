import useUserStore from '@store/UserStore';
import axios from 'axios';
import gsap from 'gsap';
import { Users2 } from 'lucide-react';
import { Box } from 'lucide-react';
import { Plus } from 'lucide-react';
import { ShoppingBasket } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import React from 'react'
import { useMemo } from 'react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
const Dashboard = () => {
  const {theme, loadingData, userActive} = useUserStore()

  const {data: products} = useQuery("produtosDashboard", async()=> (await axios.get("https://api-egames.vercel.app/produtos",{
  headers: {
    Authorization: `Bearer ${Cookies.get("auth_token_user")}`
  }
  })).data)
  const {data: sales} = useQuery("produtosVendas", async()=> (await axios.get("https://api-egames.vercel.app/produtos/vendas",{
  headers: {
    Authorization: `Bearer ${Cookies.get("auth_token_user")}`
  }
  })).data)
  const {data: users} = useQuery("usuariosQuantidade", async()=> (await axios.get("https://api-egames.vercel.app/usuarios/quantidade",{
  headers: {
    Authorization: `Bearer ${Cookies.get("auth_token_user")}`
  }
  })).data)

  const salesData = useMemo(()=> {
    if(sales){
      const getMonthSale = (month)=> {
        const salesMonth = sales.filter((s)=> s.orderDate.split("/")[1].includes(month))
        if(salesMonth.length == 0){
          return 0
        }
        const totalSalesOnMonth = salesMonth.map((s)=> Number(Number(s.total).toFixed(2))).reduce((a, b)=> a + b + 0)
        return totalSalesOnMonth.toFixed(2)
      }
      return [
        { name: "Jan", vendas: getMonthSale("01") },
        { name: "Fev", vendas: getMonthSale("02") },
        { name: "Mar", vendas: getMonthSale("03") },
        { name: "Abr", vendas: getMonthSale("04") },
        { name: "Mai", vendas: getMonthSale("05") },
        { name: "Jun", vendas: getMonthSale("06") },
        { name: "Jul", vendas: getMonthSale("07") },
        { name: "Ago", vendas: getMonthSale("08") },
        { name: "Set", vendas: getMonthSale("09") },
      ];
    }
  },[sales])
;

const totalSales = useMemo(()=> {
  if(sales){
    const salesToNumber = sales.map(s=> Number(Number(s.total).toFixed(2)))
  return salesToNumber.reduce((a, b)=> a+ b + 0).toFixed(2)
  }
},[sales])

  if(userActive.role !== "admin") return <Navigate to={"/"} />
  if(loadingData === false && userActive.role === "admin")
  return (
    <div>
      <div className="grid lg:grid-cols-3 gap-[2rem]">
        <div
          className="border p-[2rem] rounded-lg dark:border-zinc-800"
          data-animate="dashboard"
        >
          <div className="text-zinc-900 dark:text-zinc-100 flex justify-between items-center mb-[.8rem]">
            <h1 className="text-[1.8rem] font-thin">Receita total</h1>
            <DollarSign className="w-[1.8rem] h-[1.8rem" />
          </div>
          <h2 className="text-[3.2rem] font-semibold text-zinc-800 dark:text-zinc-50">
            R$ {totalSales}
          </h2>
          <p className="mt-[.8rem] text-[1.4rem] text-green-900 bg-green-100 w-fit p-[.5rem] rounded-lg font-semibold">
            +32%
          </p>
        </div>
        <div
          className="border p-[2rem] rounded-lg dark:border-zinc-800"
          data-animate="dashboard"
        >
          <div className="text-zinc-900 dark:text-zinc-100 flex justify-between items-center mb-[.8rem]">
            <h1 className="text-[1.8rem] font-thin">Clientes</h1>
            <Users2 className="w-[1.8rem] h-[1.8rem" />
          </div>
          <h2 className="text-[3.2rem] font-semibold text-zinc-800 dark:text-zinc-50">
            {users && users}
          </h2>
        </div>
        <div
          className="border p-[2rem] rounded-lg dark:border-zinc-800"
          data-animate="dashboard"
        >
          <div className="text-zinc-900 dark:text-zinc-100 flex justify-between items-center mb-[.8rem]">
            <h1 className="text-[1.8rem] font-thin">Vendas</h1>
            <ShoppingBasket className="w-[1.8rem] h-[1.8rem" />
          </div>
          <h2 className="text-[3.2rem] font-semibold text-zinc-800 dark:text-zinc-50">
            {sales?.length}
          </h2>
          {/* <p className="mt-[.8rem] text-[1.4rem] text-red-900 bg-red-100 w-fit p-[.5rem] rounded-lg font-semibold">
            -12%
          </p> */}
        </div>
        <div
          className="border p-[2rem] rounded-lg dark:border-zinc-800"
          data-animate="dashboard"
        >
          <div className="text-zinc-900 dark:text-zinc-100 flex justify-between items-center mb-[.8rem]">
            <h1 className="text-[1.8rem] font-thin">Produtos ativos</h1>
            <Box className="w-[1.8rem] h-[1.8rem" />
          </div>
          <h2 className="text-[3.2rem] font-semibold text-zinc-800 dark:text-zinc-50">
            {products?.length}
          </h2>
        </div>
      </div>
      <div className="mt-[2rem] w-full" data-animate="dashboard">
        <h1
          className="text-[2rem] lg:text-[3rem] font-semibold mb-[1.2rem] dark:text-zinc-50"
        >
          Visão geral de vendas
        </h1>
        <ResponsiveContainer width="100%" height={300} >
          <AreaChart data={salesData} height={100}>
            <defs>
              <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#142d65" stopOpacity={1} />
                <stop offset="100%" stopColor="#142e6588" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              className="text-[1.4rem] inter font-medium"
            />
            <Tooltip
              contentStyle={{
                background: "#000",
                borderRadius: ".8rem",
                border: "1px solid #ffffff3b",
              }}
              itemStyle={{ color: "#929295" }}
              wrapperClassName="text-zinc-100 text-[1.4rem]"
            />
            <Area
              type="monotone"
              dataKey="vendas"
              stroke="#1e5192"
              fill="url(#colorVendas)" // Aplica o gradiente
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard