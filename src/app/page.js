"use client";


import TopRatedMovies from "./components/TopRatedMovies";
import InfoCarousel from "./components/InfoCarousel";
import LighthouseScores from "./components/LighthouseScores";







export default function HomePage() {


    return (
        <div className="min-h-screen bg-black ">

          <InfoCarousel />
          <TopRatedMovies />
          <LighthouseScores />
         
        
        </div>
    );
}