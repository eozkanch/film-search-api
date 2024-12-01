"use client";

import Link from "next/link";

export default function Logo() {
    return (
        <Link
            href="/"
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
            aria-label="CinemaSphere Home"
            style={{
               
                    position: "relative",
                    width: "250px", // Daha büyük ekranlar için boyut ayarlandı
                    height: "55px",
                    backgroundImage: "url('/Oppenheimer.avif')", // Arka plan resmi
                    backgroundSize: "cover",
                    backgroundPosition: "top left",
                    backgroundColor: "rgba(0, 0, 0, 0.6)", // Arka plan karartması artırıldı
                    backgroundBlendMode: "overlay", // Resim ve renk harmanlama
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)", // Hafif gölgelendirme
                }}
        >
            
                {/* Maskelenmiş Metin */}
                <h1
                    style={{
                        
                        fontSize: "4rem",
                        fontWeight: "bold",
                        backgroundImage: "url('/NoImage.webp')", // Metin için resim maskesi
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        margin: 0,
                      textShadow: "0px 4px 8px rgba(255, 255, 255, 0.4)", // Hafif gölge ile kontrast artırıldı
                    }}
                >
                    Cinema
                </h1>
         
        </Link>
    );
}