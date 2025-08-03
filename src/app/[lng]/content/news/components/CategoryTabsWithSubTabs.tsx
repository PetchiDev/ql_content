'use client';

import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, Paper } from '@mui/material';
import { getAllNewsCategoris } from '@/utils/content/content';
import { useSearchParams } from 'next/navigation';

interface SubCategory {
  id: number;
  subCategoryName: string;
}

interface Category {
  id: number;
  categoryName: string;
  subCategories: SubCategory[];
}

interface Props {
  onCategoryChange: (categoryId: number) => void;
  onSubCategoryChange: (subCategoryId: number) => void;
}

const CategoryTabsWithSubTabs: React.FC<Props> = ({
  onCategoryChange,
  onSubCategoryChange,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchCategories() {
      const data = await getAllNewsCategoris();
      setCategories(data || []);

      const urlCategoryId = Number(searchParams.get('category'));
      let categoryIndex = 0;

      if (urlCategoryId && data?.length > 0) {
        const matchedIndex = data.findIndex((cat: { id: number; }) => cat.id === urlCategoryId);
        if (matchedIndex !== -1) {
          categoryIndex = matchedIndex;
          setSelectedCategoryIndex(matchedIndex);
        }
      }

      // Set selected category and first subcategory
      const selectedCategory = data[categoryIndex];
      if (selectedCategory) {
        onCategoryChange(selectedCategory.id);
        const firstSub = selectedCategory.subCategories?.[0];
        if (firstSub) {
          onSubCategoryChange(firstSub.id);
        }
      }
    }

    fetchCategories();
  }, [searchParams, onCategoryChange, onSubCategoryChange]);

  const handleCategoryChange = (_: any, newValue: number) => {
    setSelectedCategoryIndex(newValue);
    setSelectedSubCategoryIndex(0);
    const selectedCat = categories[newValue];
    onCategoryChange(selectedCat.id);
    const firstSub = selectedCat.subCategories?.[0];
    if (firstSub) onSubCategoryChange(firstSub.id);
  };

  const handleSubCategoryChange = (_: any, newValue: number) => {
    setSelectedSubCategoryIndex(newValue);
    const subCategoryId = categories[selectedCategoryIndex]?.subCategories?.[newValue]?.id;
    if (subCategoryId) onSubCategoryChange(subCategoryId);
  };

  const selectedSubCategories = categories[selectedCategoryIndex]?.subCategories || [];

  return (
    <Box sx={{ width: '100%', px: 2, pt: 3, bgcolor: '#F6F7FB' }}>
      {/* Category Tabs */}
      <Box display="flex" justifyContent="center" mb={3}>
        <Paper elevation={3} sx={{ borderRadius: '5px', px: 4, py: 1, display: 'inline-flex', bgcolor: 'white', minHeight: 60 }}>
          <Tabs
            value={selectedCategoryIndex}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '16px',
                color: '#666',
                borderRadius: '5px',
                px: 4,
                py: 1.6,
                mx: 1,
                minHeight: 'auto',
              },
              '& .Mui-selected': {
                bgcolor: '#FF7A00',
                color: 'white',
                fontWeight: 700,
              },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat.id} label={cat.categoryName} />
            ))}
          </Tabs>
        </Paper>
      </Box>

      {/* SubCategory Tabs */}
      <Box mb={2} width="100%">
        <Tabs
          value={selectedSubCategoryIndex}
          onChange={handleSubCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            px: { xs: 1, md: 2 },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF7A00',
              height: '3px',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '16px',
              color: '#333',
              minHeight: 'auto',
              px: 0,
              mr: 10,
            },
            '& .Mui-selected': {
              color: '#003459',
              fontWeight: 700,
            },
          }}
        >
          {selectedSubCategories.map((sub) => (
            <Tab key={sub.id} label={sub.subCategoryName} />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default CategoryTabsWithSubTabs;
