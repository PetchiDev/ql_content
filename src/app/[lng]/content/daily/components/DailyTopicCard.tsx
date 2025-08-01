'use client';

import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Image from 'next/image';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { DailyTopicItem } from './types';

interface Props {
  item: DailyTopicItem;
}

const DailyTopicCard: React.FC<Props> = ({ item }) => {
  const isVideo = item.node_type === 'video';
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const getYouTubeEmbedUrl = (url: string, autoplay = true) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=1&enablejsapi=1`;
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent link navigation
    const iframe = videoRef.current?.contentWindow;
    if (!iframe) return;

    iframe.postMessage(
      JSON.stringify({
        event: 'command',
        func: isPlaying ? 'pauseVideo' : 'playVideo',
        args: [],
      }),
      '*'
    );
    setIsPlaying((prev) => !prev);
  };

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
          {isVideo ? (
            <>
              <iframe
                ref={videoRef}
                src={getYouTubeEmbedUrl(item.image_url)}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '100%',
                  border: 0,
                  borderRadius: '6px',
                }}
              />
              <IconButton
                onClick={handleTogglePlay}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: '#fff',
                  zIndex: 10,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </>
          ) : (
            <Image
              src={item.image_url}
              alt={item.title || 'daily topic image'}
              fill
              style={{ objectFit: 'cover', borderRadius: '6px' }}
            />
          )}
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
