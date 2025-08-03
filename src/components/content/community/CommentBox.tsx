"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface CommentBoxProps {
  nid: string;
}

interface DecodedToken {
  user?: {
    uid?: string;
    name?: string;
    qlnext_user_id?: string;
    email?: string;
    image?: string;
  };
}

interface Comment {
  commentId: string;
  userName: string;
  userImageUrl?: string;
  content: string;
  commentedAt: string;
  updatedAt: string;
  likeCount: number;
  subject: string;
  dislikeCount: number;
}

const CommentBox: React.FC<CommentBoxProps> = ({ nid }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comment, setComment] = useState("");
  const [uid, setUid] = useState("");
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    const cookies = document.cookie;
    const qatCookie = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("qat="));
    if (qatCookie) {
      const token = decodeURIComponent(qatCookie.split("=")[1]);
      setToken(token);
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.user) {
          const extractedUid = decoded.user.qlnext_user_id || decoded.user.uid;
          const extractedName = decoded.user.name;
          setUid(extractedUid || "");
          setUserName(extractedName || "");
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Invalid JWT token", err);
      }
    }
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}community/getCommentsByPostId/${nid}?page=${currentPage}&perPage=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const commentList = res.data?.comments || [];
      setComments(commentList);
    } catch (err) {
      console.error(" Failed to fetch comments:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    if (nid && token) {
      fetchComments();
    }
  }, [nid, token]);

  const handlePost = async () => {
    if (!comment.trim()) return;

    const payload = {
      communityPostId: nid,
      content: comment,
      isActive: true,
      updatedAt: new Date().toISOString(),
      commentsLikeCount: 0,
      likedUserIds: [],
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}community/addCommentByCategoryId`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setComment("");
      fetchComments(); // refresh after post
    } catch (error) {
      console.error(" Failed to post comment:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const payload = {
        commentId,
        communityPostId: nid,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}community/likeCommentByUserId`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchComments(); // refresh after like
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  const paginatedComments = Array.isArray(comments)
    ? comments.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const showPostButton = comment.trim().length > 0;
  const totalPages = Math.ceil(comments.length / pageSize);

  return (
    <Box py={4}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Comments
      </Typography>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          border: "1px solid #EAECF0",
          padding: "24px",
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <TextField
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                fullWidth
                multiline
                minRows={1}
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    paddingRight: showPostButton ? 0 : "14px",
                    "& fieldset": { borderColor: "#F97316" },
                    "&:hover fieldset": { borderColor: "#F97316" },
                    "&.Mui-focused fieldset": { borderColor: "#F97316" },
                  },
                }}
              />
              {showPostButton && (
                <Button
                  onClick={handlePost}
                  variant="contained"
                  sx={{
                    mt: 0.5,
                    height: 40,
                    width: 72,
                    borderRadius: "8px",
                    backgroundColor: "#F97316",
                    textTransform: "none",
                    fontWeight: 500,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#ea6a0c",
                      boxShadow: "none",
                    },
                  }}
                >
                  Post
                </Button>
              )}
            </Stack>

            <Box mt={4}>
              {paginatedComments.map((c) => (
                <Box
                  key={c.commentId}
                  mt={2}
                  p={2}
                  border="1px solid #EAECF0"
                  borderRadius="12px"
                  bgcolor="#fff"
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <Avatar
                      src={c.userImageUrl}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography fontWeight={600}>{c.userName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      • {new Date(c.commentedAt).toLocaleString()}
                    </Typography>
                  </Stack>
                  <Typography mb={1}>{c.content}</Typography>
                  <Stack direction="row" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <ThumbUpAltOutlinedIcon
                        fontSize="small"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleLikeComment(c.commentId)}
                      />
                      <Typography variant="body2">{c.likeCount}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <ThumbUpAltOutlinedIcon
                        fontSize="small"
                        sx={{ transform: "scaleX(-1)" }}
                      />
                      <Typography variant="body2">{c.dislikeCount}</Typography>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={4}
              gap={1}
            >
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "contained" : "text"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </Box>
          </>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <Typography variant="body1" fontWeight={500}>
              You must be logged in to comment
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommentBox;
