import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  FileText, 
  Calculator, 
  History, 
  Bell,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { apiService } from '@/lib/apiService';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Datos simulados para el dashboard
  const stats = {
    totalReportes: 12,
    totalDiezmos: 2450.00,
    ultimoReporte: '2024-06-10',
    promedioDiezmo: 204.17
  };

  const recentReports = [
    { id: 1, tipo: 'Diezmo', monto: 150.00, fecha: '2024-06-10', moneda: 'USD' },
    { id: 2, tipo: 'Ofrenda', monto: 75.00, fecha: '2024-06-08', moneda: 'USD' },
    { id: 3, tipo: 'Diezmo y ofrenda', monto: 225.00, fecha: '2024-06-03', moneda: 'USD' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await apiService.getUsers();
        const notificationData = await apiService.getNotifications();
        setUsers(userData);
        setNotifications(notificationData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-church-600 to-church-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          ¡Bienvenido, {user?.nombre}!
        </h1>
        <p className="text-church-100">
          Aquí puedes gestionar tus diezmos y ofrendas de manera fácil y segura.
        </p>
        <Badge variant="secondary" className="mt-3">
          {user?.cargo}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reportes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReportes}</div>
            <p className="text-xs text-muted-foreground">
              Este año
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Diezmos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalDiezmos}</div>
            <p className="text-xs text-muted-foreground">
              Acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Reporte</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ultimoReporte}</div>
            <p className="text-xs text-muted-foreground">
              Hace 2 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.promedioDiezmo}</div>
            <p className="text-xs text-muted-foreground">
              Por mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nuevo Reporte
            </CardTitle>
            <CardDescription>
              Reporta tus diezmos y ofrendas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/report">
              <Button className="w-full">Crear Reporte</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculadora
            </CardTitle>
            <CardDescription>
              Calcula el diezmo de tus ingresos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/calculator">
              <Button variant="outline" className="w-full">Abrir Calculadora</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial
            </CardTitle>
            <CardDescription>
              Ve tus reportes anteriores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/history">
              <Button variant="outline" className="w-full">Ver Historial</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Recientes</CardTitle>
          <CardDescription>
            Tus últimos 3 reportes realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{report.tipo}</p>
                  <p className="text-sm text-muted-foreground">{report.fecha}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${report.monto}</p>
                  <p className="text-sm text-muted-foreground">{report.moneda}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Anuncios
          </CardTitle>
          <CardDescription>
            Últimas noticias y actualizaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="border-l-4 border-primary pl-4 py-2">
                <h4 className="font-medium">{notification.message}</h4>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(notification.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
