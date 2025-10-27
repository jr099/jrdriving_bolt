export type UserRole = 'admin' | 'driver' | 'client';

export type MissionStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type MissionPriority = 'normal' | 'urgent' | 'express';
export type QuoteStatus = 'new' | 'quoted' | 'converted' | 'declined';

export interface AuthUser {
  id: number;
  email: string;
  createdAt: string;
}

export interface ProfilePayload {
  id: number;
  userId: number;
  fullName: string;
  phone: string | null;
  role: UserRole;
  plan: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: AuthUser;
  profile: ProfilePayload;
}

export interface CreateQuoteDto {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  vehicleType: string;
  departureLocation: string;
  arrivalLocation: string;
  preferredDate?: string | null;
  message?: string | null;
}

export interface AuthCredentialsDto {
  email: string;
  password: string;
}

export interface SignupDto extends AuthCredentialsDto {
  fullName: string;
  phone: string;
  role: Exclude<UserRole, 'admin'>;
}

export interface MissionStatusUpdateDto {
  status: MissionStatus;
}

export interface MissionDto {
  id: number;
  clientId: number;
  driverId: number | null;
  missionNumber: string;
  departureAddress: string;
  departureCity: string;
  departurePostalCode: string;
  arrivalAddress: string;
  arrivalCity: string;
  arrivalPostalCode: string;
  scheduledDate: string;
  scheduledTime: string | null;
  actualStartTime: string | null;
  actualEndTime: string | null;
  distanceKm: number | null;
  price: number | null;
  status: MissionStatus;
  priority: MissionPriority;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DriverDashboardStats {
  totalMissions: number;
  inProgress: number;
  completed: number;
  totalKm: number;
}

export interface DriverDashboardResponse {
  stats: DriverDashboardStats;
  missions: MissionDto[];
}

export interface AdminDashboardStats {
  totalMissions: number;
  activeMissions: number;
  totalDrivers: number;
  totalClients: number;
  pendingQuotes: number;
  revenue: number;
}

export interface QuoteDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  companyName: string | null;
  vehicleType: string;
  departureLocation: string;
  arrivalLocation: string;
  preferredDate: string | null;
  message: string | null;
  status: QuoteStatus;
  estimatedPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  recentMissions: MissionDto[];
  pendingQuotes: QuoteDto[];
}
