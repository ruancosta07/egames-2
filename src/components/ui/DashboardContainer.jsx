import { LayoutDashboard } from "lucide-react";
import React from "react";
import Header from "./Header";
import { Box } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { ChartColumn } from "lucide-react";
import { NavLink } from "react-router-dom";

const DashboardContainer = ({ children }) => {
  return (
    <>
      <section>
        <div className="container-width grid lg:grid-cols-[.15fr_1fr] py-[3rem gap-[4rem]">
          <aside className="aside-dashboard flex lg:flex-col overflow-x-auto">
            <NavLink
              to={"/admin/dashboard"}
              className="hover:bg-zinc-200 dark:text-zinc-100 hover:dark:bg-zinc-800 flex items-center gap-[1rem] text-[1.4rem] p-[1rem] rounded-lg duration-200"
            >
              <LayoutDashboard className="w-[2rem] h-[2rem]" />
              Dashboard
            </NavLink>
            <NavLink
              to={"/admin/produtos"}
              className="hover:bg-zinc-200 dark:text-zinc-100 hover:dark:bg-zinc-800 flex items-center gap-[1rem] text-[1.4rem] p-[1rem] rounded-lg duration-200"
            >
              <Box className="w-[2rem] h-[2rem]" />
              Produtos
            </NavLink>
            {/* <NavLink
              to={"/pedidos"}
              className="hover:bg-zinc-200 dark:text-zinc-100 hover:dark:bg-zinc-800 flex items-center gap-[1rem] text-[1.4rem] p-[1rem] rounded-lg duration-200"
            >
              <ShoppingCart className="w-[2rem] h-[2rem]" />
              Pedidos
            </NavLink>
            <NavLink
              to={"/analise"}
              className="hover:bg-zinc-200 dark:text-zinc-100 hover:dark:bg-zinc-800 flex items-center gap-[1rem] text-[1.4rem] p-[1rem] rounded-lg duration-200"
            >
              <ChartColumn className="w-[2rem] h-[2rem]" />
              Análise
            </NavLink> */}
          </aside>
          {children}
        </div>
      </section>
    </>
  );
};

export default DashboardContainer;
