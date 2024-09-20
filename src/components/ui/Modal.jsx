import gsap from "gsap";
import { X } from "lucide-react";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

const Modal = ({ type, action, modal, setModal, children, onCloseModal, className }) => {
  const modalDiv = useRef();
  useEffect(() => {
    gsap.fromTo(
      ".modal",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.15 }
    );
  }, []);

  function closeModal() {
    gsap.to(".modal", {
      scale: 0.9,
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
        if(onCloseModal){
          onCloseModal();
        }
        setModal(false);
      },
    });
  }

  return (
    <div
      onClick={(e) => closeModal()}
      className=" w-[100vw] h-[100vh] fixed left-0 top-0 flex items-center justify-center bg-dark-900 bg-opacity-30 z-[8]"
    >
      {type === "form" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            action();
          }}
          ref={modalDiv}
          onClick={(e) => e.stopPropagation()}
          className="modal min-w-[30%] max-w-[40%] min-h-[10%] max-h-[60%] overflow-y-scroll p-[2rem] dark:bg-dark-900 rounded-[.5rem] border dark:border-dark-700 relative"
        >
          <button
            type="button"
            onClick={(e) => closeModal(e)}
            className="absolute top-4 right-4 dark:text-dark-700 hover:bg-dark-600 hover:bg-opacity-30 p-[.5rem] rounded-md duration-200 ease-in-out"
          >
            <X />
          </button>
          {children}
        </form>
      ) : (
        <div
          ref={modalDiv}
          onClick={(e) => e.stopPropagation()}
          onSelect={(e)=> e.stopPropagation()}
          className={twMerge("modal min-w-[30%] max-h-[40%] overflow-y-scroll p-[2rem] dark:bg-dark-900 rounded-[.5rem] border dark:border-dark-700 relative", className)}
        >
          <button
            onClick={(e) => closeModal(e)}
            className="absolute top-4 right-4 dark:text-dark-700 hover:bg-dark-600 hover:bg-opacity-30 p-[.5rem] rounded-md duration-200 ease-in-out"
          >
            <X />
          </button>
          {children}
        </div>
      )}
    </div>
  );
};

export default Modal;
