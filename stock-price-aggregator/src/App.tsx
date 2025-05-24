import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Box,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';

const API_KEY = 'd0om95pr01qsib2di190d0om95pr01qsib2di19g';

const STOCK_SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA',
  'META', 'NFLX', 'NVDA', 'BABA', 'INTC',
  'ADBE', 'ORCL', 'CSCO', 'IBM', 'PYPL',
];

const App: React.FC = () => {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(''); // <-- New state for last updated time
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const combinedOptions = [...history, ...STOCK_SYMBOLS.filter(sym => !history.includes(sym))];

  const fetchPrice = async (sym: string) => {
    setLoading(true);
    setError('');
    setPrice(null);
    setLastUpdated(''); // reset last updated on new fetch
    try {
      const response = await axios.get(
        'https://finnhub.io/api/v1/quote',
        { params: { symbol: sym, token: API_KEY } }
      );
      const data = response.data as { c: number; t?: number }; // `t` is UNIX timestamp if available
      if (data.c === 0) {
        setError('Invalid symbol or no data found.');
        setPrice(null);
        setLastUpdated('');
      } else {
        setPrice(data.c);
        // Update last updated with readable time from API timestamp if available, else current time
        const updatedTime = data.t
          ? new Date(data.t * 1000).toLocaleString()
          : new Date().toLocaleString();
        setLastUpdated(updatedTime);

        if (!history.includes(sym.toUpperCase())) {
          setHistory(prev => [sym.toUpperCase(), ...prev].slice(0, 5));
        }
      }
    } catch {
      setError('Error fetching price. Please try again.');
      setLastUpdated('');
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (symbol.trim()) {
      fetchPrice(symbol.trim().toUpperCase());
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d1b2a, #1b263b, #415a77, #1b263b)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={12}
          sx={{
            backdropFilter: 'blur(15px)',
            backgroundColor: 'rgba(10, 25, 47, 0.85)',
            borderRadius: 3,
            boxShadow: '0 0 30px #1e40af',
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 900,
              letterSpacing: '0.25em',
              fontFamily: "'Montserrat', sans-serif",
              textTransform: 'uppercase',
              color: '#90caf9',
              textShadow: '0 0 8px #64b5f6',
              userSelect: 'none',
              mb: 4,
            }}
          >
            STOCK PRICE AGGREGATOR
          </Typography>

          <Autocomplete
            freeSolo={false}
            options={combinedOptions}
            inputValue={symbol}
            onInputChange={(e, newVal) => {
              setSymbol(newVal.toUpperCase());
              setPrice(null);
              setError('');
              setLastUpdated(''); // reset last updated on input change
            }}
            onChange={(e, newVal) => {
              if (newVal) {
                setSymbol(newVal);
                setPrice(null);
                setError('');
                setLastUpdated('');
              }
            }}
            sx={{
              width: '100%',
              mb: 3,
              '& .MuiInputBase-root': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                color: '#bbdefb',
                fontWeight: 600,
                letterSpacing: '0.05em',
                fontSize: '1.1rem',
                transition: 'background-color 0.3s',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255, 255, 255, 0.22)',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#90caf9',
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select or Type Stock Symbol"
                variant="outlined"
                InputLabelProps={{
                  style: { color: '#bbdefb', fontWeight: 'bold' },
                }}
              />
            )}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !symbol.trim()}
            sx={{
              background:
                'linear-gradient(90deg, #42a5f5, #1e88e5, #1976d2)',
              px: 6,
              py: 1.7,
              borderRadius: 3,
              fontWeight: 'bold',
              fontSize: '1.15rem',
              boxShadow:
                '0 6px 20px rgba(66, 165, 245, 0.8)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background:
                  'linear-gradient(90deg, #1e88e5, #1565c0, #0d47a1)',
                boxShadow:
                  '0 8px 30px rgba(25, 118, 210, 0.9)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Get Price'}
          </Button>

          <Box
            sx={{
              mt: 5,
              width: '100%',
              minHeight: 110,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.6rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#bbdefb',
              userSelect: 'text',
              boxShadow: 'inset 0 0 15px rgba(255,255,255,0.12)',
              textAlign: 'center',
              padding: 3,
              minWidth: '280px',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {error && <Typography color="#ff5252">{error}</Typography>}
            {!error && price !== null && !loading && (
              <>
                <Typography sx={{ color: '#90caf9' }}>
                  Current Price of <strong>{symbol.toUpperCase()}</strong> is{' '}
                  <span style={{ color: '#e1f5fe' }}>${price.toFixed(2)}</span>
                </Typography>
                {lastUpdated && (
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      color: '#90caf9',
                      mt: 1,
                      fontWeight: 400,
                      fontStyle: 'italic',
                    }}
                  >
                    Last updated at: {lastUpdated}
                  </Typography>
                )}
              </>
            )}
            {!error && price === null && !loading && (
              <Typography sx={{ opacity: 0.7, fontStyle: 'italic' }}>
                Select a stock and click "Get Price"
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default App;
