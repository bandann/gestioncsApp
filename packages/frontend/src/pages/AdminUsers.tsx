import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Calendar,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { apiService } from '@/lib/apiService';

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allReports, setAllReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await apiService.getUsers();
        const reports = await apiService.getReports();
        setAllUsers(users);
        setAllReports(reports);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getUserData = (userId: number) => {
    const userReports = allReports.filter((report: any) => report.userId === userId);
    const totalDiezmos = userReports.reduce((sum: number, report: any) => sum + (report.diezmo || 0), 0);
    const totalOfrendas = userReports.reduce((sum: number, report: any) => sum + (report.ofrenda || 0), 0);
    const lastReport = userReports.length > 0 ? userReports[userReports.length - 1] : null;

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const isInactive = !lastReport || new Date(lastReport.fecha) < twoMonthsAgo;

    return {
      reports: userReports,
      totalReports: userReports.length,
      totalDiezmos,
      totalOfrendas,
      lastReport,
      isInactive,
    };
  };

  const activeUsers = allUsers.filter((user: any) => user.miembroActivo);
  const inactiveUsers = allUsers.filter((user: any) => {
    const userData = getUserData(user.id);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return !user.miembroActivo || (userData.lastReport && new Date(userData.lastReport.fecha) < twoMonthsAgo);
  });

  const getCargoColor = (cargo: string) => {
    switch (cargo.toLowerCase()) {
      case 'pastor':
        return 'bg-blue-500 text-white';
      case 'líder':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredUsers = allUsers.filter((user: any) => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cedula.includes(searchTerm) ||
    user.telefono.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Gestión de Usuarios
        </h1>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({allUsers.length})</TabsTrigger>
          <TabsTrigger value="active">Activos ({activeUsers.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactivos ({inactiveUsers.length})</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Búsqueda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar por nombre, cédula o teléfono</Label>
                  <Input
                    id="search"
                    placeholder="Ingresa tu búsqueda..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Usuarios */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Registrados ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user: any) => {
                  const userData = getUserData(user.id);
                  return (
                    <div 
                      key={user.id} 
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-lg">
                              {user.nombre} {user.apellido}
                            </span>
                            <Badge className={getCargoColor(user.cargo)}>
                              {user.cargo}
                            </Badge>
                            {user.miembroActivo ? (
                              <Badge variant="default">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Activo
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <UserX className="h-3 w-3 mr-1" />
                                Inactivo
                              </Badge>
                            )}
                            {userData.isInactive && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Sin reportar +2m
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <span>Cédula: {user.cedula}</span>
                            <span>Teléfono: {user.telefono}</span>
                            <span>Fecha Nac: {new Date(user.fechaNacimiento).toLocaleDateString()}</span>
                            <span>Registro: {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                          {user.correo && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Email: {user.correo}
                            </p>
                          )}
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Reportes:</span> 
                            <span className="font-medium ml-1">{userData.totalReports}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Total:</span> 
                            <span className="font-medium ml-1">${(userData.totalDiezmos + userData.totalOfrendas).toFixed(2)}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Último:</span> 
                            <span className="font-medium ml-1">
                              {userData.lastReport ? new Date(userData.lastReport.fecha).toLocaleDateString() : 'N/A'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Usuarios Más Activos
              </CardTitle>
              <CardDescription>
                Top 10 usuarios con más reportes realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeUsers.map((user: any, index: number) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{user.nombre} {user.apellido}</p>
                        <p className="text-sm text-muted-foreground">{user.cargo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{user.totalReports} reportes</p>
                      <p className="text-sm text-muted-foreground">
                        ${(user.totalDiezmos + user.totalOfrendas).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Usuarios Inactivos
              </CardTitle>
              <CardDescription>
                Usuarios que no han reportado en más de 2 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inactiveUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div>
                      <p className="font-medium">{user.nombre} {user.apellido}</p>
                      <p className="text-sm text-muted-foreground">{user.cargo} - {user.cedula}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-destructive">
                        {user.lastReport ? 
                          `Último: ${new Date(user.lastReport.fecha).toLocaleDateString()}` : 
                          'Sin reportes'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.telefono}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedUser ? (
            <UserDetails user={selectedUser} userData={getUserData(selectedUser.id)} />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Selecciona un usuario de la lista para ver sus detalles
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const UserDetails: React.FC<{ user: any; userData: any }> = ({ user, userData }) => {
  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre Completo</Label>
              <p className="font-medium">{user.nombre} {user.apellido}</p>
            </div>
            <div>
              <Label>Cédula</Label>
              <p className="font-medium">{user.cedula}</p>
            </div>
            <div>
              <Label>Teléfono</Label>
              <p className="font-medium">{user.telefono}</p>
            </div>
            <div>
              <Label>Fecha de Nacimiento</Label>
              <p className="font-medium">{new Date(user.fechaNacimiento).toLocaleDateString()}</p>
            </div>
            <div>
              <Label>Correo Electrónico</Label>
              <p className="font-medium">{user.correo || 'No proporcionado'}</p>
            </div>
            <div>
              <Label>Cargo</Label>
              <p className="font-medium">{user.cargo}</p>
            </div>
            <div>
              <Label>Estado</Label>
              <p className="font-medium">
                {user.miembroActivo ? 'Miembro Activo' : 'Miembro Inactivo'}
              </p>
            </div>
            <div>
              <Label>Fecha de Registro</Label>
              <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{userData.totalReports}</p>
            <p className="text-sm text-muted-foreground">Total Reportes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">D</span>
            </div>
            <p className="text-2xl font-bold text-green-600">${userData.totalDiezmos.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Diezmos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">O</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">${userData.totalOfrendas.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Ofrendas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">
              {userData.lastReport ? new Date(userData.lastReport.fecha).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">Último Reporte</p>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userData.reports.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Este usuario no ha realizado reportes aún
              </p>
            ) : (
              userData.reports
                .sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .slice(0, 10)
                .map((report: any) => (
                  <div key={report.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{report.tipo}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.fecha).toLocaleDateString()} - {report.metodoPago}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${((report.diezmo || 0) + (report.ofrenda || 0) + (report.ofrendaEspecial || 0)).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">{report.moneda}</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
