import { useState, useEffect } from 'react'
import { generateMnemonic } from "bip39";
import './App.css'
import SolanaWallet from './components/Solana';
import EthWallet from './components/Ethereum';
import blockchains from './utils/blockchains';
import Header from './components/Header';
import {CssBaseline, Container, Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Grid2 as Grid, Typography, Snackbar, Alert, Divider } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import darkTheme from './utils/theme';
import { ThemeProvider } from '@emotion/react';
import Footer from './components/Footer';

function App() {
  const [activeBlockchain, setActiveBlockchain] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [mnCreated, setMnCreated] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic).then(() => {
      setOpenSnackbar(true);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const createSeed = async () => {
      const generatedMnemonic = generateMnemonic();
      setMnemonic(generatedMnemonic);
      setMnCreated(true);
    }
    createSeed();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" disableGutters>
      <Header />
      <Divider />
      {activeBlockchain.length ? (
        <Box sx={{mx: 2, my: 3, minHeight: "60vh"}}>
          {mnCreated ? (
            <Accordion  >
                <AccordionSummary sx={{ mx: 2 }} expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
                  <Typography sx={{ my: 2, fontSize: 20 }}>
                    Store this 12 word secret
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx= {{m : 1 }} >
                  <Grid container spacing={2}>
                  {mnemonic.split(" ").map(word => (
                    <Grid key = {word} size={{xs:6, md:4, lg:2}} >
                      <Card sx={{ backgroundColor: (theme) => theme.palette.grey[800],
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)', 
                          boxShadow: 3, 
                          backgroundColor: (theme) => theme.palette.grey[600], 
                        },
                      }}>
                        <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                          <Typography >{word}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                    </Grid>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button 
            color="primary" 
            startIcon={<ContentCopyIcon />} 
            onClick={handleCopy}
            sx={{ py: 1, px: 1, color: 'white'}}
          >
            Copy
          </Button>
          </Box>
                </AccordionDetails>
            </Accordion>
          ) : (
            <Typography>Please refresh to generate seed phrase</Typography>
          )}
          <Box sx={{mt: 4}}>
          {activeBlockchain === "Solana" ? (
              <SolanaWallet mnemonic={mnemonic} />
          ) : activeBlockchain === "Ethereum" ? (
              <EthWallet mnemonic={mnemonic} />
            
          ) : null}
          </Box>
        </Box>
      ) : (
        <Box sx={{mx: 2, my: 3, minHeight: "60vh"}}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 500, fontSize: 38 }}>Select Blockchain to Continue</Typography>
          {blockchains.map(p => (
            <Button sx={{
              my: 1,
              mr: 2,
              px: 2,
              py: 1,
              backgroundColor: 'white',
              color: 'black',
              '&:hover': {
                backgroundColor: '#f0f0f0', // Optional: change hover color
              },
              fontWeight: 900,
            }}
            key={p} onClick={() => setActiveBlockchain(p)}>
              {p}
            </Button>
          ))}
        </Box>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Automatically hides after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Bottom-right position
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
      <Footer />
      </Container>
    </ThemeProvider>
  );
}

export default App;
