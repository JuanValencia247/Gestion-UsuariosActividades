// App.jsx completo con lógica de historial semanal y botón para ver resumen
import { useState, useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";
import { ActivityForm } from "./components/ActivityForm";
import { ActivityList } from "./components/ActivityList";
import { WeeklyHistory } from "./components/WeeklyHistory";

function App() {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("usuarios");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem("usuarios", JSON.stringify(newUsers));
  };

  const getWeekRange = () => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
    return {
      inicio: lunes.toISOString().split("T")[0],
      fin: hoy.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    if (selectedUser) {
      const actualizado = users.find((u) => u.id === selectedUser.id);
      if (actualizado) setSelectedUser(actualizado);
    }
  }, [users]);

  const addUser = (user) => {
    const updated = [
      ...users,
      { ...user, actividades: [], historialSemanas: [] },
    ];
    saveUsers(updated);
  };

  const addActivity = (userId, actividad) => {
    const updatedUsers = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            actividades: [...u.actividades, { ...actividad, archivada: false }],
          }
        : u
    );
    saveUsers(updatedUsers);
    setSelectedUser(updatedUsers.find((u) => u.id === userId));
  };

  const updateActivity = (activityId, updatedData) => {
    const updatedUsers = users.map((u) => {
      if (u.id !== selectedUser.id) return u;
      const updatedActivities = u.actividades.map((a) =>
        a.id === activityId ? { ...a, ...updatedData } : a
      );
      return { ...u, actividades: updatedActivities };
    });
    saveUsers(updatedUsers);
    setSelectedUser(updatedUsers.find((u) => u.id === selectedUser.id));
  };

  const deleteActivity = (activityId) => {
    const updatedUsers = users.map((u) => {
      if (u.id !== selectedUser.id) return u;
      const filteredActivities = u.actividades.filter(
        (a) => a.id !== activityId
      );
      return { ...u, actividades: filteredActivities };
    });
    saveUsers(updatedUsers);
    setSelectedUser(updatedUsers.find((u) => u.id === selectedUser.id));
  };

  const updateUser = (userId, updatedData) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, ...updatedData } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("usuarios", JSON.stringify(updatedUsers));
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, ...updatedData });
    }
  };

  const deleteUser = (userId) => {
    const filteredUsers = users.filter((user) => user.id !== userId);
    setUsers(filteredUsers);
    localStorage.setItem("usuarios", JSON.stringify(filteredUsers));
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
  };

  const handleCerrarSemana = () => {
    const { inicio, fin } = getWeekRange();

    const updatedUsers = users.map((user) => {
      const actividades = user.actividades.filter((a) => !a.archivada);

      const dias = [];
      const porcentajesPorDia = {};

      actividades.forEach((a) => {
        if (!porcentajesPorDia[a.fecha]) {
          porcentajesPorDia[a.fecha] = 0;
        }
        porcentajesPorDia[a.fecha] += a.porcentaje;
      });

      Object.keys(porcentajesPorDia).forEach((fecha) => {
        dias.push({
          fecha,
          porcentaje: porcentajesPorDia[fecha],
        });
      });

      const total = dias.reduce((acc, d) => acc + d.porcentaje, 0);
      const totalReal = parseFloat((total / dias.length).toFixed(2));

      return {
        ...user,
        historialSemanas: [
          ...(user.historialSemanas || []).filter(
            (s) => s.semana !== `${inicio} al ${fin}`
          ),
          {
            semana: `${inicio} al ${fin}`,
            dias,
            totalReal,
          },
        ],
        actividades: user.actividades.map((a) => ({ ...a, archivada: true })),
      };
    });

    setUsers(updatedUsers);
    localStorage.setItem("usuarios", JSON.stringify(updatedUsers));
    setSelectedUser(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: 5,
        bgcolor: "#121212",
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom color="white" align="center">
          Gestión de Usuarios y Actividades
        </Typography>

        <Box sx={{ display: "flex", gap: 4, mt: 4 }}>
          <Box sx={{ flex: 1 }}>
            <UserForm onAdd={addUser} />
            <UserList
              users={users}
              onAddActivity={addActivity}
              onSelectUser={(u) => setSelectedUser(u)}
              onUpdateUser={updateUser}
              onDeleteUser={(id) => {
                if (
                  window.confirm(
                    "¿Estás seguro que deseas eliminar este usuario?"
                  )
                ) {
                  deleteUser(id);
                }
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 2,
              backgroundColor: "#1e1e1e",
              borderRadius: 2,
              padding: 3,
              color: "white",
              display: "flex",
              flexDirection: "column",
              maxHeight: "auto",
              minHeight: "500px",
              overflowY: "auto",
            }}
          >
            {selectedUser ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Actividades de {selectedUser.nombre}
                </Typography>
                <ActivityForm
                  onAdd={(act) => addActivity(selectedUser.id, act)}
                />
                <Box
                  sx={{
                    overflowY: "auto",
                    mt: 2,
                    flexGrow: 1,
                    pr: 1,
                    maxHeight: 300,
                  }}
                >
                  <ActivityList
                    actividades={selectedUser.actividades.filter(
                      (a) => !a.archivada
                    )}
                    onUpdate={updateActivity}
                    onDelete={(id) => {
                      if (window.confirm("¿Deseas eliminar esta actividad?")) {
                        deleteActivity(id);
                      }
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Estás seguro que deseas cerrar la semana laboral?"
                      )
                    ) {
                      handleCerrarSemana();
                    }
                  }}
                >
                  Cerrar semana laboral
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  sx={{ mt: 1 }}
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? "Ocultar Historial" : "Ver Historial Semanal"}
                </Button>
                {showHistory && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    {(selectedUser.historialSemanas || []).map(
                      (semana, index) => (
                        <Box
                          key={index}
                          sx={{
                            bgcolor: "#2a2a2a",
                            borderRadius: 2,
                            padding: 2,
                            color: "white",
                            width: "30%",
                          }}
                        >
                          <Typography variant="subtitle1">
                            <Typography variant="subtitle1" align="center">
                              Semana
                            </Typography>
                            <Typography variant="body2" align="center">
                              {semana.semana}
                            </Typography>
                          </Typography>
                          <Typography variant="body2" color="lightgreen">
                            Rendimiento: {semana.totalReal}%
                          </Typography>
                          <Box
                            component="ul"
                            sx={{ pl: 0, listStyle: "none", mt: 1 }}
                          >
                            {semana.dias.map((dia, i) => (
                              <Box component="li" key={i}>
                                {dia.fecha} — {dia.porcentaje}% trabajado
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )
                    )}
                  </Box>
                )}
              </>
            ) : (
              <Typography variant="body1" align="center">
                Selecciona un usuario para ver sus actividades
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
