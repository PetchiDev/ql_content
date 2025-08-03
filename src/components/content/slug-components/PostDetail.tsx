'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import Image from 'next/image';
import parse from 'html-react-parser';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FaceBookIcon from '@/icons/socialMedia/facebook';
import WhatsAppIcon from '@/icons/socialMedia/whatsapp';
import TwitterIcon from '@/icons/socialMedia/twitter';
import LinkedInIcon from '@/icons/socialMedia/linkedin';
import CopyIcon from '@/icons/socialMedia/copyIcon';

interface PostDetailProps {
  title: string;
  imageUrl: string;
  author: string;
  publishDate: string;
  content: string;
  slug: string;
}

const PostDetail: React.FC<PostDetailProps> = ({
  title,
  imageUrl,
  author,
  publishDate,
  content,
  slug,
}) => {
  const [showShareIcons, setShowShareIcons] = useState(false);

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
          <Typography variant="body2" fontWeight={500} sx={{ color: '#101828' }}>
            {author}
          </Typography>
          <Typography variant="body2" sx={{ color: '#667085' }}>
            {publishDate}
          </Typography>
        </Stack>

        {/* Action Icons */}
        <Stack direction="row" spacing={1}>
          {/* Share Button with Popup Below */}
          <Box sx={{ position: 'relative' }}>
            <IconButton onClick={() => setShowShareIcons(!showShareIcons)}>
              <ShareIcon sx={{ fontSize: 20, color: '#F97316' }} />
            </IconButton>

            {/* Share Icons Popup - Positioned Below */}
            {showShareIcons && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: '100%',
                    right: 12,
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #fff',
                  },
                }}
              >
                {[
                  {
                    href: `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/en/content/community/${slug}`,
                    icon: <FaceBookIcon />,
                    alt: 'Facebook',
                  },
                  {
                    href: `https://api.whatsapp.com/send?text=${window.location.origin}/en/content/community/${slug}`,
                    icon: <WhatsAppIcon />,
                    alt: 'WhatsApp',
                  },
                  {
                    href: `https://twitter.com/intent/tweet?url=${window.location.origin}/en/content/community/${slug}&text=${encodeURIComponent(title)}`,
                    icon: <TwitterIcon />,
                    alt: 'Twitter',
                  },
                  {
                    href: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/en/content/community/${slug}`,
                    icon: <LinkedInIcon />,
                    alt: 'LinkedIn',
                  },
                ].map(({ href, icon, alt }) => (
                  <IconButton
                    key={alt}
                    onClick={() => {
                      window.open(href, '_blank', 'noopener,noreferrer');
                      setShowShareIcons(false);
                    }}
                    sx={{ p: 0, '&:hover': { transform: 'scale(1.1)' } }}
                    aria-label={`Share on ${alt}`}
                  >
                    {icon}
                  </IconButton>
                ))}

                <IconButton
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/en/content/community/${slug}`;
                    navigator.clipboard.writeText(shareUrl);
                    setShowShareIcons(false);
                    // Add toast notification here if needed
                  }}
                  sx={{ p: 0, '&:hover': { transform: 'scale(1.1)' } }}
                >
                  <CopyIcon />
                </IconButton>
              </Box>
            )}
          </Box>

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
        {parse(typeof content === 'string' ? content : '')}
      </Box>
    </Box>
  );
};

export default PostDetail;