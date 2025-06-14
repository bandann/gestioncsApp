
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Report } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

const reportSchema = z.object({
  tipo: z.enum(['Diezmo', 'Ofrenda', 'Diezmo y ofrenda', 'Ofrenda Especial', 'Ministerio los 300']),
  metodoPago: z.enum(['Transferencia', 'Pago movil', 'Efectivo Bs.', 'Dolares', 'Euros', 'Otros', 'Zelle', 'Transferencia Internacional', 'Otro']),
  diezmo: z.number().min(0).optional(),
  ofrenda: z.number().min(0).optional(),
  ofrendaEspecial: z.number().min(0).optional(),
  fecha: z.string().min(1, 'La fecha es requerida'),
  moneda: z.enum(['BS', 'USD', 'EUR', 'OTROS']),
  observaciones: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

const ReportForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<ReportFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
    },
  });

  const watchedValues = watch();

  const onSubmit = (data: ReportFormData) => {
    // Validar que al menos un monto esté presente
    if (!data.diezmo && !data.ofrenda && !data.ofrendaEspecial) {
      toast({
        title: 'Error de validación',
        description: 'Debe ingresar al menos un monto (diezmo, ofrenda o ofrenda especial)',
        variant: 'destructive',
      });
      return;
    }

    setFormData(data);
    setShowConfirmation(true);
  };

  const confirmReport = () => {
    if (!formData || !user) return;

    try {
      const newReport: Report = {
        id: Date.now().toString(),
        userId: user.id,
        tipo: formData.tipo,
        metodoPago: formData.metodoPago,
        diezmo: formData.diezmo || 0,
        ofrenda: formData.ofrenda || 0,
        ofrendaEspecial: formData.ofrendaEspecial || 0,
        fecha: formData.fecha,
        moneda: formData.moneda,
        observaciones: formData.observaciones,
        createdAt: new Date().toISOString(),
      };

      // Guardar reporte en localStorage
      const existingReports = JSON.parse(localStorage.getItem('churchReports') || '[]');
      existingReports.push(newReport);
      localStorage.setItem('churchReports', JSON.stringify(existingReports));

      toast({
        title: 'Reporte enviado exitosamente',
        description: 'Tu reporte ha sido registrado correctamente',
      });

      reset();
      setShowConfirmation(false);
      setFormData(null);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al enviar el reporte',
        variant: 'destructive',
      });
    }
  };

  if (showConfirmation && formData) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowConfirmation(false)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Confirmar Reporte</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Verificar Información
            </CardTitle>
            <CardDescription>
              Por favor verifica que todos los datos sean correctos antes de confirmar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Reporte:</Label>
                <p className="font-medium">{formData.tipo}</p>
              </div>
              <div>
                <Label>Método de Pago:</Label>
                <p className="font-medium">{formData.metodoPago}</p>
              </div>
              <div>
                <Label>Fecha:</Label>
                <p className="font-medium">{formData.fecha}</p>
              </div>
              <div>
                <Label>Moneda:</Label>
                <p className="font-medium">{formData.moneda}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.diezmo && (
                <div>
                  <Label>Diezmo:</Label>
                  <p className="text-2xl font-bold text-green-600">{formData.diezmo}</p>
                </div>
              )}
              {formData.ofrenda && (
                <div>
                  <Label>Ofrenda:</Label>
                  <p className="text-2xl font-bold text-blue-600">{formData.ofrenda}</p>
                </div>
              )}
              {formData.ofrendaEspecial && (
                <div>
                  <Label>Ofrenda Especial:</Label>
                  <p className="text-2xl font-bold text-purple-600">{formData.ofrendaEspecial}</p>
                </div>
              )}
            </div>

            {formData.observaciones && (
              <div>
                <Label>Observaciones:</Label>
                <p className="font-medium">{formData.observaciones}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button onClick={confirmReport} className="flex-1">
                Confirmar Reporte
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Nuevo Reporte</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporte de Diezmos y Ofrendas</CardTitle>
          <CardDescription>
            Completa la información de tu diezmo u ofrenda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo de Reporte *</Label>
                <Select onValueChange={(value) => setValue('tipo', value as any)}>
                  <SelectTrigger className={errors.tipo ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diezmo">Diezmo</SelectItem>
                    <SelectItem value="Ofrenda">Ofrenda</SelectItem>
                    <SelectItem value="Diezmo y ofrenda">Diezmo y ofrenda</SelectItem>
                    <SelectItem value="Ofrenda Especial">Ofrenda Especial</SelectItem>
                    <SelectItem value="Ministerio los 300">Ministerio los 300</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo && (
                  <p className="text-sm text-destructive mt-1">{errors.tipo.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="metodoPago">Método de Pago *</Label>
                <Select onValueChange={(value) => setValue('metodoPago', value as any)}>
                  <SelectTrigger className={errors.metodoPago ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecciona el método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                    <SelectItem value="Pago movil">Pago móvil</SelectItem>
                    <SelectItem value="Efectivo Bs.">Efectivo Bs.</SelectItem>
                    <SelectItem value="Dolares">Dólares</SelectItem>
                    <SelectItem value="Euros">Euros</SelectItem>
                    <SelectItem value="Zelle">Zelle</SelectItem>
                    <SelectItem value="Transferencia Internacional">Transferencia Internacional</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
                {errors.metodoPago && (
                  <p className="text-sm text-destructive mt-1">{errors.metodoPago.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  {...register('fecha')}
                  className={errors.fecha ? 'border-destructive' : ''}
                />
                {errors.fecha && (
                  <p className="text-sm text-destructive mt-1">{errors.fecha.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="moneda">Moneda *</Label>
                <Select onValueChange={(value) => setValue('moneda', value as any)}>
                  <SelectTrigger className={errors.moneda ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecciona la moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BS">Bolívares (BS)</SelectItem>
                    <SelectItem value="USD">Dólares (USD)</SelectItem>
                    <SelectItem value="EUR">Euros (EUR)</SelectItem>
                    <SelectItem value="OTROS">Otros</SelectItem>
                  </SelectContent>
                </Select>
                {errors.moneda && (
                  <p className="text-sm text-destructive mt-1">{errors.moneda.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="diezmo">Diezmo</Label>
                <Input
                  id="diezmo"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('diezmo', { valueAsNumber: true })}
                  className={errors.diezmo ? 'border-destructive' : ''}
                />
                {errors.diezmo && (
                  <p className="text-sm text-destructive mt-1">{errors.diezmo.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ofrenda">Ofrenda</Label>
                <Input
                  id="ofrenda"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('ofrenda', { valueAsNumber: true })}
                  className={errors.ofrenda ? 'border-destructive' : ''}
                />
                {errors.ofrenda && (
                  <p className="text-sm text-destructive mt-1">{errors.ofrenda.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ofrendaEspecial">Ofrenda Especial</Label>
                <Input
                  id="ofrendaEspecial"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('ofrendaEspecial', { valueAsNumber: true })}
                  className={errors.ofrendaEspecial ? 'border-destructive' : ''}
                />
                {errors.ofrendaEspecial && (
                  <p className="text-sm text-destructive mt-1">{errors.ofrendaEspecial.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
              <Textarea
                id="observaciones"
                placeholder="Agrega cualquier observación adicional..."
                {...register('observaciones')}
                className={errors.observaciones ? 'border-destructive' : ''}
              />
              {errors.observaciones && (
                <p className="text-sm text-destructive mt-1">{errors.observaciones.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Procesando...' : 'Continuar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;
