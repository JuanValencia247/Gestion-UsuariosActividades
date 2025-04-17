import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

export const ActivityForm = ({ onAdd }) => {
  const [texto, setTexto] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    const actividad = {
      id: Date.now(),
      texto,
      porcentaje: parseFloat(porcentaje),
      fecha: new Date().toLocaleDateString("es-EC"),
    };
    onAdd(actividad);
    setTexto("");
    setPorcentaje("");
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, my: 2 }}
    >
      <TextField
        label="¿Qué hizo hoy?"
        fullWidth
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "white" } }}
        sx={{
          width: "70%",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" },
            "&:hover fieldset": { borderColor: "white" },
            "&.Mui-focused fieldset": { borderColor: "white" },
          },
        }}
      />
      <TextField
        label="% trabajado"
        type="number"
        fullWidth
        value={porcentaje}
        onChange={(e) => setPorcentaje(e.target.value)}
        inputProps={{ style: { color: "white" }, min: 0, max: 100 }}
        InputLabelProps={{ style: { color: "white" } }}
        sx={{
          width: "30%",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" },
            "&:hover fieldset": { borderColor: "white" },
            "&.Mui-focused fieldset": { borderColor: "white" },
          },
        }}
      />
      <Button type="submit" variant="contained" color="secondary">
        Registrar
      </Button>
    </Box>
  );
};
