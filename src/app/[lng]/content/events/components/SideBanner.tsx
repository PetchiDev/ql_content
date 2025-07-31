"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarPlus from "../../../../../icons/calendarplus";
import { formatDateShort } from "../../../../../constants/helpers";
import dynamic from "next/dynamic";

// Outside of component, at the top
const StaticMap = dynamic(() => import('@/components/leaflet-map/StaticMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});


type SideBannerProps = {
  event: {
    categoryName: string;
    latitude: string; // still string from API
    longitude: string;
    redirectionLink:string;  // redirectionLink here
    eventSchedule?: {
      startDate?: string;
    };
    price?: string;
  };
  openDialogueBox: (open: boolean) => void;
};

const SideBanner: React.FC<SideBannerProps> = ({ event, openDialogueBox }) => {
  return (
    <Card sx={{ maxWidth: 400, mx: "auto", p: 2, borderRadius: "6px" }}>
      <CardContent>
        <Chip
          label={event.categoryName}
          size="small"
          sx={{
            mb: 2,
            backgroundColor: "transparent",
            color: "#2A6BA0",
            border: "1px solid #E8F2FE",
          }}
        />

        <TextField
          value={formatDateShort(event?.eventSchedule?.startDate ?? "")}
          size="small"
          fullWidth
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarTodayIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />

        <TextField
          value="12:00 PM"
          size="small"
          fullWidth
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessTimeIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" gutterBottom>
          Access Fees:
        </Typography>
        <Typography component="div" sx={{fontWeight:"600",fontSize:"25px"}} color="primary" gutterBottom >
          {event?.price ? event?.price : "Free"}
          {event?.price && <span style={{fontSize:"14px",fontWeight:"500",marginLeft:"8px"}}>
            QAR
          </span>}
        </Typography>

        {event?.redirectionLink !== '' && event?.redirectionLink !== null && event?.redirectionLink !== undefined &&
          
          <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
  if (event?.redirectionLink && typeof window !== 'undefined') {
    window.open(event.redirectionLink, '_blank');
  }
}}
          endIcon={<ArrowForwardIosIcon />}
          sx={{ mb: 1 }}
        >
          More Information
        </Button>}

        <Button
          fullWidth
          variant="outlined"
          color="primary"
          endIcon={<CalendarPlus />}
          sx={{ mb: 2 }}
          onClick={() => openDialogueBox(true)}
        >
          Add to Calendar
        </Button>

        <Box sx={{ height: 200, borderRadius: 1, overflow: "hidden", mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Location:
          </Typography>
{!isNaN(parseFloat(event.latitude)) && !isNaN(parseFloat(event.longitude)) ? (
  <StaticMap
    latitude={parseFloat(event.latitude)}
    longitude={parseFloat(event.longitude)}
  />
) : (
  <Typography color="error">No location Available</Typography>
)}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SideBanner;
