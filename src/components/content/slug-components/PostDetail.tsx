'use client';

import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import Image from 'next/image';
import parse from 'html-react-parser';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface PostDetailProps {
  title: string;
  imageUrl: string;
  author: string;
  publishDate: string;
  content: string; // HTML string
}

const PostDetail: React.FC<PostDetailProps> = ({
  title,
  imageUrl,
  author,
  publishDate,
  content,
}) => {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '12px',
        p: 3,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Title */}
      <Typography
        variant="h5"
        fontWeight={700}
        fontSize={{ xs: '20px', sm: '24px' }}
        lineHeight={1.4}
        gutterBottom
        sx={{ mb: 2 }}
      >
        {title}
      </Typography>

      {/* Image */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 220, sm: 320, md: 400 },
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          mb: 2,
        }}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </Box>
<Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  sx={{ mb: 2 }}
>
  {/* Author and Date */}
  <Stack direction="column" spacing={0.5}>
    <Typography
      variant="body2"
      fontWeight={500}
      sx={{ color: '#101828' }}
    >
      {author}
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: '#667085' }}
    >
      {publishDate}
    </Typography>
  </Stack>

  {/* Action Icons */}
  <Stack direction="row" spacing={1}>
    <IconButton>
      <ShareIcon sx={{ fontSize: 20, color: '#F97316' }} />
    </IconButton>
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <IconButton>
        <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: '#667085' }} />
      </IconButton>
      <Typography variant="body2" color="text.secondary" fontSize="14px">
        0
      </Typography>
    </Stack>
  </Stack>
</Stack>

      {/* Content */}
<Box
  sx={{
    typography: 'body1',
    '& p': {
      mb: 2,
      color: '#242424',
      lineHeight: 1.75,
      fontSize: '16px',
    },
    '& strong': { fontWeight: 600 },
    '& a': {
      color: 'primary.main',
      textDecoration: 'underline',
    },
  }}
>
  {parse(typeof content === "string" ? content : "")}
</Box>

    </Box>
  );
};

export default PostDetail;
