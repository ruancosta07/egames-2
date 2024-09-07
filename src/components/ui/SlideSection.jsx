import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "./ProductCard";
import propTypes from "prop-types";
import { useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

const SlideSection = ({ titleSection, products, icon }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const prevSlide = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const nextSlide = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className={`${titleSection ? "mt-[8rem]" : ""}`}>
      {titleSection && (
        <div className="flex gap-[1rem] items-center container-width mb-[1rem]" >
          {icon}
          <h1 className="text-[3rem] xl:text-[6rem] text-dark-900 dark:text-dark-50 font-semibold">
          {titleSection}
        </h1>
        </div>
      )}
      <div className="embla relative" ref={emblaRef}>
        <div className="embla-container gap-[2rem]">
          {products.map((p) => {
            return (
              <ProductCard
                title={p.title}
                image={p.images[0]}
                price={`${p.price}`}
                discount={`${p.oldPrice}`}
                category={p.category}
                quantity={p.quantity}
                id={p._id}
                slug={p.slug}
                className="embla-slide"
                key={p._id}
              />
            );
          })}
        </div>
        <button
          onClick={prevSlide}
          className="bg-dark-900 bg-opacity-50 rounded-full p-[1rem] absolute top-[35%] text-center"
        >
          <ChevronLeft className="stroke-dark-50" width={32} height={32} />
        </button>
        <button
          onClick={nextSlide}
          className="bg-dark-900 bg-opacity-50 rounded-full p-[1rem] absolute right-0 top-[35%] text-center"
        >
          <ChevronRight className="stroke-dark-50" width={32} height={32} />
        </button>
      </div>
    </section>
  );
};

SlideSection.propTypes = {
  titleSection: propTypes.string,
  products: propTypes.array,
};

export default SlideSection;
