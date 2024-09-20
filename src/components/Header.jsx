import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import WalletIcon from '@mui/icons-material/Wallet';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

export default function Header() {
  const theme = useTheme(); 
  return (    
    <AppBar position="static" sx={{ mt: 2, height: 100, backgroundColor: theme.palette.background.default, boxShadow: 'none' }}>
      <Toolbar variant="dense" sx={{ paddingLeft: '20px', backgroundColor: theme.palette.background.default, paddingRight: '20px', height: '100%', alignItems: 'center', display: 'flex',  }}>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ fontSize: 40 }}>
          {console.log(theme.palette.background.default)}
          <WalletIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', flexGrow: 0, letterSpacing: '1px', }}>
          XBlock Wallet
        </Typography>
        <Typography 
            variant="h6" 
            sx={{ 
              marginLeft: 1, 
              color: theme.palette.common.white, 
              padding: '0.5px 6px', 
              borderRadius: '4px',
              fontWeight: 'normal',
            }}
          >
           <Chip label="beta" variant="outlined" sx={{fontSize: '16px',}}/>
          </Typography>
      </Toolbar>
    </AppBar>
  );
}
