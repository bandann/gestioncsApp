import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Filter, 
  Download, 
  User, 
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const AdminReports: React.FC = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    userId: 'all',
    currency: 'all',
    tipo: 'all',
    cargo: 'all'
  });

  // Cargar datos del localStorage
  const allUsers = JSON.parse(localStorage.getItem('churchUsers') || '[]');
  const allReports = JSON.parse(localStorage.getItem('churchReports') || '[]');

  // Filtrar reportes
  const filteredReports = useMemo(() => {
    return allReports.filter((report: any) => {
      const reportDate = new Date(report.fecha);
      const user = allUsers.find((u: any) => u.id === report.userId);

      // Filtro por fecha desde
      if (filters.dateFrom && reportDate < new Date(filters.dateFrom)) {
        return false;
      }

      // Filtro por fecha hasta
      if (filters.dateTo && reportDate > new Date(filters.dateTo)) {
        return false;
      }

      // Filtro por usuario
      if (filters.userId !== 'all' && report.userId !== filters.userId) {
        return false;
      }

      // Filtro por moneda
      if (filters.currency !== 'all' && report.moneda !== filters.currency) {
        return false;
      }

      // Filtro por tipo
      if (filters.tipo !== 'all' && report.tipo !== filters.tipo) {
        return false;
      }

      // Filtro por cargo del usuario
      if (filters.cargo !== 'all' && user?.cargo !== filters.cargo) {
        return false;
      }

      return true;
    });
  }, [allReports, allUsers, filters]);

  // Calcular totales
  const totals = useMemo(() => {
    return filteredReports.reduce((acc: any, report: any) => {
      acc.diezmos += report.diezmo || 0;
      acc.ofrendas += report.ofrenda || 0;
      acc.ofrendasEspeciales += report.ofrendaEspecial || 0;
      acc.total += (report.diezmo || 0) + (report.ofrenda || 0) + (report.ofrendaEspecial || 0);
      
      // Por moneda
      if (!acc.byMoneda[report.moneda]) {
        acc.byMoneda[report.moneda] = 0;
      }
      acc.byMoneda[report.moneda] += (report.diezmo || 0) + (report.ofrenda || 0) + (report.ofrendaEspecial || 0);

      // Por método de pago
      if (!acc.byMetodo[report.metodoPago]) {
        acc.byMetodo[report.metodoPago] = 0;
      }
      acc.byMetodo[report.metodoPago] += (report.diezmo || 0) + (report.ofrenda || 0) + (report.ofrendaEspecial || 0);

      return acc;
    }, {
      diezmos: 0,
      ofrendas: 0,
      ofrendasEspeciales: 0,
      total: 0,
      byMoneda: {},
      byMetodo: {}
    });
  }, [filteredReports]);

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      userId: 'all',
      currency: 'all',
      tipo: 'all',
      cargo: 'all'
    });
  };

  const exportData = () => {
    // Aquí implementarías la exportación de datos
    console.log('Exportando datos...', filteredReports);
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'Diezmo': return 'bg-green-100 text-green-800';
      case 'Ofrenda': return 'bg-blue-100 text-blue-800';
      case 'Diezmo y ofrenda': return 'bg-purple-100 text-purple-800';
      case 'Ofrenda Especial': return 'bg-yellow-100 text-yellow-800';
      case 'Ministerio los 300': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Reportes Administrativos
        </h1>
        <Button onClick={exportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="dateFrom">Fecha Desde</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">Fecha Hasta</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="userId">Usuario</Label>
                  <Select value={filters.userId} onValueChange={(value) => setFilters({...filters, userId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los usuarios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los usuarios</SelectItem>
                      {allUsers.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.nombre} {user.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select value={filters.cargo} onValueChange={(value) => setFilters({...filters, cargo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los cargos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los cargos</SelectItem>
                      <SelectItem value="Lider">Líder</SelectItem>
                      <SelectItem value="Miembro">Miembro</SelectItem>
                      <SelectItem value="Maestro">Maestro</SelectItem>
                      <SelectItem value="Musico">Músico</SelectItem>
                      <SelectItem value="Visitante">Visitante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Moneda</Label>
                  <Select value={filters.currency} onValueChange={(value) => setFilters({...filters, currency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="BS">Bolívares</SelectItem>
                      <SelectItem value="USD">Dólares</SelectItem>
                      <SelectItem value="EUR">Euros</SelectItem>
                      <SelectItem value="OTROS">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Diezmo">Diezmo</SelectItem>
                      <SelectItem value="Ofrenda">Ofrenda</SelectItem>
                      <SelectItem value="Diezmo y ofrenda">Diezmo y ofrenda</SelectItem>
                      <SelectItem value="Ofrenda Especial">Ofrenda Especial</SelectItem>
                      <SelectItem value="Ministerio los 300">Ministerio los 300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Reportes</p>
                  <p className="text-2xl font-bold">{filteredReports.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Diezmos</p>
                  <p className="text-2xl font-bold text-green-600">${totals.diezmos.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Ofrendas</p>
                  <p className="text-2xl font-bold text-blue-600">${totals.ofrendas.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Gran Total</p>
                  <p className="text-2xl font-bold text-primary">${totals.total.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Reportes */}
          <Card>
            <CardHeader>
              <CardTitle>Reportes Detallados ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report: any) => {
                  const user = allUsers.find((u: any) => u.id === report.userId);
                  return (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">
                              {user?.nombre} {user?.apellido}
                            </span>
                            <Badge variant="outline">{user?.cargo}</Badge>
                            <Badge className={getTypeColor(report.tipo)}>
                              {report.tipo}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <span>Cédula: {user?.cedula}</span>
                            <span>Teléfono: {user?.telefono}</span>
                            <span>Fecha: {new Date(report.fecha).toLocaleDateString()}</span>
                            <span>Método: {report.metodoPago}</span>
                          </div>
                          {report.observaciones && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Obs: {report.observaciones}
                            </p>
                          )}
                        </div>
                        <div className="text-right space-y-1">
                          {report.diezmo > 0 && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Diezmo:</span> 
                              <span className="font-medium text-green-600 ml-1">${report.diezmo} {report.moneda}</span>
                            </p>
                          )}
                          {report.ofrenda > 0 && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Ofrenda:</span> 
                              <span className="font-medium text-blue-600 ml-1">${report.ofrenda} {report.moneda}</span>
                            </p>
                          )}
                          {report.ofrendaEspecial > 0 && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Esp.:</span> 
                              <span className="font-medium text-purple-600 ml-1">${report.ofrendaEspecial} {report.moneda}</span>
                            </p>
                          )}
                          <p className="font-bold">
                            Total: ${((report.diezmo || 0) + (report.ofrenda || 0) + (report.ofrendaEspecial || 0)).toFixed(2)} {report.moneda}
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

        <TabsContent value="statistics" className="space-y-6">
          {/* Estadísticas por Moneda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Totales por Moneda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(totals.byMoneda).map(([moneda, total]: [string, any]) => (
                  <div key={moneda} className="text-center p-4 border rounded-lg">
                    <p className="text-lg font-bold">${total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{moneda}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas por Método */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Totales por Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(totals.byMetodo)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([metodo, total]: [string, any]) => (
                  <div key={metodo} className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="font-medium">{metodo}</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Avanzado</CardTitle>
              <CardDescription>
                Métricas detalladas y tendencias de los reportes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Funcionalidad de análisis avanzado en desarrollo</p>
                <p className="text-sm">Próximamente: gráficos, tendencias y predicciones</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
