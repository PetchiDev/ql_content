"use client";
import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Button, Stack, InputLabel, FormControl, Select, CircularProgress, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getAllForumCategories } from "@/utils/community/community";

interface ForumCategory {
  id: string;
  name: string;
}
interface Props {
  onSearch: (searchText: string, categoryId: string) => void;
}

const CommunitySearchBar: React.FC<Props> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState(""); // Storing category name
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let canceled = false;
    const fetchCategories = async () => {
      try {
        const data = await getAllForumCategories();
        if (!canceled) setCategories(data || []);
      } catch (error) {
        if (!canceled) console.error("Failed to fetch categories:", error);
      } finally {
        if (!canceled) setLoadingCategories(false);
      }
    };
    fetchCategories();
    return () => { canceled = true; };
  }, []);

  const handleSearch = () => {
    const selected = categories.find((c) => c.name === category);
    const selectedCategoryId = selected?.id ?? "";
    onSearch(searchText, selectedCategoryId);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#E5E5E5",
        px: { xs: 1, sm: 2 },
        py: { xs: 1.5, sm: 2 },
        borderRadius: "12px",
        width: "100%",
        maxWidth: 1170,
        mx: "auto"
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={0}
        alignItems="stretch"
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          minHeight: { xs: 0, md: 54 },
          boxShadow: 1,
          width: "100%",
        }}
      >
        {/* Search Input */}
        <TextField
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9CA3AF" }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 0,
              backgroundColor: "#fff",
              px: 1.5,
              minHeight: 54,
              borderRight: { xs: "none", md: "1px solid #D9DCE1" },
              '& fieldset': { border: 'none' },
            }
          }}
          sx={{
            borderRadius: 0,
            flex: 2,
            minWidth: 0,
            ".MuiOutlinedInput-root": { borderRadius: 0 }
          }}
        />

        {/* Category Dropdown */}
        <FormControl
          fullWidth
          variant="outlined"
          sx={{
            minWidth: { xs: '100%', md: 170 },
            backgroundColor: "#fff",
            px: { xs: 0, md: 1.5 },
            borderRight: { xs: "none", md: "1px solid #D9DCE1" },
            flex: 1,
            justifyContent: 'center',
            '.MuiOutlinedInput-root': {
              borderRadius: 0,
              minHeight: 54,
              backgroundColor: "#fff",
            },
            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
            '.MuiSelect-select': { px: 1 },
            '.MuiInputLabel-root': { ml: 1, fontSize: "12px", color: "#9CA3AF" }
          }}
        >
          <InputLabel shrink sx={{
            ml: 1,
            fontSize: "12px",
            color: "#9CA3AF",
            zIndex: 2,
          }}>
            Category
          </InputLabel>
          <Select
            value={category}
            displayEmpty
            onChange={(e) => setCategory(e.target.value)}
            renderValue={(selected) =>
              selected ? (
                <span style={{ color: "#111827", fontWeight: 500 }}>{selected}</span>
              ) : (
                <span style={{ color: "#9CA3AF" }}>Choose</span>
              )
            }
            inputProps={{ 'aria-label': 'Category' }}
            MenuProps={{ PaperProps: { style: { maxHeight: 260 } } }}
          >
            {loadingCategories ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Show Results Button */}
        <Button
          onClick={handleSearch}
          fullWidth
          sx={{
            backgroundColor: "#FF7A1A",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 0,
            minHeight: 54,
            px: { xs: 0, md: 4 },
            width: { xs: "100%", md: "auto" },
            whiteSpace: "nowrap",
            "&:hover": { backgroundColor: "#e96b0d" },
            fontSize: 16,
          }}
        >
          Show Results
        </Button>
      </Stack>
    </Box>
  );
};

export default CommunitySearchBar;
