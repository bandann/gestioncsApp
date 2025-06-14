export interface User {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  fechaNacimiento: string;
  correo?: string;
  cargo: 'Lider' | 'Miembro' | 'Maestro' | 'Musico' | 'Visitante';
  miembroActivo: boolean;
  isAdmin?: boolean;
  password: string;
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  tipo: 'Diezmo' | 'Ofrenda' | 'Diezmo y ofrenda' | 'Ofrenda Especial' | 'Ministerio los 300';
  metodoPago: 'Transferencia' | 'Pago movil' | 'Efectivo Bs.' | 'Efectivo $' | 'Dolares' | 'Euros' | 'Otros' | 'Zelle' | 'Transferencia Internacional' | 'Otro';
  diezmo?: number;
  ofrenda?: number;
  ofrendaEspecial?: number;
  fecha: string;
  moneda: 'BS' | 'USD' | 'EUR' | 'OTROS';
  observaciones?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  titulo: string;
  contenido: string;
  fechaCreacion: string;
  activo: boolean;
  createdBy: string;
}

export interface Notification {
  id: string;
  userId?: string; // undefined para notificaciones globales
  titulo: string;
  mensaje: string;
  fechaEnvio: string;
  leida: boolean;
  tipo: 'global' | 'personal';
  createdBy: string;
}

export interface TitheCalculation {
  monto: number;
  diezmo: number;
  porcentaje: number;
}

export interface Statistics {
  totalDiezmos: number;
  totalOfrendas: number;
  reportesPorMes: { mes: string; cantidad: number }[];
  usuarioMasActivo: string;
  usuarioSinReportar: string[];
}
