import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address.', severity: 'warning' });
      return;
    }

    setIsSubscribing(true);

    try {
      const baseUrl = 'https://qatarliving.us9.list-manage.com/subscribe/post-json';
      const u = '3ab0436d22c64716e67a03f64';
      const id = '94198fac96';
      const botField = '';
      const subscribe = 'Subscribe';
      const timestamp = Date.now();
      const callback = `jQuery${timestamp}_${timestamp}`;

      const params = new URLSearchParams({
        u,
        id,
        c: callback,
        EMAIL: email,
        [`b_${u}_${id}`]: botField,
        subscribe,
        _: timestamp.toString(),
      });

      const url = `${baseUrl}?${params.toString()}`;

      const response = await axios.post(url, {}, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://qatarliving.com/',
          'Origin': 'https://qatarliving.com',
        },
      });

      const match = /\((\{.*\})\)/.exec(response.data);
      const json = match?.[1];
      let msg = '';
      if (json) {
        const parsed = JSON.parse(json);
        msg = parsed.msg || parsed.errors?.toString() || '';
      }

      if (msg.toLowerCase().includes('thank you for subscribing')) {
        setSnackbar({ open: true, message: msg, severity: 'success' });
        setEmail('');
        // Optional: trackSubscribeEvent(email)
      } else {
        setSnackbar({ open: true, message: msg || 'Subscription failed.', severity: 'warning' });
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setSnackbar({ open: true, message: 'Something went wrong. Please try again.', severity: 'error' });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
      <Box
        sx={{
          borderRadius: 2,
          border: '1px solid #eee',
          p: 3,
          height: '100%',
          bgcolor: '#fff',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Get The QL newsletter. Subscribe to receive the top stories you need to know right now.
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your email"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          inputProps={{ spellCheck: false }}
        />
        <Button
          fullWidth
          variant="contained"
          disabled={isSubscribing}
          onClick={handleSubscribe}
          sx={{
            bgcolor: '#FF6A00',
            '&:hover': { bgcolor: '#e35d00' },
          }}
        >
          {isSubscribing ? <><CircularProgress size={18} sx={{ mr: 1, color: '#fff' }} /> Subscribing...</> : 'Subscribe'}
        </Button>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity as any} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default NewsletterSubscription;
