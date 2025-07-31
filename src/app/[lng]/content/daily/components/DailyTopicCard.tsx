'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { DailyTopicItem } from './types';

interface Props {
  item: DailyTopicItem;
}

const DailyTopicCard: React.FC<Props> = ({ item }) => {
  return (
    <Box display="flex" gap={2} height="100px" sx={{ borderRadius: 2 }}>
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
          <Typography variant="caption" color="error.main" fontWeight={500}>
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
              cursor: 'pointer',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#00467F',
                textDecoration: 'underline',
              },
            }}
          >
            {item.title}
          </Typography>
          {item.node_type === 'event' && item.event_start && (
            <Typography variant="caption" color="primary.main" mt={0.5} fontSize="12px">
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
    </Box>
  );
};

export default DailyTopicCard;
