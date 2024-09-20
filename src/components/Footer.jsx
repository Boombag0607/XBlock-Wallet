import { Box, Typography, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        bottom: 0,
        color: 'white',
        py: 4,
        px: 2,
        width: '100%',
        maxWidth: 'lg'
      }}
    >
        <Divider />
        <Typography variant="body1" sx={{my:1, py:1}}>
            Developed & Designed by <strong>Ananya</strong>.
        </Typography>
    </Box>
  );
};

export default Footer;

