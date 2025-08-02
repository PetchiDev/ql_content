'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Avatar,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface CommentBoxProps {
    nid?: string;
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
    subject: string;
    dateCreated: string;
    likeCount: number;
    dislikeCount: number;
}

interface ApiResponse {
    comments: Comment[];
    totalComments: number;
    [key: string]: any;
}

const MAX_COMMENT_LENGTH = 500;
const PAGE_SIZE = 10;

const CommentBox: React.FC<CommentBoxProps> = ({ nid = '' }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [comment, setComment] = useState('');
    const [uid, setUid] = useState('');
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalComments, setTotalComments] = useState(0);

    const getCookie = (name: string): string | null => {
        const cookies = document.cookie.split(';');
        const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    };

    useEffect(() => {
        const qatCookie = getCookie('qat');
        if (qatCookie) {
            try {
                const decoded = jwtDecode<DecodedToken>(qatCookie);
                if (decoded.user) {
                    const extractedUid = decoded.user.qlnext_user_id || decoded.user.uid;
                    const extractedName = decoded.user.name;
                    setToken(qatCookie);
                    setUid(extractedUid || '');
                    setUserName(extractedName || '');
                    setIsLoggedIn(true);
                }
            } catch (err) {
                console.error('Invalid JWT token', err);
            }
        }
    }, []);

    const fetchComments = async () => {
        if (!nid || !token) return;
        
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.get<ApiResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}news/commentsbyArticleid/${nid}?page=${currentPage}&perPage=${PAGE_SIZE}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            setComments(res.data.comments || []);
            setTotalComments(res.data.totalComments || 0);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
            setError('Failed to load comments. Please try again later.');
            setComments([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (commentId: string) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}news/commentslike/${commentId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            fetchComments();
        } catch (error) {
            console.error('Failed to like comment:', error);
            setError('Failed to like comment. Please try again.');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [nid, token, currentPage]);

    const handlePost = async () => {
        if (!comment.trim() || comment.length > MAX_COMMENT_LENGTH) return;

        const guid = crypto.randomUUID();
        const payload = {
            nid,
            uid,
            userName,
            comment,
            commentId: guid,
            parentCommentId: guid,
            commentedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
        };

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}news/comments`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            setComment('');
            fetchComments();
        } catch (error) {
            console.error('Failed to post comment:', error);
            setError('Failed to post comment. Please try again.');
        }
    };

    const paginatedComments = useMemo(() => comments, [comments]);
    const totalPages = Math.ceil(totalComments / PAGE_SIZE);
    const showPostButton = comment.trim().length > 0 && comment.length <= MAX_COMMENT_LENGTH;

    const handleCloseError = () => {
        setError('');
    };

    return (
        <Box py={4}>
            <Typography variant="h6" fontWeight={600} mb={2}>
                Comments
            </Typography>

            <Box
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #EAECF0',
                    padding: '24px',
                }}
            >
                {isLoggedIn ? (
                    <>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            <TextField
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={`Add a comment (max ${MAX_COMMENT_LENGTH} characters)`}
                                fullWidth
                                multiline
                                minRows={1}
                                error={comment.length > MAX_COMMENT_LENGTH}
                                helperText={
                                    comment.length > MAX_COMMENT_LENGTH 
                                        ? `Comment must be less than ${MAX_COMMENT_LENGTH} characters` 
                                        : ''
                                }
                                sx={{
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        paddingRight: showPostButton ? 0 : '14px',
                                        '& fieldset': { borderColor: '#F97316' },
                                        '&:hover fieldset': { borderColor: '#F97316' },
                                        '&.Mui-focused fieldset': { borderColor: '#F97316' },
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
                                        borderRadius: '8px',
                                        backgroundColor: '#F97316',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            backgroundColor: '#ea6a0c',
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    Post
                                </Button>
                            )}
                        </Stack>

                        <Box mt={4}>
                            {isLoading ? (
                                <Box display="flex" justifyContent="center" py={4}>
                                    <CircularProgress />
                                </Box>
                            ) : paginatedComments.length === 0 ? (
                                <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                                    No comments yet. Be the first to comment!
                                </Typography>
                            ) : (
                                paginatedComments.map((c) => (
                                    <Box
                                        key={c.commentId}
                                        mt={2}
                                        p={2}
                                        border="1px solid #EAECF0"
                                        borderRadius="12px"
                                        bgcolor="#fff"
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                            <Avatar src={c.userImageUrl} sx={{ width: 32, height: 32 }} />
                                            <Typography fontWeight={600}>{c.userName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                • {new Date(c.dateCreated).toLocaleString()}
                                            </Typography>
                                        </Stack>
                                        <Typography mb={1}>{c.subject}</Typography>
                                        <Stack direction="row" spacing={2}>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleLike(c.commentId)}
                                                    aria-label="Like comment"
                                                >
                                                    <ThumbUpAltOutlinedIcon fontSize="small" />
                                                </IconButton>
                                                <Typography variant="body2">{c.likeCount}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                ))
                            )}
                        </Box>

                        {totalPages > 1 && (
                            <Box display="flex" justifyContent="center" alignItems="center" mt={4} gap={1}>
                                <Button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1 || isLoading}
                                >
                                    Previous
                                </Button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={currentPage === i + 1 ? 'contained' : 'text'}
                                        onClick={() => setCurrentPage(i + 1)}
                                        disabled={isLoading}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || isLoading}
                                >
                                    Next
                                </Button>
                            </Box>
                        )}
                    </>
                ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                        <Typography variant="body1" fontWeight={500}>
                            You must be logged in to comment
                        </Typography>
                    </Box>
                )}

                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={handleCloseError}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default CommentBox;