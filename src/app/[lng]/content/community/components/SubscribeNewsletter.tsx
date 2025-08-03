"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";

const SubscribeNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid email address.",
        severity: "warning",
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const baseUrl = "https://qatarliving.us9.list-manage.com/subscribe/post-json";
      const u = "3ab0436d22c64716e67a03f64";
      const id = "94198fac96";
      const botField = "";
      const subscribe = "Subscribe";
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
          "User-Agent": "Mozilla/5.0",
          "Referer": "https://qatarliving.com/",
          "Origin": "https://qatarliving.com",
        },
      });

      const match = /\((\{.*\})\)/.exec(response.data);
      const json = match?.[1];
      let msg = "";

      if (json) {
        const parsed = JSON.parse(json);
        msg = parsed.msg || parsed.errors?.toString() || "";
      }

      if (msg.toLowerCase().includes("thank you for subscribing")) {
        setSnackbar({ open: true, message: msg, severity: "success" });
        setEmail("");
      } else {
        setSnackbar({
          open: true,
          message: msg || "Subscription failed.",
          severity: "warning",
        });
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        bgcolor: "#fff",
        borderRadius: "10px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        width: "100%",
      }}
    >
      {/* Email icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: "#E9F1FB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <EmailIcon sx={{ color: "#11476b" }} />
      </Box>

      {/* Title */}
      <Typography
        align="center"
        fontWeight={600}
        fontSize="16px"
        color="#000"
        mb={1}
      >
        Get The QL newsletter. Subscribe to receive the top stories you need to
        know right now.
      </Typography>

      {/* Email input */}
      <TextField
        placeholder="Enter your email"
        fullWidth
        size="medium"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          my: 2,
          "& input": {
            py: 1.4,
          },
        }}
        inputProps={{ spellCheck: false }}
      />

      {/* Subscribe button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleSubscribe}
        disabled={isSubscribing}
        sx={{
          bgcolor: "#FF7A1A",
          color: "#fff",
          fontWeight: 600,
          textTransform: "none",
          py: 1.3,
          fontSize: "15px",
          "&:hover": {
            bgcolor: "#e86f14",
          },
        }}
      >
        {isSubscribing ? (
          <>
            <CircularProgress size={18} sx={{ mr: 1, color: "#fff" }} />
            Subscribing...
          </>
        ) : (
          "Subscribe"
        )}
      </Button>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity as any}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubscribeNewsletter;
