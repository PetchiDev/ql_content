'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Divider, useTheme, IconButton } from '@mui/material';
import Image from 'next/image';
import RoomIcon from '@mui/icons-material/Room';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import parse from 'html-react-parser';
import FaceBookIcon from '@/icons/socialMedia/facebook';
import WhatsAppIcon from '@/icons/socialMedia/whatsapp';
import TwitterIcon from '@/icons/socialMedia/twitter';
import LinkedInIcon from '@/icons/socialMedia/linkedin';
import CopyIcon from '@/icons/socialMedia/copyIcon';

interface TimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface EventDetailProps {
  title: string;
  imageUrl: string;
  location: string;
  content: string;
  slug: string;
  dateRange: {
    startDate: string;
    endDate: string;
    timeSlotType: number;
    timeSlots: TimeSlot[];
    startTime?: string | null;
    endTime?: string | null;
  };
  timeRange: TimeSlot[];
}

const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[(dayOfWeek + 6) % 7];
};

const EventDetail: React.FC<EventDetailProps> = ({
  title,
  imageUrl,
  location,
  content,
  dateRange,
  timeRange,
  slug,
}) => {
  const theme = useTheme();
  const [showShareIcons, setShowShareIcons] = useState(false);

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        p: 2,
        mx: 'auto',
      }}
    >
      {/* Title */}
      <Typography variant="h6" fontWeight={700} mb={2}>
        {title}
      </Typography>

      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 360,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} />
      </Box>

      {/* Location + Share */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={1}
        py={1.5}
        sx={{ borderBottom: '1px solid #eee' }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <RoomIcon fontSize="small" color="primary" />
          <Typography variant="body2" fontWeight={500} color="primary">
            {location}
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
      <Box mt={2} color="#444" sx={{ '& p': { mb: 2, lineHeight: 1.7, fontSize: 14 } }}>
        {parse(content)}
      </Box>

      {/* Event Info */}
      <Box mt={3}>
        <Typography variant="body2" fontSize={14} mb={1}>
          <strong>Date:</strong> {dateRange.startDate} – {dateRange.endDate}
        </Typography>

        {dateRange.timeSlotType === 2 && timeRange?.length > 0 ? (
          <Box mb={1}>
            <Typography variant="body2" fontSize={14} fontWeight={600}>
              Timings:
            </Typography>
            <Stack spacing={0.5} pl={1}>
              {timeRange.map((slot, index) => (
                <Typography variant="body2" fontSize={14} key={index}>
                  {getDayName(slot.dayOfWeek)}: {slot.startTime} – {slot.endTime}
                </Typography>
              ))}
            </Stack>
          </Box>
        ) : dateRange.startTime && dateRange.endTime ? (
          <Typography variant="body2" fontSize={14} mb={1}>
            <strong>Timings:</strong> {dateRange.startTime} – {dateRange.endTime}
          </Typography>
        ) : (
          <Typography variant="body2" fontSize={14} mb={1}>
            <strong>Timings:</strong> Not Available
          </Typography>
        )}

        <Typography variant="body2" fontSize={14} mb={1}>
          <strong>Location:</strong> {location}
        </Typography>

        <Typography variant="body2" fontSize={14}>
          <strong>Access:</strong> Free
        </Typography>
      </Box>
    </Box>
  );
};

export default EventDetail;