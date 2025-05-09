import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import axios from 'axios';

// Dragon fire animation
const fireAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
  50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
    color: '#fff',
}));

const FireIcon = styled(LocalFireDepartmentIcon)(({ theme }) => ({
    fontSize: '2rem',
    color: '#ff4d4d',
    animation: `${fireAnimation} 2s ease-in-out infinite`,
    filter: 'drop-shadow(0 0 8px rgba(255, 77, 77, 0.6))',
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        color: '#fff',
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
        },
        '&:hover fieldset': {
            borderColor: '#ff4d4d',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#ff4d4d',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#ff4d4d',
    },
}));

const CustomButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #ff4d4d 30%, #ff8533 90%)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '10px',
    textTransform: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    boxShadow: '0 3px 12px rgba(255, 77, 77, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(45deg, #ff3333 30%, #ff6b1a 90%)',
        boxShadow: '0 6px 20px rgba(255, 77, 77, 0.4)',
        transform: 'translateY(-2px)',
    },
}));

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const { confirmPassword, ...registerData } = formData;
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, registerData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <StyledPaper elevation={3}>
                <FireIcon sx={{ mb: 2 }} />

                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        mb: 1,
                        color: '#ff4d4d',
                        textShadow: '0 0 10px rgba(255, 77, 77, 0.5)',
                        fontWeight: 700
                    }}
                >
                    CREA TU CUENTA
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 3,
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontStyle: 'italic'
                    }}
                >
                    nashe
                </Typography>

                {error && (
                    <Typography color="error" align="center" gutterBottom>
                        {error}
                    </Typography>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <CustomTextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <CustomTextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <CustomTextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <CustomTextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <CustomButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </CustomButton>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#ff4d4d',
                                    '&:hover': {
                                        color: '#ff8533',
                                    },
                                }}
                            >
                                Already have an account? Sign In
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </StyledPaper>
        </Container>
    );
};

export default Register; 