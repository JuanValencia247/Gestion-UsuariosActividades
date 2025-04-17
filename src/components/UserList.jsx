import { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Edit, Delete, Save } from "@mui/icons-material";

export const UserList = ({ users, onSelectUser, onAddActivity, onUpdateUser, onDeleteUser }) => {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  const handleEdit = (user) => {
    setEditingId(user.id);
    setNewName(user.nombre);
  };

  const handleSave = (userId) => {
    if (newName.trim()) {
      onUpdateUser(userId, { nombre: newName });
    }
    setEditingId(null);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom color="white">
        Usuarios
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {editingId === user.id ? (
              <TextField
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                variant="standard"
                sx={{ color: "white", input: { color: "white" } }}
              />
            ) : (
              <ListItemText
                primary={user.nombre}
                primaryTypographyProps={{ color: "white" }}
              />
            )}

            <Box>
              <Button
                size="small"
                variant="outlined"
                sx={{ mr: 1, color: "white", borderColor: "white" }}
                onClick={() => onSelectUser(user)}
              >
                Ver
              </Button>
              {editingId === user.id ? (
                <IconButton
                  color="success"
                  onClick={() => handleSave(user.id)}
                >
                  <Save />
                </IconButton>
              ) : (
                <IconButton color="primary" onClick={() => handleEdit(user)}>
                  <Edit />
                </IconButton>
              )}
              <IconButton color="error" onClick={() => onDeleteUser(user.id)}>
                <Delete />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};