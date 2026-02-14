import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Grid, TextField, InputAdornment, Box } from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const NumericKeyboard = ({ onValueChange, currentValue }) => {
  const [rawValue, setRawValue] = useState(currentValue || "");
  const buttons = useMemo(
    () => ["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "000"],
    []
  );

  useEffect(() => {
    setRawValue(currentValue || "");
  }, [currentValue]);

  const setAndNotifyValue = useCallback(
    (nextValue) => {
      setRawValue(nextValue);
      onValueChange(nextValue);
    },
    [onValueChange]
  );

  const handleAppend = useCallback(
    (value) => {
      const nextValue = `${rawValue}${value}`;
      if (nextValue.length <= 10 && /^[0-9]*$/.test(nextValue)) {
        setAndNotifyValue(nextValue);
      }
    },
    [rawValue, setAndNotifyValue]
  );

  const handleDelete = useCallback(() => {
    setAndNotifyValue(rawValue.slice(0, -1));
  }, [rawValue, setAndNotifyValue]);

  const handleClear = useCallback(() => {
    setAndNotifyValue("");
  }, [setAndNotifyValue]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= "0" && event.key <= "9") {
        const nextValue = `${rawValue}${event.key}`;
        if (nextValue.length <= 10) {
          setAndNotifyValue(nextValue);
        }
      } else if (event.key === "Backspace") {
        setAndNotifyValue(rawValue.slice(0, -1));
      } else if (event.key === "Escape") {
        setAndNotifyValue("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rawValue, setAndNotifyValue]);

  const formatNumber = (value) => {
    if (!value) {
      return "";
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Box
      sx={{
        padding: { xs: 1, sm: 1.5 },
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: { xs: "100%", sm: 360, lg: 380 },
      }}
    >
      <TextField
        variant="outlined"
        fullWidth
        value={formatNumber(rawValue)}
        InputProps={{
          readOnly: true,
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          style: { textAlign: "right" },
        }}
        inputProps={{
          maxLength: 10,
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        sx={{
          marginBottom: 1,
          "& .MuiInputBase-input": {
            fontSize: { xs: "1.4rem", sm: "1.6rem", lg: "1.8rem" },
            fontWeight: 700,
          },
        }}
      />
      <Grid container spacing={1} sx={{ justifyContent: "center" }}>
        {buttons.map((button) => (
          <Grid item xs={4} key={button}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                minHeight: { xs: 50, sm: 58, lg: 64 },
                backgroundColor: "black",
                color: "white",
                fontSize: { xs: "1.15rem", sm: "1.3rem", lg: "1.45rem" },
                "&:focus": {
                  backgroundColor: "black",
                },
                "&:active": {
                  backgroundColor: "black",
                },
              }}
              onClick={() => handleAppend(button)}
            >
              {button}
            </Button>
          </Grid>
        ))}
        <Grid item xs={4}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              minHeight: { xs: 50, sm: 58, lg: 64 },
              backgroundColor: "gray",
              color: "white",
              fontSize: { xs: "1.1rem", sm: "1.2rem" },
              "&:focus": {
                backgroundColor: "gray",
              },
              "&:active": {
                backgroundColor: "gray",
              },
            }}
            onClick={handleClear}
          >
            <DeleteForeverIcon />
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              minHeight: { xs: 50, sm: 58, lg: 64 },
              backgroundColor: "red",
              color: "white",
              fontSize: { xs: "1.05rem", sm: "1.2rem", lg: "1.3rem" },
              "&:focus": {
                backgroundColor: "red",
              },
              "&:active": {
                backgroundColor: "red",
              },
            }}
            onClick={handleDelete}
            startIcon={<BackspaceIcon />}
          >
            Borrar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NumericKeyboard;
