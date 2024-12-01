"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
    InputBase,
    Button,
    Divider,
    Alert,
    Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ExploreIcon from "@mui/icons-material/Explore";
import MovieIcon from "@mui/icons-material/Movie";
import SeriesIcon from "@mui/icons-material/Tv";
import Logo from "./Logo/Logo";
import Link from "next/link";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [alertOpen, setAlertOpen] = useState(false); // Uyarı mesajını kontrol eden state
    const router = useRouter();

    // Mobile Drawer Toggle
    const toggleDrawer = () => setMobileOpen(!mobileOpen);

    // Search Toggle
    const toggleSearch = () => setShowSearch(!showSearch);

    // Handle Search Submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim().length >= 3) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setQuery("");
            setShowSearch(false);
        } else {
            setAlertOpen(true); // Uyarıyı göster
        }
    };

    // Drawer Contents
    const drawer = (
        <Box sx={{ width: 250, backgroundColor: "rgb(31, 41, 55)", color: "white", height: "100%", }}>
            <Box p={2} textAlign="center">
                <Typography variant="h6" sx={{ color: "red" }}>
                    Menu
                </Typography>
            </Box>
            <Divider sx={{ borderColor: "gray" }} />
            <List>
                {[
                    { text: "Home", icon: <HomeIcon />, link: "/" },
                    { text: "Explore", icon: <ExploreIcon />, link: "/filter" },
                    { text: "White Paper", icon: <MovieIcon />, link: "/whitepaper" },
                    
                ].map(({ text, icon, link }) => (
                    <ListItem
                        button
                        key={text}
                        onClick={() => {
                            toggleDrawer();
                            router.push(link);
                        }}
                    >
                        <IconButton sx={{ color: "red" }}>{icon}</IconButton>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            {/* Navbar */}
            <AppBar
                position="sticky"
                sx={{
                    
                    color: "white",
                    boxShadow: "none",
                    borderBottom: "2px solid red",
                    padding: "10px 0",
                    marginBottom: "5px",
                }}
            >
                <Toolbar>
                    {/* Left: Logo */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
                        <Logo />
                        <Link href="/filter" className=" items-center gap-2 text-2xl  font-bold hidden md:flex">
                    Explore
                    </Link>
                    <Link href="/whitepaper" className=" items-center gap-2 text-2xl  font-bold hidden md:flex">
                    White Paper
                    </Link>
                
                    </Box>
                   
                    {/* Center: Search Bar */}
                    <Box
                        component="form"
                        onSubmit={handleSearchSubmit}
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            justifyContent: "center",
                            maxWidth: "500px",
                        }}
                    >
                        <InputBase
                            placeholder="Search for a movie..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            sx={{
                                flexGrow: 1,
                                backgroundColor: "white",
                                borderRadius: "5px 0 0 5px",
                                padding: "6px 12px",
                                color: "black",
                            }}
                        />
                        <Button
                            type="submit"
                            sx={{
                                borderRadius: "0 5px 5px 0",
                                backgroundColor: "red",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "darkred",
                                },
                            }}
                        >
                            <SearchIcon />
                        </Button>
                    </Box>

                    {/* Right: Mobile Icons */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {/* Search Icon for Mobile */}
                        <IconButton
                            onClick={toggleSearch}
                            sx={{
                                display: { xs: "flex", md: "none" },
                                color: "white",
                            }}
                        >
                            <SearchIcon />
                        </IconButton>

                        {/* Drawer Toggle */}
                        <IconButton
                            onClick={toggleDrawer}
                            sx={{
                                display: { xs: "flex", md: "none" },
                                color: "white",
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer for Mobile */}
            <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
                {drawer}
            </Drawer>

            {/* Slide Search for Mobile */}
            {showSearch && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgb(31, 41, 55)",
                        padding: 2,
                        zIndex: 1200,
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSearchSubmit}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            maxWidth: 600,
                            margin: "0 auto",
                            backgroundColor: "white",
                            borderRadius: 2,
                            padding: "2px 4px",
                        }}
                    >
                        <IconButton onClick={toggleSearch}>
                            <CloseIcon />
                        </IconButton>
                        <InputBase
                            sx={{ flexGrow: 1, ml: 1 }}
                            placeholder="Search for a movie..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <IconButton type="submit" sx={{ color: "red" }}>
                            <SearchIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {/* Alert Message */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setAlertOpen(false)} severity="warning" sx={{ width: "100%" }}>
                    Please enter at least 3 characters to search.
                </Alert>
            </Snackbar>
        </>
    );
}