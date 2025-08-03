'use client';

import { Box, Typography, Chip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessIcon from "@mui/icons-material/BusinessCenter";
import SportsIcon from "@mui/icons-material/SportsSoccer";
import LifestyleIcon from "@mui/icons-material/AccessibilityNew";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ArticleIcon from "@mui/icons-material/Article";
import { JSX, useEffect, useState } from "react";
import { getAllNewsCategoris } from "@/utils/content/content";
import Link from "next/link";

interface Category {
    id: number;
    categoryName: string;
}

// Map category name to icon
const getIcon = (name: string): JSX.Element | undefined => {
    switch (name) {
        case "News":
            return <ArticleIcon fontSize="small" />;
        case "Sports":
            return <SportsIcon fontSize="small" />;
        case "Food and Dining":
            return <RestaurantIcon fontSize="small" />;
        case "Business":
            return <BusinessIcon fontSize="small" />;
        case "Lifestyle":
            return <LifestyleIcon fontSize="small" />;
        default:
            return undefined;
    }
};

export default function InTheKnow() {
    const [filters, setFilters] = useState<Category[]>([]);
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await getAllNewsCategoris();
                setFilters(res || []);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        fetchFilters();
    }, []);

    return (
        <Box mt={6}>
            <Typography
                variant="h6"
                textAlign="center"
                fontWeight={600}
                sx={{ mb: 2 }}
            >
                <Box component="span" color="#FF6A00">IN</Box>{" "}
                <Box component="span" color="#00467F">the Know</Box>
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: '6px',
                    justifyContent: "center",
                }}
            >
                {filters.map((item) => {
                    const icon = getIcon(item.categoryName);
                    return (
                        <Link
                            key={item.id}
                            href={`/content/news?category=${item.id}`}
                            passHref
                        >
                                <Chip
                                    label={item.categoryName}
                                    clickable
                                    {...(icon ? { icon } : {})} //TS-safe dynamic icon
                                    sx={{
                                        padding: '6px 24px',
                                        minHeight: '44px',
                                        borderRadius: '999px',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        backgroundColor: '#FFFFFF',
                                        color: '#111',
                                        border: '1px solid #E0E0E0',
                                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                                        transition: 'all 0.3s ease', //Hover transition
                                        '&:hover': {
                                            backgroundColor: '#f9f9f9',
                                            transform: 'translateY(-1px)',
                                        },
                                    }}
                                />
                        </Link>
                    );
                })}

                <Link href="/content/news" passHref >
                        <Chip
                            label="View all"
                            icon={<ArrowForwardIcon />}
                            clickable
                            sx={{
                                padding: '6px 24px',
                                minHeight: '44px',
                                borderRadius: '999px',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                backgroundColor: '#00467F',
                                color: '#FFFFFF',
                                transition: 'all 0.3s ease',
                                '& .MuiChip-icon': {
                                    color: '#FFFFFF',
                                    ml: 0.5,
                                },
                                '&:hover': {
                                    backgroundColor: '#003b6d',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                        />
                </Link>
            </Box>
        </Box>
    );
}
