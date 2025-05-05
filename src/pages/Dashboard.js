import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Paper elevation={3} sx={{ p: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">
          {value}
        </Typography>
      </Box>
      <Icon sx={{ fontSize: 40, color }} />
    </Box>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    fullTimeEmployees: 0,
    partTimeEmployees: 0,
    interns: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employees', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        const employees = response.data;
        const statistics = {
          totalEmployees: employees.length,
          fullTimeEmployees: employees.filter(e => e.employeeType === 'Full-time').length,
          partTimeEmployees: employees.filter(e => e.employeeType === 'Part-time').length,
          interns: employees.filter(e => e.employeeType === 'Intern').length,
        };
        
        setStats(statistics);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch dashboard statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={PeopleIcon}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Full-time"
              value={stats.fullTimeEmployees}
              icon={WorkIcon}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Part-time"
              value={stats.partTimeEmployees}
              icon={TimerIcon}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Interns"
              value={stats.interns}
              icon={SchoolIcon}
              color="#9c27b0"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 