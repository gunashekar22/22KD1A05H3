import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

function StatsPage() {
    const { shortCode } = useParams();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`/shorturls/${shortCode}`); // Use proxy path
                setStats(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching stats');
            }
        };
        fetchStats();
    }, [shortCode]);

    if (error) return <Typography color="error">{error}</Typography>;
    if (!stats) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                    Statistics for {shortCode}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                    <strong>Original URL:</strong> {stats.originalUrl}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                    <strong>Created:</strong> {stats.createdAt}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                    <strong>Expiry:</strong> {stats.expiry}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                    <strong>Total Clicks:</strong> {stats.totalClicks}
                </Typography>
                <List sx={{ bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    {stats.clickData.map((click, index) => (
                        <ListItem key={index} sx={{ mb: 1, boxShadow: 1, borderRadius: 2 }}>
                            <ListItemText
                                primary={
                                    <span style={{ fontWeight: 'bold', color: '#388e3c' }}>
                                        Timestamp: {click.timestamp}
                                    </span>
                                }
                                secondary={
                                    <span style={{ color: '#616161' }}>
                                        Source: {click.source} | Location: {click.location}
                                    </span>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
  }

  export default StatsPage;