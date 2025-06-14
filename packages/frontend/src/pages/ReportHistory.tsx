
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Filter, Calendar, DollarSign, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Report } from '@/types';

const ReportHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    currency: 'all',
    amountMin: '',
    amountMax: '',
    type: 'all',
    paymentMethod: 'all'
  });

  // Cargar reportes del localStorage
  const allReports = JSON.parse(localStorage.getItem('churchReports') || '[]') as Report[];
  const userReports = allReports.filter(report => report.userId === user?.id);

  // Aplicar filtros
  const filteredReports = useMemo(() => {
    return userReports.filter(report => {
      const reportDate = new Date(report.fecha);
      const totalAmount = (report.diezmo || 0) + (report.ofrenda || 0) + (report.ofrendaEspecial || 0);

      // Filtro por fecha desde
      if (filters.dateFrom && reportDate < new Date(filters.dateFrom)) {
        return false;
      }

      // Filtro por fecha hasta
      if (filters.dateTo && reportDate > new Date(filters.dateTo)) {
        return false;
      }

      // Filtro por moneda
      if (filters.currency !== 'all' && report.moneda !== filters.currency) {
        return false;
      }

      // Filtro por monto mínimo
      if (filters.amountMin && totalAmount < parseFloat(filters.amountMin)) {
        return false;
      }

      // Filtro por monto máximo
      if (filters.amountMax && totalAmount > parseFloat(filters.amountMax)) {
        return false;
      }

      // Filtro por tipo
      if (filters.type !== 'all' && report.tipo !== filters.type) {
        return false;
      }

      // Filtro por método de pago
      if (filters.paymentMethod !== 'all' && report.metodoPago !== filters.paymentMethod) {
        return false;
      }

      return true;
    });
  }, [userReports, filters]);

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      currency: 'all',
      amountMin: '',
      amountMax: '',
      type: 'all',
      paymentMethod: 'all'
    });
  };

  const getTotalByType = (type: 'diezmo' | 'ofrenda' | 'ofrendaEspecial') => {
    return filteredReports.reduce((total, report) => {
      return total + (report[type] || 0);
    }, 0);
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
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Historial de Reportes
        </h1>
      </div>

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
              <p className="text-2xl font-bold text-green-600">${getTotalByType('diezmo').toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Ofrendas</p>
              <p className="text-2xl font-bold text-blue-600">${getTotalByType('ofrenda').toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Ofrendas Especiales</p>
              <p className="text-2xl font-bold text-purple-600">${getTotalByType('ofrendaEspecial').toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Filtra tus reportes por fecha, moneda, monto y más
          </CardDescription>
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
              <Label htmlFor="type">Tipo</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
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
            <div>
              <Label htmlFor="amountMin">Monto Mín.</Label>
              <Input
                id="amountMin"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={filters.amountMin}
                onChange={(e) => setFilters({...filters, amountMin: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="amountMax">Monto Máx.</Label>
              <Input
                id="amountMax"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={filters.amountMax}
                onChange={(e) => setFilters({...filters, amountMax: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron reportes con los filtros aplicados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(report.tipo)}>
                          {report.tipo}
                        </Badge>
                        <Badge variant="outline">
                          {report.metodoPago}
                        </Badge>
                        <Badge variant="outline">
                          {report.moneda}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.fecha).toLocaleDateString()}
                      </p>
                      {report.observaciones && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {report.observaciones}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      {report.diezmo && report.diezmo > 0 && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Diezmo:</span> 
                          <span className="font-medium text-green-600 ml-1">${report.diezmo}</span>
                        </p>
                      )}
                      {report.ofrenda && report.ofrenda > 0 && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Ofrenda:</span> 
                          <span className="font-medium text-blue-600 ml-1">${report.ofrenda}</span>
                        </p>
                      )}
                      {report.ofrendaEspecial && report.ofrendaEspecial > 0 && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Esp.:</span> 
                          <span className="font-medium text-purple-600 ml-1">${report.ofrendaEspecial}</span>
                        </p>
                      )}
                      <p className="font-bold">
                        Total: ${((report.diezmo || 0) + (report.ofrenda || 0) + (report.ofrendaEspecial || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportHistory;
