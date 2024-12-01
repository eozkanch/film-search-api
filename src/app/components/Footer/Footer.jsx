"use client";

import { Box, Typography, Link } from "@mui/material";
import Grid from "@mui/material/Grid2";
import LanguageIcon from "@mui/icons-material/Language";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
export default function Footer() {
    return (
        <Box
            sx={{
                backgroundColor: "#1a1a1a",
                color: "white",
                padding: "2rem 1rem",
                mt: 1,
            }}
        >
            <Grid
                container
                spacing={4}
                sx={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: { xs: "0 1rem", sm: "0" },
                }}
            >
                {/* About Us */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            textTransform: "uppercase",
                            color: "#f5f5f5",
                        }}
                    >
                        About Us
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "#aaa", lineHeight: 1.6 }}
                    >
                        We provide the best movie and series database for all
                        movie enthusiasts. Discover top-rated content and enjoy
                        your journey with us!
                    </Typography>
                </Grid>

                {/* Quick Links */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            textTransform: "uppercase",
                            color: "#f5f5f5",
                        }}
                    >
                        Quick Links
                    </Typography>
                    <Box>
                        {["Movies", "Series", "Explore", "WhitePaper"].map((link, index) => (
                            <Link
                                key={index}
                                href={`/${link.toLowerCase()}`}
                                sx={{
                                    display: "block",
                                    color: "#aaa",
                                    textDecoration: "none",
                                    mb: 1,
                                    "&:hover": { color: "red" },
                                }}
                            >
                                {link}
                            </Link>
                        ))}
                    </Box>
                </Grid>

                {/* Contact Us */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            textTransform: "uppercase",
                            color: "#f5f5f5",
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Box>
                        <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
                            Email: contact@moviehub.com
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
                            Phone: +41 123 456 788 85
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#aaa" }}>
                            Address: Lancy/Genève/Suisse
                        </Typography>
                    </Box>
                </Grid>

                {/* Follow Us */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            textTransform: "uppercase",
                            color: "#f5f5f5",
                        }}
                    >
                        Follow Us
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
    {[
        { icon: <LanguageIcon />, link: "https://eozkan.vercel.app" },
        { icon: <GitHubIcon />, link: "https://github.com/eozkanch" },
        { icon: <LinkedInIcon />, link: "https://www.linkedin.com/in/ebubekirozkan/" },
    ].map(({ icon, link }, index) => (
        <Link
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#333",
                color: "white",
                textAlign: "center",
                "&:hover": { backgroundColor: "red" },
            }}
        >
            {icon}
        </Link>
    ))}
</Box>
                </Grid>
            </Grid>

            {/* Footer Bottom */}
            <Box
                sx={{
                    borderTop: "1px solid #333",
                    textAlign: "center",
                    marginTop: "2rem",
                    paddingTop: "1rem",
                }}
            >
                <Typography variant="body2" sx={{ color: "#aaa" }}>
                    &copy; {new Date().getFullYear()} MovieSpot. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}