"use client";

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import Image from "next/image";
import SubscribeCard from "../components/SubscribeCard";

interface ArticleItem {
  id: string;
  image_url: string;
  title: string;
  category: string;
  slug: string;
  node_type?: string; // New: for dynamic route path
}

interface NewsCardSectionProps {
  qln_contents_daily?: {
    qln_contents_daily_top_stories?: {
      queue_label: string;
      items: ArticleItem[];
    };
  };
  loading: boolean;
}

const NewsCardSection: React.FC<NewsCardSectionProps> = ({
  qln_contents_daily,
  loading,
}) => {
  const topStories = qln_contents_daily?.qln_contents_daily_top_stories?.items || [];

  return (
    <Box sx={{ mt: 6 }}>
      <Grid container spacing={4}>
        {/* News Cards */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 1,
                        bgcolor: "#fff",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        sx={{ width: "100%", aspectRatio: "16/9" }}
                      />
                      <Box px={2} py={2}>
                        <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                        <Skeleton width="100%" height={40} />
                      </Box>
                    </Box>
                  </Grid>
                ))
              : topStories.map((item) => {
                  const routePath = `/content/daily/${item.slug ?? item.id}`;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Box
                        sx={{
                          borderRadius: 2,
                          overflow: "hidden",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <a href={routePath}  style={{ textDecoration: "none" }}>
                          <Box
                            position="relative"
                            width="100%"
                            sx={{ aspectRatio: "16/9", minHeight: 160 }}
                          >
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                          </Box>
                          <Box px={1} py={2}>
                            <Typography
                              variant="body2"
                              color="orange"
                              fontWeight={600}
                              gutterBottom
                            >
                              {item.category || "News"}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Box>
                        </a>
                      </Box>
                    </Grid>
                  );
                })}
          </Grid>
        </Grid>

        {/* Subscribe Card */}
        <Grid item xs={12} md={3}>
          <SubscribeCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewsCardSection;
