'use client';

import React from 'react';
import {
  Box,
  Typography,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';

interface DailyTopicItem {
  id: string;
  title: string;
  image_url: string;
  category?: string;
  slug: string;
  node_type: string;
  event_start?: string;
  event_end?: string;
  event_location?: string;
}

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
        {/* Title Row */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
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
              onClick={() =>
                window.open(`/topics/${title.toLowerCase().replace(/\s/g, '-')}`)
              }
            >
              View all &gt;
            </Typography>
          )}
        </Box>

        {/* Scrollable container on mobile */}
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
          {(loading ? skeletonArray : items.slice(0, 3)).map((item, index) => (
            <Box
              key={loading ? index : item.id}
              sx={{
                flex: '0 0 auto',
                width: isMobile ? '80vw' : isTablet ? '31%' : '32%',
                minWidth: isMobile ? '80vw' : undefined,
                scrollSnapAlign: isMobile ? 'start' : undefined,
              }}
            >
              <Box
                display="flex"
                gap={2}
                height="100px"
                sx={{ borderRadius: 2 }}
              >
                {loading ? (
                  <>
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={70}
                      sx={{ borderRadius: 1, flexShrink: 0 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" width="50%" height={18} />
                      <Skeleton variant="text" width="100%" height={22} />
                      <Skeleton variant="text" width="70%" height={16} />
                    </Box>
                  </>
                ) : (
                  <a
                    href={`/content/daily/${item.slug}`}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      width: '100%',
                    }}
                  >
                    <Box
                      position="relative"
                      width="177.5px"
                      height="100px"
                      flexShrink={0}
                      borderRadius="6px"
                      overflow="hidden"
                    >
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                      <Typography
                        variant="caption"
                        color="error.main"
                        fontWeight={500}
                      >
                        {item.category || item.node_type}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        mt={0.5}
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontSize: '14px',
                          lineHeight: '20px',
                        }}
                      >
                        {item.title}
                      </Typography>
                      {item.node_type === 'event' && item.event_start && (
                        <Typography
                          variant="caption"
                          color="primary.main"
                          mt={0.5}
                          fontSize="12px"
                        >
                          {new Date(item.event_start).toLocaleDateString(undefined, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          to{' '}
                          {item.event_end &&
                            new Date(item.event_end).toLocaleDateString(undefined, {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                        </Typography>
                      )}
                    </Box>
                  </a>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DailyTopic;
