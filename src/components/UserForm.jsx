import { useState } from "react";
import { TextField, Button, Box } from '@mui/material';

export const UserForm = ({onAdd }) => {
  const [nombre, setNombre] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onAdd({ id: Date.now(), nombre, actividades: [] });
    setNombre('');
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField
        label="Nombre del usuario"
        variant="outlined"
        fullWidth
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        InputProps={{
          style: { color: 'white' },
        }}
        InputLabelProps={{
          style: { color: 'white' },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white' },
            '&:hover fieldset': { borderColor: 'white' },
            '&.Mui-focused fieldset': { borderColor: 'white' },
          },
        }}
      />
      <Button type="submit" variant="contained" color="primary">
        Agregar
      </Button>
    </Box>
  );
}