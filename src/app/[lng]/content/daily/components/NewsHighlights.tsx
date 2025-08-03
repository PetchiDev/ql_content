"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Box, Grid, Typography, Skeleton } from "@mui/material";
import MoreArticles from "@/components/content/daily/MoreArticles";
import EmptyState from "@/components/empty-box";

interface ContentItem {
  id: string;
  title: string;
  image_url: string;
  description?: string;
  user_name?: string;
  event_location?: string;
  event_start?: string;
  event_end?: string;
  slug?: string;
}

interface NewsHighlightsProps {
  dailyData: {
    qln_contents_daily_top_story?: {
      queue_label: string;
      items: ContentItem[];
    };
    qln_contents_daily_event?: {
      queue_label: string;
      items: ContentItem[];
    };
    qln_contents_daily_more_articles?: {
      queue_label: string;
      items: ContentItem[];
    };
  };
  loading: boolean;
}

const NewsHighlights: React.FC<NewsHighlightsProps> = ({ dailyData, loading }) => {
  const router = useRouter();

  const topStory = dailyData?.qln_contents_daily_top_story?.items?.[0];
  const highlightedEvent = dailyData?.qln_contents_daily_event?.items?.[0];
  const moreArticles = dailyData?.qln_contents_daily_more_articles?.items || [];

  return (
    <Box sx={{ py: { xs: 4, md: 2 } }}>
      <Grid container spacing={4} alignItems="stretch">
        {/*LEFT SIDE */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={4} height="100%">
            {loading ? (
              <>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="rectangular" width="100%" height={260} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="rectangular" width="100%" height={260} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </Grid>
              </>
            ) : (
              <>
                {/* Top Story */}
                {topStory ? (
                  <Grid item xs={12} md={6} display="flex">
                    <a
                      href={`/content/daily/${topStory.slug ?? topStory.id}`}
                      style={{ textDecoration: "none", color: "inherit", display: "flex", flex: 1 }}
                    >
                      <Box
                        sx={{
                          border: '1px solid #F0F0F0',
                          borderRadius: '6px',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          width: '100%',
                          height: '100%',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer',
                          "&:hover": {
                            transform: 'translateY(-4px)',
                            boxShadow: 3,
                          },
                        }}
                        onClick={() => router.push(`/content/daily/${topStory.slug ?? topStory.id}`)}
                      >
                        <Box position="relative" width="100%" sx={{ aspectRatio: "16/9", minHeight: "200px", borderRadius: '6px', overflow: 'hidden' }}>
                          <Image src={topStory.image_url} alt={topStory.title} fill style={{ objectFit: "cover" }} />
                        </Box>
                        <Box>
                          <Typography color="orange" fontWeight="bold">
                            {dailyData?.qln_contents_daily_top_story?.queue_label}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold"
                            sx={{
                              cursor: 'pointer',
                              transition: 'color 0.3s ease',
                              '&:hover': {
                                color: '#00467F',
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            {topStory.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {topStory.user_name}
                          </Typography>
                        </Box>
                      </Box>

                    </a>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6}>
                    <EmptyState title="No top story available" subtitle="Please check back later." />
                  </Grid>
                )}


                {/* Highlighted Event */}
                {highlightedEvent ? (
                  <Grid item xs={12} md={6} display="flex">
                    <a
                      href={`/content/events/${highlightedEvent.slug ?? highlightedEvent.id}`}
                      style={{ textDecoration: "none", color: "inherit", display: "flex", flex: 1 }}
                    >
                      <Box
                        sx={{
                          border: '1px solid #F0F0F0',
                          borderRadius: '6px',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          width: '100%',
                          height: '100%',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer',
                          "&:hover": {
                            transform: 'translateY(-4px)',
                            boxShadow: 3,
                          },
                        }}
                      >
                        <Box position="relative" width="100%" sx={{ aspectRatio: "16/9", minHeight: "200px", borderRadius: '6px', overflow: 'hidden' }}>
                          <Image
                            src={highlightedEvent.image_url}
                            alt={highlightedEvent.title}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              bgcolor: "#0072C6",
                              color: "#fff",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "12px",
                              fontWeight: 500,
                            }}
                          >
                            {highlightedEvent.event_start} to {highlightedEvent.event_end}
                          </Box>
                        </Box>

                        <Box>
                          <Typography color="orange" fontWeight="bold">
                            {dailyData?.qln_contents_daily_event?.queue_label}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              cursor: 'pointer',
                              transition: 'color 0.3s ease',
                              '&:hover': {
                                color: '#00467F',
                                textDecoration: 'underline',
                              },
                              textTransform: "uppercase",
                            }}
                          >
                            {highlightedEvent.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            📍 {highlightedEvent.event_location}, Doha
                          </Typography>
                        </Box>
                      </Box>

                    </a>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6}>
                    <EmptyState title="No highlighted event available" subtitle="Please check back later." />
                  </Grid>
                )}

              </>
            )}
          </Grid>
        </Grid>
        {/*RIGHT SIDE */}
        <MoreArticles
          moreArticles={moreArticles}
          loading={loading}
        />
      </Grid>
    </Box >
  );
};

export default NewsHighlights;