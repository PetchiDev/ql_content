'use client';

import React from 'react';
import { Box, Typography, Stack, Divider, useTheme } from '@mui/material';
import Image from 'next/image';
import RoomIcon from '@mui/icons-material/Room';
import ShareIcon from '@mui/icons-material/Share';
import parse from 'html-react-parser';

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
}) => {
  const theme = useTheme();

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
        <ShareIcon fontSize="small" sx={{ color: '#FF6600', cursor: 'pointer' }} />
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
