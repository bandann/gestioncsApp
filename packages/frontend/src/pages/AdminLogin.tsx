
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

const adminLoginSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

const AdminLogin: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      // Credenciales de administrador por defecto: admin / admin123
      if (data.username === 'admin' && data.password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          nombre: 'Administrador',
          apellido: 'Sistema',
          cedula: 'ADMIN',
          telefono: '0000000000',
          fechaNacimiento: '1990-01-01',
          cargo: 'Lider' as const,
          miembroActivo: true,
          isAdmin: true,
          password: 'admin123',
          createdAt: new Date().toISOString(),
        };

        login(adminUser);
        toast({
          title: 'Acceso autorizado',
          description: 'Bienvenido al panel de administración',
        });
        navigate('/admin');
      } else {
        toast({
          title: 'Acceso denegado',
          description: 'Credenciales de administrador incorrectas',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error durante el inicio de sesión',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
          <img src="/public/logo_iglesia_white.svg" alt="Logo de la Iglesia" className="mx-auto mb-4 h-120 w-100" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Panel Administrativo</h1>
          <p className="text-gray-300">Cristo Salva - Acceso Restringido</p>
        </div>
        
        <Card className="shadow-xl bg-white/90 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Acceso Administrador
            </CardTitle>
            <CardDescription>
              Usuario: admin | Contraseña: admin123
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nombre de usuario"
                  {...register('username')}
                  className={errors.username ? 'border-destructive' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-destructive mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña de administrador"
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Verificando...' : 'Acceder al Panel'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <Link to="/" className="text-primary hover:underline">
                  ← Volver al inicio de sesión de usuarios
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
