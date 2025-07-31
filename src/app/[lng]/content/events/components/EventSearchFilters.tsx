// EventSearchFilters.tsx
import React from 'react';
import { Stack, TextField, MenuItem, Button } from '@mui/material';

interface FilterProps {
  location: string;
  category: string;
  date: string;
  onFilterChange: (filters: { location: string; category: string; date: string }) => void;
  onClear: () => void;
}

const categories = ['All', 'Awareness', 'Exhibition', 'Workshops'];
const locations = ['All', 'Doha', 'Wakrah', 'Al Wakrah'];

const EventSearchFilters: React.FC<FilterProps> = ({ location, category, date, onFilterChange, onClear }) => {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 4 }}>
      <TextField
        select
        label="Location"
        size="small"
        value={location}
        onChange={(e) => onFilterChange({ location: e.target.value, category, date })}
      >
        {locations.map((loc) => (
          <MenuItem key={loc} value={loc}>
            {loc}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Category"
        size="small"
        value={category}
        onChange={(e) => onFilterChange({ location, category: e.target.value, date })}
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Date"
        type="date"
        size="small"
        value={date}
        onChange={(e) => onFilterChange({ location, category, date: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />

      <Button onClick={onClear} variant="outlined" color="secondary">
        Clear All
      </Button>
    </Stack>
  );
};

export default EventSearchFilters;
