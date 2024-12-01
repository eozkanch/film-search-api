"use client";

import { Box, Skeleton, Typography } from "@mui/material";

export default function Loading() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundColor: "#5f4747",
                padding: 3,
                gap: 4,
            }}
        >
         

            {/* Card Skeletons */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 3,
                    width: "100%",
                    maxWidth: "1200px",
                }}
            >
                {[...Array(8)].map((_, index) => (
                    <Box key={index} sx={{ padding: 2 }}>
                        <Skeleton
                            variant="rectangular"
                            height={300}
                            animation="wave"
                            sx={{ borderRadius: 2 }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ marginTop: 2, width: "80%" }}
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: "80%" }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}