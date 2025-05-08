import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    IconButton,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const SummaryCard = styled(Box)(({ theme, bgcolor }) => ({
    borderRadius: 16,
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
    background: bgcolor,
    color: 'inherit',
    padding: theme.spacing(2),
    minHeight: 90,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
}));

const SectionCard = styled(Box)(({ theme, bgcolor }) => ({
    borderRadius: 16,
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
    background: bgcolor,
    color: 'inherit',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
}));

const BlueButton = styled(Button)(({ theme }) => ({
    borderRadius: 12,
    fontWeight: 700,
    textTransform: 'none',
    background: '#2563eb',
    color: '#fff',
    '&:hover': {
        background: '#1d4ed8',
    },
}));

const ResponsiveTableCell = styled(TableCell)(({ theme, darkmode }) => ({
    padding: theme.spacing(1),
    fontSize: 15,
    color: darkmode === 'true' ? '#fff' : '#222',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5),
        fontSize: 13,
    },
}));

const PIE_COLORS = ['#e50914', '#2196F3', '#F43F5E', '#10B981', '#FBBF24', '#3B82F6', '#A21CAF'];

const lightTheme = {
    background: '#f7f7fa',
    card: '#fff',
    text: '#222',
    accent: '#2563eb',
    income: '#22c55e',
    expense: '#ef4444',
    balance: '#10b981',
    legend: '#222',
};
const darkTheme = {
    background: '#18181b',
    card: '#232526',
    text: '#fff',
    accent: '#2563eb',
    income: '#22c55e',
    expense: '#ef4444',
    balance: '#10b981',
    legend: '#fff',
};

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        type: 'expense',
    });
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        type: 'expense',
    });
    const [darkMode, setDarkMode] = useState(false);
    const themeColors = darkMode ? darkTheme : lightTheme;
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };
    const handleChangePassword = () => {
        alert('Funcionalidad de cambio de contraseña próximamente.');
        handleMenuClose();
    };
    const handleDeleteAccount = () => {
        alert('Funcionalidad de eliminar cuenta próximamente.');
        handleMenuClose();
    };

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://192.168.0.146:5000/api/transactions', {
                headers: { 'x-auth-token': token },
            });
            setTransactions(res.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://192.168.0.146:5000/api/categories', {
                headers: { 'x-auth-token': token },
            });
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://192.168.0.146:5000/api/transactions', formData, {
                headers: { 'x-auth-token': token },
            });
            setOpenDialog(false);
            fetchTransactions();
            setFormData({
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                category_id: '',
                type: 'expense',
            });
        } catch (err) {
            console.error('Error adding transaction:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://192.168.0.146:5000/api/categories', categoryForm, {
                headers: { 'x-auth-token': token },
            });
            setOpenCategoryDialog(false);
            fetchCategories();
            setCategoryForm({ name: '', type: 'expense' });
        } catch (err) {
            console.error('Error adding category:', err);
        }
    };

    const handleCategoryChange = (e) => {
        setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
    };

    const calculateTotals = () => {
        const income = transactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expenses = transactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return { income, expenses, balance: income - expenses };
    };

    const prepareChartData = () => {
        const expensesByCategory = transactions
            .filter((t) => t.type === 'expense')
            .reduce((acc, t) => {
                const category = categories.find((c) => c.id === t.category_id)?.name || 'Sin categoría';
                acc[category] = (acc[category] || 0) + parseFloat(t.amount);
                return acc;
            }, {});

        return Object.entries(expensesByCategory).map(([name, value]) => ({
            name,
            value,
        }));
    };

    const totals = calculateTotals();
    const chartData = prepareChartData();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: themeColors.background, color: themeColors.text, py: 2 }}>
            <Container maxWidth="sm" sx={{ px: { xs: 0.5, sm: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, mt: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Panel</Typography>
                    <Box>
                        <IconButton onClick={() => setDarkMode((prev) => !prev)}>
                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <IconButton onClick={handleProfileClick} sx={{ ml: 1 }}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                            <MenuItem onClick={handleChangePassword}>Cambiar contraseña</MenuItem>
                            <MenuItem onClick={handleDeleteAccount}>Eliminar cuenta</MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>Cerrar sesión</MenuItem>
                        </Menu>
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <SummaryCard bgcolor={themeColors.card}>
                            <Typography variant="subtitle2" sx={{ color: '#888', fontWeight: 600 }}>Ingresos</Typography>
                            <Typography variant="h5" sx={{ color: themeColors.income, fontWeight: 800 }}>{formatCurrency(totals.income)}</Typography>
                        </SummaryCard>
                    </Grid>
                    <Grid item xs={4}>
                        <SummaryCard bgcolor={themeColors.card}>
                            <Typography variant="subtitle2" sx={{ color: '#888', fontWeight: 600 }}>Gastos</Typography>
                            <Typography variant="h5" sx={{ color: themeColors.expense, fontWeight: 800 }}>{formatCurrency(totals.expenses)}</Typography>
                        </SummaryCard>
                    </Grid>
                    <Grid item xs={4}>
                        <SummaryCard bgcolor={themeColors.card}>
                            <Typography variant="subtitle2" sx={{ color: '#888', fontWeight: 600 }}>Balance</Typography>
                            <Typography variant="h5" sx={{ color: themeColors.balance, fontWeight: 800 }}>{formatCurrency(totals.balance)}</Typography>
                        </SummaryCard>
                    </Grid>
                </Grid>
                <SectionCard bgcolor={themeColors.card}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Gastos por Categoría</Typography>
                    <Box sx={{ width: '100%', height: 180 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={60}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend formatter={value => <span style={{ color: themeColors.legend }}>{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </SectionCard>
                <SectionCard bgcolor={themeColors.card}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>Transacciones Recientes</Typography>
                        <BlueButton onClick={() => setOpenDialog(true)} sx={{ ml: 1 }}>+ Nueva Transacción</BlueButton>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <ResponsiveTableCell darkmode={darkMode.toString()}>Fecha</ResponsiveTableCell>
                                    <ResponsiveTableCell darkmode={darkMode.toString()}>Descripción</ResponsiveTableCell>
                                    <ResponsiveTableCell darkmode={darkMode.toString()}>Categoría</ResponsiveTableCell>
                                    <ResponsiveTableCell align="right" darkmode={darkMode.toString()}>Monto</ResponsiveTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <ResponsiveTableCell darkmode={darkMode.toString()}>{new Date(transaction.date).toLocaleDateString('es-ES')}</ResponsiveTableCell>
                                        <ResponsiveTableCell darkmode={darkMode.toString()}>{transaction.description}</ResponsiveTableCell>
                                        <ResponsiveTableCell darkmode={darkMode.toString()}>{transaction.category_name}</ResponsiveTableCell>
                                        <ResponsiveTableCell align="right" darkmode={darkMode.toString()} sx={{ color: transaction.type === 'income' ? themeColors.income : themeColors.expense, fontWeight: 700 }}>
                                            {formatCurrency(parseFloat(transaction.amount))}
                                        </ResponsiveTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </SectionCard>
                {/* Dialogs */}
                <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Añadir Nueva Categoría</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="name"
                            label="Nombre de la Categoría"
                            fullWidth
                            value={categoryForm.name}
                            onChange={handleCategoryChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            name="type"
                            label="Tipo"
                            select
                            fullWidth
                            value={categoryForm.type}
                            onChange={handleCategoryChange}
                        >
                            <MenuItem value="income">Ingreso</MenuItem>
                            <MenuItem value="expense">Gasto</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCategoryDialog(false)}>Cancelar</Button>
                        <BlueButton onClick={handleCategorySubmit}>Añadir</BlueButton>
                    </DialogActions>
                </Dialog>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Nueva Transacción</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="amount"
                            label="Monto"
                            type="number"
                            fullWidth
                            value={formData.amount}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Descripción"
                            fullWidth
                            value={formData.description}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            name="date"
                            label="Fecha"
                            type="date"
                            fullWidth
                            value={formData.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            name="category_id"
                            label="Categoría"
                            select
                            fullWidth
                            value={formData.category_id}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        >
                            {categories && categories.length > 0 ? (
                                categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name} ({category.type === 'income' ? 'Ingreso' : 'Gasto'})
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No hay categorías disponibles</MenuItem>
                            )}
                        </TextField>
                        <TextField
                            margin="dense"
                            name="type"
                            label="Tipo"
                            select
                            fullWidth
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <MenuItem value="income">Ingreso</MenuItem>
                            <MenuItem value="expense">Gasto</MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                        <BlueButton onClick={handleSubmit}>Añadir</BlueButton>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Dashboard; 