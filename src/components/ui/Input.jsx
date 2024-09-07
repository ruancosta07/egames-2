import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({ label, value, setValue, id, type, children, className = '', inputClassNames = '', setCustomizedValue, ...props }) => {
  const baseClasses = "p-[1rem] text-[1.8rem] outline-none rounded-md bg-dark-300 bg-opacity-30 dark:bg-dark-800 dark:bg-opacity-80 dark:text-dark-200 ease-in-out duration-300 focus:dark:border-dark-500 hover:dark:border-dark-500 focus:border-dark-300 hover:border-dark-300 border border-transparent";
  const [seePassword, setSeePassword] = useState(false)
  if (type !== "password") {
    return (
      <div className={`flex flex-col ${className}`}>
        <label
          htmlFor={id}
          className="text-[1.8rem] font-medium bricolage text-dark-900 dark:text-dark-100 mb-[.4rem]"
        >
          {label}
        </label>
        <input
          type={type}
          id={id}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            if (setCustomizedValue) {
              setCustomizedValue(newValue); // Executa a função personalizada com o novo valor
              // Aqui você pode realizar ações específicas que dependem do valor
              // Essas ações podem ser definidas quando o componente for utilizado
            } else {
              setValue(newValue);
            }
          }}
          className={`${baseClasses} ${inputClassNames}`}
          {...props}
        />
        {children}
      </div>
    );
  }
  
  if (type === "password") {
    return (
      <div className={`flex flex-col ${className}`}>
        <label
          htmlFor={id}
          className="text-[1.8rem] font-medium bricolage text-dark-100 mb-[.4rem]"
        >
          {label}
        </label>
        <div className="relative flex items-center">
          <input
            type={seePassword ? "text" : "password"}
            id={id}
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              if (setCustomizedValue) {
                setCustomizedValue(newValue);
              } else {
                setValue(newValue);
              }
            }}
            className={`${baseClasses} ${inputClassNames} w-full`}
            {...props}
          />
          <button
            onClick={() => setSeePassword(!seePassword)}
            className="absolute right-4 text-dark-500"
          >
            {seePassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {children}
      </div>
    );
  }
};

export default Input;
