'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import parse from 'html-react-parser';

export interface EventCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  slug?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  image,
  category,
  title,
  description,
  location,
  startDate,
  endDate,
  slug,
}) => {
  return (
    <Link href={slug ? `/content/events/${slug}` : '#'} passHref >
        <Card
          sx={{
            width: 340,
            height: 404,
            borderRadius: '6px',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0px 6px 16px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Box sx={{ position: 'relative', height: 200 }}>
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: '#0078D4',
                color: '#fff',
                fontSize: 12,
                px: 1.2,
                py: 0.5,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 500,
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 16 }} />
              {`${startDate} to ${endDate}`}
            </Box>
          </Box>

          <CardContent sx={{ p: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              textTransform="uppercase"
              sx={{ fontWeight: 500 }}
            >
              {category}
            </Typography>

            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mt: 0.5, mb: 0.5 }}
            >
              {title}
            </Typography>

<Box
  sx={{
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    color: 'text.secondary',
    fontSize: '0.875rem', // match Typography body2
  }}
>
  {parse(description)}
</Box>


            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <LocationOnIcon fontSize="small" sx={{ color: 'gray' }} />
              <Typography variant="body2" color="text.secondary">
                {location}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
    </Link>
  );
};

export default EventCard;
