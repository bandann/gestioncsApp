
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  cedula: z.string().min(6, 'La cédula debe tener al menos 6 caracteres'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  correo: z.string().email('Email inválido').optional().or(z.literal('')),
  cargo: z.enum(['Lider', 'Miembro', 'Maestro', 'Musico', 'Visitante']),
  miembroActivo: z.boolean(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      miembroActivo: true,
    },
  });

  const miembroActivo = watch('miembroActivo');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        nombre: data.nombre,
        apellido: data.apellido,
        cedula: data.cedula,
        telefono: data.telefono,
        fechaNacimiento: data.fechaNacimiento,
        correo: data.correo || undefined,
        cargo: data.cargo,
        miembroActivo: data.miembroActivo,
        isAdmin: false,
        password: data.password,
        createdAt: new Date().toISOString(),
      };

      // Guardar usuario en localStorage
      const existingUsers = JSON.parse(localStorage.getItem('churchUsers') || '[]');
      
      // Verificar si la cédula ya existe
      if (existingUsers.find((user: User) => user.cedula === data.cedula)) {
        toast({
          title: 'Error de registro',
          description: 'Ya existe un usuario con esta cédula',
          variant: 'destructive',
        });
        return;
      }

      existingUsers.push(newUser);
      localStorage.setItem('churchUsers', JSON.stringify(existingUsers));

      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada correctamente',
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error durante el registro',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-church-50 to-church-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Cristo Salva</h1>
          <p className="text-gray-600">Registro de Nuevo Usuario</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>
              Completa todos los campos para registrarte en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    {...register('nombre')}
                    className={errors.nombre ? 'border-destructive' : ''}
                  />
                  {errors.nombre && (
                    <p className="text-sm text-destructive mt-1">{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    {...register('apellido')}
                    className={errors.apellido ? 'border-destructive' : ''}
                  />
                  {errors.apellido && (
                    <p className="text-sm text-destructive mt-1">{errors.apellido.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cedula">Cédula *</Label>
                  <Input
                    id="cedula"
                    {...register('cedula')}
                    className={errors.cedula ? 'border-destructive' : ''}
                  />
                  {errors.cedula && (
                    <p className="text-sm text-destructive mt-1">{errors.cedula.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    {...register('telefono')}
                    className={errors.telefono ? 'border-destructive' : ''}
                  />
                  {errors.telefono && (
                    <p className="text-sm text-destructive mt-1">{errors.telefono.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  {...register('fechaNacimiento')}
                  className={errors.fechaNacimiento ? 'border-destructive' : ''}
                />
                {errors.fechaNacimiento && (
                  <p className="text-sm text-destructive mt-1">{errors.fechaNacimiento.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="correo">Correo Electrónico (Opcional)</Label>
                <Input
                  id="correo"
                  type="email"
                  {...register('correo')}
                  className={errors.correo ? 'border-destructive' : ''}
                />
                {errors.correo && (
                  <p className="text-sm text-destructive mt-1">{errors.correo.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="cargo">Cargo *</Label>
                <Select onValueChange={(value) => setValue('cargo', value as any)}>
                  <SelectTrigger className={errors.cargo ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecciona tu cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lider">Líder</SelectItem>
                    <SelectItem value="Miembro">Miembro</SelectItem>
                    <SelectItem value="Maestro">Maestro</SelectItem>
                    <SelectItem value="Musico">Músico</SelectItem>
                    <SelectItem value="Visitante">Visitante</SelectItem>
                  </SelectContent>
                </Select>
                {errors.cargo && (
                  <p className="text-sm text-destructive mt-1">{errors.cargo.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="miembroActivo"
                  checked={miembroActivo}
                  onCheckedChange={(checked) => setValue('miembroActivo', checked)}
                />
                <Label htmlFor="miembroActivo">Miembro Activo</Label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/" className="text-primary hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
