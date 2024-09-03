import { LoaderCircleIcon } from 'lucide-react'

const Loader = () => {
  return (
    <div className="fixed w-[100vw] h-[100vh] bg-dark-900 left-0 top-0 bg-opacity-70 flex justify-center items-center z-[10]">
      <LoaderCircleIcon
        className="dark:text-dark-100 animate-spin w-[10rem] h-[10rem] duration-1000"
      />
    </div>
  );
}

export default Loader