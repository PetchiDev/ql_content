// SortDropdown.tsx
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel id="sort-by-label">Sort by</InputLabel>
      <Select
        labelId="sort-by-label"
        value={value}
        label="Sort by"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="desc">Price: High to Low</MenuItem>
        <MenuItem value="asc">Price: Low to High</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortDropdown;