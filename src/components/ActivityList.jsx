import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Typography,
  Box
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";
import { useState } from "react";

export const ActivityList = ({ actividades, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedPorcentaje, setEditedPorcentaje] = useState("");

  const startEdit = (actividad) => {
    setEditingId(actividad.id);
    setEditedText(actividad.texto);
    setEditedPorcentaje(actividad.porcentaje || "");
  };

  const saveEdit = (id) => {
    if (editedText.trim()) {
      onUpdate(id, {
        texto: editedText,
        porcentaje: parseFloat(editedPorcentaje),
      });
    }
    setEditingId(null);
  };

  return (
    <List>
      {actividades.map((a) => (
        <ListItem
          key={a.id}
          alignItems="flex-start"
          secondaryAction={
            <>
              {editingId === a.id ? (
                <IconButton
                  edge="end"
                  color="success"
                  onClick={() => saveEdit(a.id)}
                >
                  <Save />
                </IconButton>
              ) : (
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => startEdit(a)}
                >
                  <Edit />
                </IconButton>
              )}
              <IconButton
                edge="end"
                color="error"
                onClick={() => onDelete(a.id)}
              >
                <Delete />
              </IconButton>
            </>
          }
        >
          {editingId === a.id ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 1,
                pr: 6,
          
              }}
            >
              <TextField
                label="Tarea"
                fullWidth
                multiline
                variant="filled"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                sx={{
                  input: { color: "white" },
                  textarea: { color: "white" },
                  label: { color: "#ccc" },
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#8a0c0c",
                    borderRadius: 1,
                  },
                }}
              />
  
              <TextField
                label="% trabajado"
                type="number"
                variant="filled"
                inputProps={{ min: 0, max: 100 }}
                value={editedPorcentaje}
                onChange={(e) => setEditedPorcentaje(e.target.value)}
                sx={{
                  input: { color: "white" },
                  label: { color: "#ccc" },
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#8a0c0c",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          ) : (
            <ListItemText
              sx={{ pr: 6 }} // 👉 espacio para separar íconos
              primary={
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  <Typography sx={{ color: "white", wordBreak: "break-word" }}>
                    {a.texto}
                  </Typography>
  
                  {a.porcentaje !== undefined && !isNaN(a.porcentaje) && (
                    <Typography
                      variant="body2"
                      sx={{ color: "lightgreen", fontWeight: 500 }}
                    >
                      {a.porcentaje}% trabajado
                    </Typography>
                  )}
                </Box>
              }
              secondary={
                <Typography variant="caption" sx={{ color: "gray", mt: 0.5 }}>
                  {a.fecha}
                </Typography>
              }
            />
          )}
        </ListItem>
      ))}
    </List>
  );
}