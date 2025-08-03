import React from "react";
import { Box, Typography } from "@mui/material";

interface PopularArticleItemProps {
  image: string;
  title: string;
}

const PopularArticleItem: React.FC<PopularArticleItemProps> = ({ image, title }) => {
  return (
    <Box display="flex" gap={2}>
      <img
        src={image}
        alt={title}
        style={{
          width: 100,
          height: 70,
          objectFit: "cover",
          borderRadius: 6,
        }}
      />
      <Typography variant="subtitle1" fontWeight={500}>
        {title}
      </Typography>
    </Box>
  );
};

export default PopularArticleItem;
