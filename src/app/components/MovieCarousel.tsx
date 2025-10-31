"use client";

import Slider from "react-slick";
import CarouselCard from "./CarouselCard";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Movie } from "../types";

interface MovieCarouselProps {
    movies?: Movie[];
}

interface ArrowProps {
    onClick?: () => void;
}

export default function MovieCarousel({ movies = [] }: MovieCarouselProps) {
    const CustomPrevArrow = ({ onClick }: ArrowProps) => (
        <button
            onClick={onClick}
            aria-label="Previous movies"
            title="Previous"
            className="slick-arrow slick-prev"
        >
            <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
    );

    const CustomNextArrow = ({ onClick }: ArrowProps) => (
        <button
            onClick={onClick}
            aria-label="Next movies"
            title="Next"
            className="slick-arrow slick-next"
        >
            <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
    );

    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        pauseOnFocus: true,
        nextArrow: <></>,
        prevArrow: <></>,
        variableWidth: false,
        adaptiveHeight: false,
        responsive: [
            {
                breakpoint: 1280,
                settings: { 
                    slidesToShow: 5,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: { 
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: { 
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: { 
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: '20px',
                },
            },
        ],
    };

    if (!movies.length) {
        return (
            <div className="flex justify-center items-center h-32 sm:h-40 md:h-48">
                <p className="text-gray-500 text-sm sm:text-base md:text-lg px-4">No movies available to display.</p>
            </div>
        );
    }

    return (
        <div className="relative carousel-container">
            <Slider {...settings}>
                {movies.map((movie, index) => (
                    <div key={movie.imdbID || index} className="px-1 sm:px-1.5 md:px-2">
                        <CarouselCard 
                            movie={movie} 
                            index={index}
                            priority={index < 3}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

