"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  InputAdornment,
  Switch,
  Typography,
  Stack,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import {
  getAllCategoriesLocations,
  getallcategories,
} from "@/utils/content/content";
import DateRangePicker from '@/components/date-range-picker/DateRangePicker';

type Props = {
  searchText: string;
  onSearchChange: (value: string) => void;
  location: string[];
  startDate: Date | null;
  setStartDate: (val: Date | null) => void;
  endDate: Date | null;
  setEndDate: (val: Date | null) => void;
  onLocationChange: (value: string[]) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
  showFreeOnly: boolean;
  onToggleFree: (value: boolean) => void;
  onClear: () => void;
  categories: string[];
};

const EventFilterBar: React.FC<Props> = ({
  searchText,
  onSearchChange,
  location,
  onLocationChange,
  category,
  onCategoryChange,
  date,
  onDateChange,
  showFreeOnly,
  onToggleFree,
  onClear,
  categories,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const theme = useTheme();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(max-width: 600px)');

      const handleChange = (event: MediaQueryListEvent) => {
        setIsMobile(event.matches);
      };

      // Listen for changes (new standard)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }

      // Set initial state
      setIsMobile(mediaQuery.matches);

      // Cleanup
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, []);

  const [locationData, setLocationData] = useState<{ id: string | number; name: string }[]>([]);
  const [categoriesData, setCategoriesData] = useState<{ id: string | number; categoryName: string }[]>([]);
  const [resetCounter, setResetCounter] = useState(0);

  const handleClear = () => {
    onClear();
    setResetCounter((prev) => prev + 1); // trigger reset
  }


  useEffect(() => {
    if (startDate && endDate) {
      const formatted = `${format(startDate, "dd-MM-yyyy")} to ${format(
        endDate,
        "dd-MM-yyyy"
      )}`;
      onDateChange(formatted);
    } else {
      onDateChange("");
    }
  }, [startDate, endDate, onDateChange]);

  useEffect(() => {
    getAllCategoriesLocations(setLocationData);
    getallcategories((data) => {
      setCategoriesData(
        data?.map((cat: { id: string | number; categoryName: string }) => ({
          id: cat.id,
          categoryName: cat.categoryName,
        })) || []
      );
    });
  }, []);


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          backgroundColor: "#E9E9E9",
          borderRadius: "12px",
          px: isMobile ? 2 : 5,
          py: isMobile ? 2 : 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: isMobile ? 2 : 0
          }}
        >
          {/* Search Field */}
          <TextField
            size="small"
            variant="standard"
            placeholder="Search"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: isMobile ? "8px" : '8px 0 0 8px',
              borderRight: isMobile ? "none" : "2px solid #ccc",
              justifyContent: 'center',
              minWidth: isMobile ? "100%" : 200,
              height: "56px",
              flex: 1,
              px: 1.5,
            }}
          />

          {/* Location Dropdown */}
          <FormControl size="small" sx={{ minWidth: isMobile ? "100%" : 160, flex: 1 }}>
            <Select
              multiple
              value={location}
              onChange={(e) => onLocationChange(e.target.value as string[])}
              displayEmpty
              variant="standard"
              disableUnderline
              IconComponent={() => (
                <RoomOutlinedIcon sx={{ color: "#F39224" }} />
              )}
              renderValue={(selected) => {
                if ((selected as string[]).length === 0) return "Select Location";
                const selectedNames = (selected as string[]).map(
                  (id) => locationData.find((loc) => loc.id === id)?.name || ""
                );
                return selectedNames.join(", ");
              }}
              sx={{
                backgroundColor: "#fff",
                fontWeight: 500,
                borderRight: isMobile ? "none" : "2px solid #ccc",
                height: "56px",
                px: 1.5,
                borderRadius: isMobile ? "8px" : 'none',
              }}
            >
              <MenuItem disabled value="">
                Select Location
              </MenuItem>
              {locationData.map((loc) => (
                <MenuItem key={loc?.id} value={String(loc?.id)}>
                  <Checkbox
                    checked={location.includes(String(loc?.id))}
                    sx={{
                      color: "#F39224",
                      "&.Mui-checked": {
                        color: "#F39224",
                      },
                    }}
                  />
                  <ListItemText primary={loc?.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Category Dropdown */}
          <FormControl size="small" sx={{ minWidth: isMobile ? "100%" : 160, flex: 1 }}>
            <Select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              IconComponent={ExpandMoreIcon}
              displayEmpty
              variant="standard"
              disableUnderline
              sx={{
                backgroundColor: "#fff",
                fontWeight: 500,
                height: "56px",
                borderRight: isMobile ? "none" : "2px solid #ccc",
                px: 1.5,
                borderRadius: isMobile ? "8px" : 'none',
              }}
            >
              <MenuItem value="">Choose</MenuItem>
              {categoriesData.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* DataRangeSelector */}
          <DateRangePicker
            setStartDate={(date) => setStartDate(date ? new Date(date) : null)}
            setEndDate={(date) => setEndDate(date ? new Date(date) : null)}
            reset={resetCounter > 0}
            isMobile={isMobile}
          />
        </Box>

        {/* Second Row: Toggle and Clear */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch
              checked={showFreeOnly}
              onChange={(e) => onToggleFree(e.target.checked)}
              sx={{
                width: 48,
                height: 28,
                padding: 0,
                "& .MuiSwitch-switchBase": {
                  padding: "2px",
                  "&.Mui-checked": {
                    transform: "translateX(20px)",
                    color: "#fff",
                    "& + .MuiSwitch-track": {
                      backgroundColor: "#F39224",
                      opacity: 1,
                    },
                  },
                },
                "& .MuiSwitch-thumb": {
                  width: 24,
                  height: 24,
                  boxShadow: "none",
                },
                "& .MuiSwitch-track": {
                  borderRadius: 14,
                  backgroundColor: "#BDBDBD",
                  opacity: 1,
                },
              }}
            />
            <Typography fontSize={14} fontWeight={500}>
              Show Free Events Only
            </Typography>
          </Stack>

          <Typography
            onClick={handleClear}
            sx={{
              color: "#F39224",
              fontWeight: 500,
              fontSize: 14,
              cursor: "pointer",
              whiteSpace: "nowrap",
              mt: isMobile ? 2 : 0,
            }}
          >
            Clear All
          </Typography>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default EventFilterBar;
