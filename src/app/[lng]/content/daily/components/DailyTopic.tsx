'use client';

import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import SkeletonCard from './SkeletonCard';
import DailyTopicCard from './DailyTopicCard';
import { DailyTopicItem } from './types';

interface DailyTopicProps {
  title: string;
  items: DailyTopicItem[];
  showViewAll?: boolean;
  loading?: boolean;
}

const skeletonArray = new Array(3).fill(null);

const DailyTopic: React.FC<DailyTopicProps> = ({
  title,
  items,
  showViewAll = true,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box my={4} width="100%" display="flex" flexDirection="column" alignItems="center">
      <Box width="100%" maxWidth="1170px" px={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography
            variant="h6"
            fontWeight={700}
            color="primary.main"
            sx={{ fontSize: '18px', lineHeight: '24px' }}
          >
            | {title}
          </Typography>
          {showViewAll && (
            <Typography
              variant="body2"
              color="warning.main"
              sx={{ cursor: 'pointer', fontWeight: 500 }}
              onClick={() => window.open(`/content/news`)}
            >
              View all &gt;
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            overflowX: isMobile ? 'auto' : 'visible',
            gap: 2,
            scrollSnapType: isMobile ? 'x mandatory' : 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            flexWrap: isMobile ? 'nowrap' : 'wrap',
          }}
        >
          {loading
            ? skeletonArray.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: '0 0 auto',
                    width: isMobile ? '80vw' : isTablet ? '31%' : '32%',
                    minWidth: isMobile ? '80vw' : undefined,
                    scrollSnapAlign: isMobile ? 'start' : undefined,
                  }}
                >
                  <SkeletonCard />
                </Box>
              ))
            : items.slice(0, 3).map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    flex: '0 0 auto',
                    width: isMobile ? '80vw' : isTablet ? '31%' : '32%',
                    minWidth: isMobile ? '80vw' : undefined,
                    scrollSnapAlign: isMobile ? 'start' : undefined,
                  }}
                >
                  <DailyTopicCard item={item} />
                </Box>
              ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DailyTopic;
