import React, { useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  Paper,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";

function ShortenerPage() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState("");
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const handleShorten = async () => {
    if (!url) return alert("Enter a URL");
    if (shortenedUrls.length >= 5) return alert("Max 5 URLs");

    try {
      const res = await axios.post("/shorturls", {
        url,
        validity: validity ? parseInt(validity) : null,
      });
      setShortenedUrls([...shortenedUrls, res.data]);
      setUrl("");
      setValidity("");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Full height center
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        padding: "20px",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          maxWidth: 600,
          width: "100%",
          padding: 4,
          borderRadius: 4,
          background: "#ffffff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 3, textAlign: "center", fontWeight: 700, color: "#1976d2" }}
        >
          🔗 URL Shortener
        </Typography>

        <TextField
          label="Original URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Validity (minutes, optional)"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          onClick={handleShorten}
          sx={{
            width: "100%",
            mb: 4,
            py: 1.4,
            fontWeight: 600,
            borderRadius: 2,
            background: "linear-gradient(90deg, #1976d2, #42a5f5)",
          }}
        >
          🚀 SHORTEN URL
        </Button>

        <Divider sx={{ mb: 3 }} />

        {shortenedUrls.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center",
              color: "gray",
              fontStyle: "italic",
              py: 2,
            }}
          >
            No shortened URLs yet. Start by adding one above!
          </Typography>
        ) : (
          <List>
            {shortenedUrls.map((item, idx) => (
              <ListItem
                key={idx}
                sx={{
                  background: "#f4f7fe",
                  mb: 2,
                  borderRadius: 3,
                  boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  p: 2,
                  transition: "0.3s",
                  "&:hover": { background: "#e3eafc" },
                }}
              >
                <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
                  Original: {item.originalUrl}
                </Typography>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  Short:{" "}
                  <span style={{ color: "#1976d2" }}>{item.shortlink}</span>
                </Typography>
                {item.validity ? (
                  <Chip
                    label={`Expires in ${item.validity} min`}
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                ) : (
                  <Chip
                    label="Expires in Unlimited min"
                    color="success"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                )}
                <IconButton
                  onClick={() => handleCopy(item.shortlink)}
                  sx={{
                    alignSelf: "flex-end",
                    color: "#1976d2",
                    "&:hover": { color: "#0d47a1" },
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </div>
  );
}

export default ShortenerPage;
