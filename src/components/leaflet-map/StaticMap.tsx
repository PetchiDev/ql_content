import React from 'react';
import { Box } from '@mui/material';

interface StaticMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const StaticMap: React.FC<StaticMapProps> = ({
  latitude,
  longitude,
  zoom = 13,
  width = '100%',
  height = 200,
  className,
}) => {
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=600x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`;

  return (
    <Box
      className={className}
      sx={{
        width,
        height,
        backgroundImage: `url(${mapUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: 1,
        border: '1px solid #e0e0e0',
      }}
    />
  );
};

export default StaticMap; 