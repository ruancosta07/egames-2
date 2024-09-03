import gsap from "gsap";
import { X } from "lucide-react";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Modal = ({ type, action, modal, setModal, children }) => {
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
      onComplete: () => setModal(false),
    });
  }

  return (
    <div
      onClick={(e) => closeModal()}
      className=" w-[100vw] h-[100vh] fixed left-0 top-0 flex items-center justify-center bg-dark-900 bg-opacity-30 "
    >
      {type === "form" ? (
        <form
        onSubmit={(e)=> {
          e.preventDefault()
          action()
        }}
          ref={modalDiv}
          onClick={(e) => e.stopPropagation()}
          className="modal min-w-[30%] min-h-[10%] p-[2rem] dark:bg-dark-900 rounded-[.5rem] border dark:border-dark-700 relative"
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
          className="modal min-w-[30%] min-h-[10%] p-[2rem] dark:bg-dark-900 rounded-[.5rem] border dark:border-dark-700 relative"
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
