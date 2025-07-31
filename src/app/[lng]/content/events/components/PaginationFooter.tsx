// PaginationFooter.tsx
'use client';

import { Box, Pagination, Select, MenuItem, Stack, Typography, TextField, InputLabel, FormControl } from '@mui/material';
import React from 'react';

interface PaginationFooterProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} mt={4}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => onPageChange(page)}
        color="primary"
        shape="rounded"
      />

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2">Results per page</Typography>
        <Select
          size="small"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {[6, 12, 24].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
};

export default PaginationFooter;