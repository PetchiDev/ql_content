'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Popover,
  IconButton,
} from '@mui/material';
import { DateRange, RangeKeyDict } from 'react-date-range';
import { addDays, format } from 'date-fns';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { formatDateShort } from "../../constants/helpers";

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface Props {
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  reset: boolean;
  isMobile: boolean;
}

const DateSelector: React.FC<Props> = ({ setStartDate, setEndDate, reset, isMobile }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasSelected, setHasSelected] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);

  useEffect(() => {
    if (reset) {
      const defaultStart = new Date();
      const defaultEnd = addDays(defaultStart, 7);
      const defaultRange = [{
        startDate: defaultStart,
        endDate: defaultEnd,
        key: 'selection',
      }];
      setRange(defaultRange);
      setStartDate(null);
      setEndDate(null);
      setHasSelected(false); // reset flag to show "Choose"
    }
  }, [reset]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget); // toggle popover
  };

  const handleSelect = (ranges: RangeKeyDict) => {
    const selected = ranges.selection;
    if (selected.startDate && selected.endDate) {
      const range = {
        startDate: selected.startDate,
        endDate: selected.endDate,
        key: selected.key || 'selection'
      };
      setRange([range]);
      setStartDate(formatDateShort(selected.startDate.toISOString()));
      setEndDate(formatDateShort(selected.endDate.toISOString()));
      setHasSelected(true); // user has selected a range
    }
  };

  const open = Boolean(anchorEl);
  const selectedRange = `${format(range[0].startDate!, 'MMM dd')} - ${format(
    range[0].endDate!,
    'MMM dd'
  )}`;

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          width: isMobile? 'auto': 260,
          height: 56,
          backgroundColor: '#FF7A2F',
          color: 'white',
          borderRadius: isMobile?"8px":'0 8px 8px 0',
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 2,
        }}
      >
        <Typography variant="caption">Dates</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {hasSelected ? selectedRange : 'Choose'}
          </Typography>
          <IconButton size="small" sx={{ color: 'white', p: 0, ml: 1 }}>
            <ExpandLessIcon />
          </IconButton>
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { p: 2 },
        }}
      >
        <DateRange
          editableDateInputs
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          ranges={range}
        />
      </Popover>
    </>
  );
};

export default DateSelector;
