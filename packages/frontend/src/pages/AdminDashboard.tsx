import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/apiService';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminData = await apiService.getAdmins();
        const notificationData = await apiService.getNotifications();
        const userData = await apiService.getUsers();
        setAdmins(adminData);
        setNotifications(notificationData);
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Cargar datos del localStorage para estadísticas
  const allUsers = JSON.parse(localStorage.getItem('churchUsers') || '[]');
  const allReports = JSON.parse(localStorage.getItem('churchReports') || '[]');

  // Calcular estadísticas
  const stats = {
    totalUsers: allUsers.length,
    totalReports: allReports.length,
    totalTithes: allReports.reduce((sum: number, report: any) => sum + (report.diezmo || 0), 0),
    totalOfferings: allReports.reduce((sum: number, report: any) => sum + (report.ofrenda || 0), 0),
    activeMembers: allUsers.filter((u: any) => u.miembroActivo).length,
    reportsThisMonth: allReports.filter((r: any) => {
      const reportDate = new Date(r.fecha);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length
  };

  // Usuarios más activos
  const userActivity = allUsers.map((user: any) => {
    const userReports = allReports.filter((r: any) => r.userId === user.id);
    return {
      ...user,
      reportCount: userReports.length,
      lastReport: userReports.length > 0 ? userReports[userReports.length - 1].fecha : null
    };
  }).sort((a, b) => b.reportCount - a.reportCount);

  // Usuarios sin reportar en más de 2 meses
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const inactiveUsers = userActivity.filter(user => {
    if (!user.lastReport) return true;
    return new Date(user.lastReport) < twoMonthsAgo;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-300">
          Bienvenido al sistema de gestión de Cristo Salva, {user?.nombre}
        </p>
        <Badge variant="secondary" className="mt-3">
          Administrador
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMembers} miembros activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes Totales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              {stats.reportsThisMonth} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Diezmos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalTithes.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ofrendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalOfferings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Mensual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((stats.totalTithes + stats.totalOfferings) / 12).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{inactiveUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Sin reportar +2 meses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Active Users */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Más Activos</CardTitle>
          <CardDescription>
            Top 5 usuarios con más reportes realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userActivity.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <p className="font-medium">{user.nombre} {user.apellido}</p>
                    <p className="text-sm text-muted-foreground">{user.cargo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{user.reportCount} reportes</p>
                  <p className="text-sm text-muted-foreground">
                    {user.lastReport ? new Date(user.lastReport).toLocaleDateString() : 'Sin reportes'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inactive Users Alert */}
      {inactiveUsers.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Usuarios Inactivos - Requieren Atención
            </CardTitle>
            <CardDescription>
              Usuarios que no han reportado en más de 2 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inactiveUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-destructive/5 rounded">
                  <span className="font-medium">{user.nombre} {user.apellido}</span>
                  <span className="text-sm text-muted-foreground">
                    {user.lastReport ? 
                      `Último reporte: ${new Date(user.lastReport).toLocaleDateString()}` : 
                      'Sin reportes'
                    }
                  </span>
                </div>
              ))}
              {inactiveUsers.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  Y {inactiveUsers.length - 5} usuarios más...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimos reportes enviados por los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allReports
              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((report: any) => {
                const reportUser = allUsers.find((u: any) => u.id === report.userId);
                return (
                  <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{reportUser?.nombre} {reportUser?.apellido}</p>
                      <p className="text-sm text-muted-foreground">{report.tipo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${((report.diezmo || 0) + (report.ofrenda || 0) + (report.ofrendaEspecial || 0)).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Administradores */}
      <Card>
        <CardHeader>
          <CardTitle>Administradores</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {admins.map((admin) => (
              <li key={admin.id} className="flex justify-between p-2 border-b">
                <span className="font-medium">{admin.name}</span>
                <span className="text-sm text-muted-foreground">{admin.email}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li key={notification.id} className="flex justify-between p-2 border-b">
                <span className="font-medium">{notification.message}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(notification.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="flex justify-between p-2 border-b">
                <span className="font-medium">{user.nombre}</span>
                <span className="text-sm text-muted-foreground">{user.cargo}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
