import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const defaultTheme = createTheme();

const ConfirmDialog = (prop) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={prop.open}
        onClose={prop.close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿{prop.title}?</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            {prop.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={prop.close}>Cancelar</Button>
          <Button
            color={prop.actionButtonColor ? prop.actionButtonColor : "inherit"}
            onClick={prop.func}
            autoFocus
          >
            {prop.actionButton}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ConfirmDialog;
