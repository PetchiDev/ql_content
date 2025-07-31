"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  InputLabel,
  FormControl,
  Select,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
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
  const [category, setCategory] = useState(""); // This is category name
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
    return () => {
      canceled = true;
    };
  }, []);

  const handleSearch = () => {
    const selected = categories.find((c) => c.name === category);
    const selectedCategoryId = selected?.id ?? "";
    onSearch(searchText, selectedCategoryId);
  };
  return (
    <Box
      sx={{
        backgroundColor: "#E5E5E5", // Grey background
        px: 2,
        py: 2,
        borderRadius: "8px",
        width: "100%",
        maxWidth: "1170px", // max width
        mx: "auto", // Center it horizontally
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="stretch"
        justifyContent="center"
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: 1,
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
              px: 1,
              py: 0.5,
              height: "100%",
              borderRight: "1px solid #D9DCE1",
            },
          }}
        />

        {/* Category Dropdown */}
        <FormControl
          fullWidth
          variant="outlined"
          sx={{
            minWidth: 180,
            backgroundColor: "#fff",
            px: 1,
            borderRight: "1px solid #D9DCE1",
            display: "flex",
            justifyContent: "center",
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
              height: "100%",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <InputLabel
            shrink
            sx={{
              ml: 1,
              fontSize: "12px",
              color: "#9CA3AF",
              mt: "-4px",
            }}
          >
            Category
          </InputLabel>
          <Select
            value={category}
            displayEmpty
            onChange={(e) => setCategory(e.target.value)}
            renderValue={(selected) =>
              selected ? (
                <span style={{ color: "#111827", fontWeight: 500 }}>
                  {selected}
                </span>
              ) : (
                <span style={{ color: "#9CA3AF" }}>Choose</span>
              )
            }
            MenuProps={{
              PaperProps: {
                style: { maxHeight: 250 },
              },
            }}
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
          sx={{
            backgroundColor: "#FF7A1A",
            color: "#fff",
            fontWeight: 600,
            px: 4,
            borderRadius: 0,
            whiteSpace: "nowrap",
            "&:hover": {
              backgroundColor: "#e96b0d",
            },
          }}
        >
          Show Results
        </Button>
      </Stack>
    </Box>

    
  );
}

export default CommunitySearchBar;
