import { Typography, Box, Divider } from "@mui/material";

export const WeeklyHistory = ({ historial }) => {
  if (!historial.length) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Historial Semanal</Typography>
      {historial.map((semana, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            Semana: {semana.semana} — Rendimiento: {semana.totalReal}%
          </Typography>
          {semana.dias.map((dia, i) => (
            <Box key={i} sx={{ ml: 2 }}>
              <Typography variant="body2">
                {dia.fecha} — {dia.porcentaje}% trabajado
              </Typography>
              <ul style={{ margin: 0 }}>
                {dia.actividades.map((act, idx) => (
                  <li key={idx} style={{ fontSize: '0.9rem' }}>{act}</li>
                ))}
              </ul>
            </Box>
          ))}
          <Divider sx={{ mt: 1 }} />
        </Box>
      ))}
    </Box>
  );
};