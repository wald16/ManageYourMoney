import React, { useState, useEffect } from 'react';
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
    FormControlLabel,
    Checkbox,
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

const RememberMeContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
    },
}));

console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(() => {
        // Check if there's a remembered email when component mounts
        return localStorage.getItem('rememberedEmail') !== null;
    });

    // Load remembered email when component mounts
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setFormData(prev => ({ ...prev, email: rememberedEmail }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData);
            localStorage.setItem('token', res.data.token);

            // Handle remember me functionality
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

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
                    HOLA
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 3,
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontStyle: 'italic'
                    }}
                >
                    linda
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
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                        autoComplete="current-password"
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

                    <RememberMeContainer>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&.Mui-checked': {
                                            color: '#ff4d4d',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&:hover': {
                                            color: '#ff4d4d',
                                        },
                                    }}
                                >
                                    Remember me
                                </Typography>
                            }
                        />
                    </RememberMeContainer>

                    <CustomButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </CustomButton>
                    <Box sx={{ textAlign: 'center' }}>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#ff4d4d',
                                    '&:hover': {
                                        color: '#ff8533',
                                    },
                                }}
                            >
                                Don't have an account? Sign Up
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </StyledPaper>
        </Container>
    );
};

export default Login; 