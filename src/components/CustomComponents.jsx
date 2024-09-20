import { useState } from "react";
import propTypes from "prop-types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Snackbar,
  Alert,
  Grid2 as Grid,
} from "@mui/material";

export const CardComponent = ({ title, content }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const copyToClipboard = (copyContent) => {
    navigator.clipboard
      .writeText(copyContent)
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <Card sx={{ height: "75px", background: "inherit", boxShadow: "none" }}>
      <CardHeader title={title} sx={{ pb: 0 }} titleTypographyProps={{ sx: { fontSize: '1.2rem', fontWeight: 600 } }} />
      <CardContent onClick={copyToClipboard} sx={{ pt: 0, cursor: "pointer" }}>
        <Typography variant="body1" sx={{ fontFamily: "monospace", fontSize: 14 }}>
          {content}
        </Typography>
      </CardContent>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export const PrivateKeyCard = ({ privateKey }) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const togglePrivateKey = () => {
    setShowPrivateKey((prev) => !prev);
  };

  const copyToClipboard = (copyContent) => {
    navigator.clipboard
      .writeText(copyContent)
      .then(() => {
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Card
      sx={{ minHeight: "75px", background: "inherit", boxShadow: "none", mb: -1}}
    >
      <CardHeader title={`Private Key`} sx={{ pb: 0  }} titleTypographyProps={{ sx: { fontSize: '1.2rem', fontWeight: 600 } }}/>
      <CardContent sx={{ py: 0, cursor: "pointer" }}>
        <Grid container sx={{ height: "100%", width: "100%" }}>
          <Grid onClick={copyToClipboard} size={{ xs: 12, lg: 11 }}>
            <Typography variant="body1" sx={{ fontFamily: "monospace", fontSize: 14 }}>
              {showPrivateKey ? privateKey : "*".repeat(privateKey.length)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 1 }}>
            <Button
              onClick={togglePrivateKey}
              sx={{ p: 0, color: "white", fontWeight: "bold" }}
            >
              {showPrivateKey ? "Hide" : "Show"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Private key copied to clipboard!
        </Alert>
      </Snackbar>
    </Card>
  );
};

CardComponent.propTypes = {
  title: propTypes.string.isRequired,
  content: propTypes.string.isRequired,
};

PrivateKeyCard.propTypes = {
  privateKey: propTypes.string.isRequired,
};
