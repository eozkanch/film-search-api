"use client";

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie"; // MUI Movie Icon

/**
 * LoadingSpinner Component
 * Displays a spinner with a custom message for loading states.
 *
 * @param {string} message - The loading message to display.
 */
export default function LoadingSpinner({ message = "Loading content, please wait..." }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: { xs: "25vh", sm: "30vh" }, // Responsive height
                color: "white",
                textAlign: "center",
                gap: 3,
            }}
        >
            {/* Spinner with Icon */}
            <Box sx={{ position: "relative", display: "inline-flex" }}>
                {/* Circular Progress Indicator */}
                <CircularProgress
                    size={80} // Slightly smaller for better visual balance
                    thickness={4.5}
                    sx={{
                        color: "red", // Primary spinner color
                    }}
                />
                {/* Icon Overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                    }}
                >
                    <MovieIcon sx={{ fontSize: 40, color: "orange" }} /> {/* Icon styling */}
                </Box>
            </Box>

            {/* Loading Message */}
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 400,
                    fontSize: { xs: "1rem", sm: "1.25rem" }, // Responsive font size
                }}
            >
                {message}
            </Typography>
        </Box>
    );
}