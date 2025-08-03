'use client';

import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MoreArticles from './MoreArticles';
import EmptyState from '@/components/empty-box';

interface ContentItem {
  id: string;
  title: string;
  image_url: string;
  description?: string;
  user_name?: string;
  slug?: string;
}

interface NewsHighlightsProps {
  newsData: {
    top_story?: { queue_label: string; items: ContentItem[] };
    more_articles?: { queue_label: string; items: ContentItem[] };
    articles_1?: { queue_label: string; items: ContentItem[] };
    articles_2?: { queue_label: string; items: ContentItem[] };
    most_popular_articles?: { queue_label: string; items: ContentItem[] };
    watch_on_qatar_living?: { queue_label: string; items: ContentItem[] };
  };
  loading: boolean;
}

const NewsHighlights: React.FC<NewsHighlightsProps> = ({ newsData, loading }) => {
  const router = useRouter();
  const topStory = newsData?.top_story?.items?.[0];
  const moreArticles = newsData?.more_articles?.items || [];

  return (
    <Box
      sx={{
        py: { xs: 4, md: 2 },
        display: 'flex',
        gap: '40px',
        width: '1170px',
        height: '502.375px',
      }}
    >
      {/* ✅ LEFT SIDE - Top Story */}
      {!topStory ? (
        <EmptyState title="No top story available" subtitle="Please check again later." />
      ) : (
        <Box sx={{ width: '750px', height: '100%' }}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: '8px' }}
            />
          ) : (
            <Box
              onClick={() =>
                router.push(`/content/news/${topStory.slug ?? topStory.id}`)
              }
              sx={{
                width: '100%',
                height: '100%',
                padding: '12px',
                border: '1px solid #F0F0F0',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '726px',
                  height: '408.375px',
                  borderRadius: '5.57px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={topStory.image_url}
                  alt={topStory.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>

              <Box mt={1}>
                <Typography color="orange" fontWeight="bold" mb={0.5}>
                  {newsData?.top_story?.queue_label}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={0.5}
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
          )}
        </Box>
      )}

      {/* ✅ RIGHT SIDE - More Articles */}
      {moreArticles.length === 0 ? (
        <EmptyState
          title="No more articles available"
          subtitle="Please check again later."
        />
      ) : (
        <Box sx={{ width: '380px', height: '100%' }}>
          <MoreArticles moreArticles={moreArticles} loading={loading} />
        </Box>
      )}
    </Box>
  );
};

export default NewsHighlights;
