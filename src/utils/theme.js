import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212', // The default background color in dark mode
      }
    },
    typography: {
      fontFamily: 'Kanit, sans-serif',
    },
    components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none', // Prevents text from being capitalized
            },
          },
        },
      },
  });

export default darkTheme;
  