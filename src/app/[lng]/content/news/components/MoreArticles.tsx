'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';

interface ContentItem {
  id: string;
  title: string;
  image_url: string;
  slug?: string;
}

interface MoreArticlesProps {
  moreArticles: ContentItem[];
  loading: boolean;
}

const MoreArticles: React.FC<MoreArticlesProps> = ({ moreArticles, loading }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} md={3}>
      <Box
        sx={{
          width: 380,
          height: 448,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            borderLeft: '4px solid #00467F',
            pl: 1,
            mb: 1,
          }}
        >
          More Articles
        </Typography>

        {loading ? (
          <Stack spacing={2}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} display="flex" alignItems="center" gap={2}>
                <Box flex={1}>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={60}
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            ))}
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {moreArticles.map((article) => (
              <a
                key={article.id}
                href={`/content/daily/${article.slug ?? article.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  sx={{
                    gap: '12px',
                    borderBottom: '1px solid #E0E0E0',
                    pb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      flex: 1,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: '#00467F',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {article.title}
                  </Typography>

                  <Box
                    position="relative"
                    width={80}
                    height={60}
                    borderRadius={2}
                    overflow="hidden"
                    flexShrink={0}
                  >
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Box>
                </Box>
              </a>
            ))}
          </Stack>
        )}
      </Box>
    </Grid>
  );
};

export default MoreArticles;
