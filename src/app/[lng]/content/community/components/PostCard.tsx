"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import ReportModal from "@/app/[lng]/content/community/components/ReportModal";
import { getCookie } from "@/utils/community/community";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { AlertMessageRef } from "@/components/alert-message";
import FaceBookIcon from "@/icons/socialMedia/facebook";
import WhatsAppIcon from "@/icons/socialMedia/whatsapp";
import TwitterIcon from "@/icons/socialMedia/twitter";
import LinkedInIcon from "@/icons/socialMedia/linkedin";
import CopyIcon from "@/icons/socialMedia/copyIcon";
import InstagramIcon from "@/icons/socialMedia/instagram";
import TikTokIcon from "@/icons/socialMedia/tiktok";
interface PostCardProps {
  postId: string;
  userName: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  likeCount: number;
  CommentCount: number;
  slug: string;
  dateCreated: string;
  onLike?: (postId: string) => void;
  alertRef?: React.RefObject<AlertMessageRef | null>;
}

const PostCard: React.FC<PostCardProps> = ({
  postId,
  userName,
  title,
  category,
  description,
  imageUrl,
  likeCount,
  CommentCount,
  slug,
  dateCreated,
  onLike,
  alertRef,
}) => {
  const [localDate, setLocalDate] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const open = Boolean(anchorEl);
  const [showShareIcons, setShowShareIcons] = useState(false);

  useEffect(() => {
    const formatted = new Date(dateCreated).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    setLocalDate(formatted);
  }, [dateCreated]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleReport = () => {
    const token = getCookie("qat");
    if (!token) {
      alertRef?.current?.showAlert({
        title: "Warning",
        message: "Please login to report this post.",
        severity: "warning",
      });
      handleClose();
      return;
    }
    handleClose();
    setReportModalOpen(true);
  };

  const handleConfirmReport = async () => {
    const token = getCookie("qat");
    if (!token) {
      alert("You must be logged in to report a post.");
      setReportModalOpen(false);
      return;
    }

    try {
      await api.post(
        "report/createcommunitypost",
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alertRef?.current?.showAlert({
        title: "Success",
        message: "Post reported successfully.",
        severity: "success",
      });
    } catch (error: any) {
      console.error(" Report failed:", error);
      toast.error("Failed to report. Try again later.");
    } finally {
      setReportModalOpen(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#fff",
        border: "1px solid #E0E0E0",
        borderRadius: "12px",
        mb: 3,
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          px={2}
          pt={2}
        >
          {/* 🔗 Category Link */}
          <Link
            href={`/content/community/${slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="caption"
              sx={{
                backgroundColor: "#FFF0EA",
                color: "#EB6329",
                fontSize: "12px",
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                fontWeight: 600,
              }}
            >
              {category}
            </Typography>
          </Link>

          {/* Menu Icon */}
          <Box>
            <IconButton size="small" onClick={handleMenuClick}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{ elevation: 1, sx: { borderRadius: 1, mt: 1 } }}
            >
              <MenuItem onClick={handleReport}>Report</MenuItem>
            </Menu>
          </Box>
        </Stack>

        {/* 🔗 Title Link */}
        <Link
          href={`/content/community/${slug}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography
            fontWeight={700}
            fontSize="16px"
            sx={{ px: 2, pt: 1, pb: 1 }}
          >
            {title}
          </Typography>
        </Link>

        {/* 🔗 Image Link */}
        {imageUrl && imageUrl.trim() !== "" && (
          <Link href={`/content/community/${slug}`}>
            <Box sx={{ width: "100%", position: "relative", mb: 2 }}>
              <Image
                src={imageUrl}
                alt={title}
                width={933}
                height={768}
                style={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Link>
        )}

        {/* Description */}
        {description && (
          <Box sx={{ px: 2, mb: 2 }}>
            {parse(description, {
              replace: (domNode) => {
                if (
                  domNode.type === "tag" &&
                  domNode.name === "p" &&
                  domNode.children?.some(
                    (child) =>
                      child.type === "tag" &&
                      ["ul", "ol", "h1", "h2", "div", "p"].includes(child.name)
                  )
                ) {
                  return <div>{parse(domNode.children as any)}</div>;
                }

                // remove inline font-family styles
                if (
                  domNode.type === "tag" &&
                  domNode.attribs?.style &&
                  domNode.attribs.style.includes("font-family")
                ) {
                  delete domNode.attribs.style;
                }

                return undefined;
              },
            })}
          </Box>
        )}

        {/* Bottom Row */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1.5}
        >
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#E0E0E0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonIcon fontSize="small" sx={{ color: "#757575" }} />
            </Box>
            <Typography fontWeight={600} fontSize="14px" color="#1D1F2C">
              {userName}
            </Typography>
            <Typography fontSize="13px" color="#7A7F87">
              • {localDate}
            </Typography>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                background: "#F2F5F9",
                borderRadius: "20px",
                px: 1.2,
                py: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                size="small"
                sx={{ p: 0, color: "#2F80ED" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(postId);
                }}
              >
                <ThumbUpAltOutlinedIcon fontSize="small" />
              </IconButton>
              <Typography fontSize="13px" fontWeight={500} color="#2F80ED">
                {likeCount}
              </Typography>
            </Stack>

            <Box
              sx={{
                background: "#F2F5F9",
                borderRadius: "20px",
                p: 0.5,
                display: "flex",
                alignItems: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                size="small"
                sx={{ p: 0, color: "#2F80ED" }}
                onClick={() => setShowShareIcons((prev) => !prev)}
              >
                <ShareOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                background: "#F2F5F9",
                borderRadius: "20px",
                px: 1.2,
                py: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton
                size="small"
                sx={{ p: 0, color: "#2F80ED" }}
              // onClick={() => setShowShareIcons((prev) => !prev)}
              >
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>

              <Typography fontSize="13px" fontWeight={500} color="#2F80ED">
                {CommentCount}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        {showShareIcons && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1,
              backgroundColor: "#fff",
              borderRadius: "12px",
              width: "fit-content",
              ml: "auto",
              boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            {[
              {
                href: `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/en/content/community/${slug}`,
                icon: <FaceBookIcon isMobile={isMobile} />,
                alt: "Facebook",
              },
              {
                href: `https://www.instagram.com/`,
                icon: <InstagramIcon isMobile={isMobile} />,
                alt: "Instagram",
              },
              {
                href: `https://api.whatsapp.com/send?text=${window.location.origin}/en/content/community/${slug}`,
                icon: <WhatsAppIcon isMobile={isMobile} />,
                alt: "WhatsApp",
              },
              {
                href: `https://www.tiktok.com/`, // Optional
                icon: <TikTokIcon isMobile={isMobile} />,
                alt: "TikTok",
              },
              {
                href: `https://twitter.com/intent/tweet?url=${window.location.origin}/en/content/community/${slug}`,
                icon: <TwitterIcon isMobile={isMobile} />,
                alt: "Twitter",
              },
              {
                href: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/en/content/community/${slug}`,
                icon: <LinkedInIcon isMobile={isMobile} />,
                alt: "LinkedIn",
              },
            ].map(({ href, icon, alt }) => (
              <IconButton
                key={alt}
                onClick={() => window.open(href, "_blank")}
                sx={{ p: 0 }}
              >
                {icon}
              </IconButton>
            ))}

            <IconButton
              onClick={() => {
                const shareUrl = `${window.location.origin}/en/content/community/${slug}`;
                navigator.clipboard.writeText(shareUrl);
                alertRef?.current?.showAlert({
                  title: "Success",
                  message: "Post Copied successfully.",
                  severity: "success",
                });
              }}
              sx={{ p: 0 }}
            >
              <CopyIcon isMobile={isMobile} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Report Modal */}
      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onConfirm={handleConfirmReport}
      />
    </Box>
  );
};

export default PostCard;