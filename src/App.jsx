import { useState, useEffect } from "react";
import { UserForm } from "./components/UserForm";
import { UserList } from "./components/UserList";
import { ActivityForm } from "./components/ActivityForm";
import { ActivityList } from "./components/ActivityList";
import { WeeklyHistory } from "./components/WeeklyHistory";
import { Container, Typography, Box } from "@mui/material";

function App() {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("usuarios");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem("usuarios", JSON.stringify(newUsers));
  };

  const getWeekRange = () => {
    const hoy = new Date();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
    const viernes = new Date(lunes);
    viernes.setDate(lunes.getDate() + 4);
    return {
      inicio: lunes.toISOString().split("T")[0],
      fin: viernes.toISOString().split("T")[0],
    };
  };

  const checkAndCloseWeek = () => {
    const today = new Date();
    const isFriday = today.getDay() === 5; // 5 = viernes

    const updatedUsers = users.map((user) => {
      const actividades = user.actividades || [];
      const dias = [];
      const porcentajesPorDia = {};
      const actividadesPorDia = {};

      actividades.forEach((a) => {
        if (!porcentajesPorDia[a.fecha]) {
          porcentajesPorDia[a.fecha] = 0;
          actividadesPorDia[a.fecha] = [];
        }
        porcentajesPorDia[a.fecha] += a.porcentaje;
        actividadesPorDia[a.fecha].push(a.texto);
      });

      Object.keys(porcentajesPorDia).forEach((fecha) => {
        dias.push({
          fecha,
          porcentaje: porcentajesPorDia[fecha],
          actividades: actividadesPorDia[fecha],
        });
      });

      const total = dias.reduce((acc, d) => acc + d.porcentaje, 0);
      const totalReal = parseFloat(((total / 500) * 100).toFixed(2));

      const semana = getWeekRange();

      if (isFriday && actividades.length > 0) {
        return {
          ...user,
          historialSemanas: [...(user.historialSemanas || []), {
            semana: `${semana.inicio} al ${semana.fin}`,
            dias,
            totalReal,
          }],
          actividades: [],
        };
      }

      return user;
    });

    saveUsers(updatedUsers);
  };

  useEffect(() => {
    checkAndCloseWeek();
  }, []);

  const addUser = (user) => {
    const updated = [...users, { ...user, actividades: [], historialSemanas: [] }];
    saveUsers(updated);
  };

  const addActivity = (userId, actividad) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, actividades: [...u.actividades, actividad] } : u
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
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, ...updatedData } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("usuarios", JSON.stringify(updatedUsers));
    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, ...updatedData });
    }
  };

  const deleteUser = (userId) => {
    const filteredUsers = users.filter(user => user.id !== userId);
    setUsers(filteredUsers);
    localStorage.setItem("usuarios", JSON.stringify(filteredUsers));
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
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
      <Container maxWidth="lg">
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
  onDeleteUser={deleteUser}
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
              height: "500px",
            }}
          >
            {selectedUser ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Actividades de {selectedUser.nombre}
                </Typography>
                <ActivityForm onAdd={(act) => addActivity(selectedUser.id, act)} />
                <Box
                  sx={{
                    overflowY: "auto",
                    mt: 2,
                    flexGrow: 1,
                    pr: 1,
                  }}
                >
                  <ActivityList
                    actividades={selectedUser.actividades}
                    onUpdate={updateActivity}
                    onDelete={deleteActivity}
                  />
                </Box>
                <WeeklyHistory historial={selectedUser.historialSemanas || []} />
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
