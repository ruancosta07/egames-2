import { Link } from "react-router-dom";
import React from "react";
import { Github } from "lucide-react";
import { Linkedin } from "lucide-react";
import { Code } from "lucide-react";
import { Palette } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-[12rem] bg-dark-900">
      <div className="container-width grid max-lg:gap-[2rem] lg:grid-cols-4 items-top py-[3rem]">
        <Link
          to={"/"}
          className="text-[3rem] font-semibold text-dark-100 flex gap-[.8rem] items-center h-fit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 256 256"
            className="fill-dark-50"
          >
            <path d="M176,112H152a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16ZM104,96H96V88a8,8,0,0,0-16,0v8H72a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16ZM241.48,200.65a36,36,0,0,1-54.94,4.81c-.12-.12-.24-.24-.35-.37L146.48,160h-37L69.81,205.09l-.35.37A36.08,36.08,0,0,1,44,216,36,36,0,0,1,8.56,173.75a.68.68,0,0,1,0-.14L24.93,89.52A59.88,59.88,0,0,1,83.89,40H172a60.08,60.08,0,0,1,59,49.25c0,.06,0,.12,0,.18l16.37,84.17a.68.68,0,0,1,0,.14A35.74,35.74,0,0,1,241.48,200.65ZM172,144a44,44,0,0,0,0-88H83.89A43.9,43.9,0,0,0,40.68,92.37l0,.13L24.3,176.59A20,20,0,0,0,58,194.3l41.92-47.59a8,8,0,0,1,6-2.71Zm59.7,32.59-8.74-45A60,60,0,0,1,172,160h-4.2L198,194.31a20.09,20.09,0,0,0,17.46,5.39,20,20,0,0,0,16.23-23.11Z"></path>
          </svg>
          Egames
        </Link>
        <div className="">
          <span className="text-dark-100 text-[3rem] font-semibold mb-[.8rem] block">
            Departamentos
          </span>
          <ul className="text-dark-200 text-[2rem] bricolage flex flex-col gap-[.4rem]">
            <li>Ofertas do dia</li>
            <li>Jogos</li>
            <li>Mais procurados</li>
          </ul>
        </div>
        <div className="">
          <span className="text-dark-100 text-[3rem] font-semibold mb-[.8rem] block">
            Conta
          </span>
          <ul className="text-dark-200 text-[2rem] bricolage flex flex-col gap-[.4rem]">
            <Link to={"/conta-perfil"}>Minha conta</Link>
            <Link to={"/login"}>Login</Link>
            <Link to={"/criar-conta"}>Criar conta</Link>
            <Link to={"/esqueceu-a-senha"}>Esqueci minha senha</Link>
          </ul>
        </div>
        <div className="">
          <span className="text-dark-100 text-[3rem] font-semibold mb-[.4rem] block">
            Links úteis
          </span>
          <div className="text-dark-100 flex gap-[1rem]">
            <a
              href="https://github.com/ruancosta07"
              target="_blank"
              title="Meu github"
            >
              <Github strokeWidth={1.5} className="w-[3.2rem] h-[3.2rem]" />
            </a>
            <a
              href="https://www.linkedin.com/in/ruan-costa-644378248/"
              target="_blank"
              title="Meu linkedin"
            >
              <Linkedin strokeWidth={1.5} className="w-[3.2rem] h-[3.2rem]" />
            </a>
            <a
              href="https://ruancostadev.com.br/"
              target="_blank"
              title="Meu portfólio"
            >
              <Palette strokeWidth={1.5} className="w-[3.2rem] h-[3.2rem]" />
            </a>
          </div>
        </div>
        <p className="col-span-full text-dark-200 text-[1.6rem] mt-[2rem]">
          Criado e desenvolvido por{" "}
          <a href="" className="text-dark-50">
            Ruan Costa
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
