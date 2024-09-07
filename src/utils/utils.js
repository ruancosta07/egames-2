// Este componente é uma função utilitária chamada 'cn' (abreviação de 'classNames')
// Ela serve para combinar e otimizar classes CSS, especialmente útil quando se trabalha com Tailwind CSS

// Importa as funções necessárias
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}