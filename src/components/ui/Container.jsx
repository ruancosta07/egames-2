import { Shield } from 'lucide-react';
import { ShoppingBasket } from 'lucide-react';
import { Bell } from 'lucide-react';
import { UserRoundPen } from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom'

const Container = ({children}) => {
  return (
    <section>
      <div className="container-width mt-[10rem] grid" style={{gridTemplateColumns: ".4fr 1fr"}}>
        <aside className="flex flex-col gap-[1rem] sidebar-user">
          <NavLink
            to={"/conta/perfil"}
            className={` text-[2rem] font-medium flex gap-[.8rem] items-center`}
          >
            <UserRoundPen />
            Perfil
          </NavLink>
          <NavLink
            to={"/conta/compras"}
            className={` text-[2rem] font-medium flex gap-[.8rem] items-center`}
          >
            <ShoppingBasket />
            Compras
          </NavLink>
          <NavLink
            to={"/conta/seguranca"}
            className={` text-[2rem] font-medium flex gap-[.8rem] items-center`}
          >
            <Shield />
            Segurança
          </NavLink>
        </aside>
        {children}
      </div>
    </section>
  );
}

export default Container