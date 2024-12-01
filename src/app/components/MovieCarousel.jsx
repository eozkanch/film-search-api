"use client";

import Slider from "react-slick";
import CarouselCard from "./CarouselCard";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

/**
 * MovieCarousel Component
 * Displays a carousel of movies with custom navigation arrows.
 *
 * @param {Object[]} movies - Array of movie objects.
 */
export default function MovieCarousel({ movies = [] }) {
    // Custom Previous Arrow
    const CustomPrevArrow = ({ onClick }) => (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(11, 121, 205, 0.5)",
                color: "white",
                zIndex: 1,
                "&:hover": { backgroundColor: "rgba(230, 12, 12, 0.8)" },
            }}
        >
            <ArrowBackIosNewIcon />
        </IconButton>
    );

    // Custom Next Arrow
    const CustomNextArrow = ({ onClick }) => (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(11, 121, 205, 0.5)",
                color: "white",
                zIndex: 1,
                "&:hover": { backgroundColor: "rgba(230, 12, 12, 0.8)" },
            }}
        >
            <ArrowForwardIosIcon />
        </IconButton>
    );

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    // Handle empty movie array
    if (!movies.length) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500">No movies available to display.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Slider {...settings}>
                {movies.map((movie, index) => (
                    <div key={movie.imdbID || index} className="px-2">
                        <CarouselCard movie={movie} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}