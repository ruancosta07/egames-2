import { CircleX } from "lucide-react";
import { useEffect } from "react";
import gsap from "gsap";
import { useRef } from "react";
import { CircleCheck } from "lucide-react";
import propTypes from "prop-types";
const Message = ({ setMessage, title, text, type }) => {
  const timeOut = useRef();
  useEffect(() => {
    gsap.fromTo(
      ".message",
      { opacity: 0, x: -32 },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        onComplete: () => {
          clearTimeout(timeOut.current);
          timeOut.current = setTimeout(() => {
            gsap.to(".message", {
              opacity: 0,
              x: -32,
              onComplete: () => {
                setMessage(null);
              },
            });
          }, 3000);
        },
      }
    );
  }, [setMessage]);
  return (
    <div className="message fixed left-[4rem] bottom-[4rem] border dark:bg-dark-900 dark:border-zinc-800 p-[1.4rem] rounded-md flex items-start gap-[.8rem] shadow-md">
      {type === "success" ? (
        <CircleCheck className="text-green-700" />
      ) : (
        <CircleX className="text-red-700" />
      )}
      <div className="">
        <span className="text-dark-100 text-[2rem] font-semibold leading-none mb-[.4rem] block">
          {title}
        </span>
        <p className="text-dark-300 text-[1.4rem] max-w-[40ch] leading-[1.3]">
          {text}
        </p>
      </div>
    </div>
  );
};

Message.propTypes = {
  setMessage: propTypes.func,
  title: propTypes.string,
  text: propTypes.string,
  type: propTypes.string,
};

export default Message;
