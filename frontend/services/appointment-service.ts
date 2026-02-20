
  import { api } from "@/lib/api";

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  type: AppointmentType; // Full type object from relation
  typeId: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  date: string;
  time: string;
  duration: string;
  reason: string;
  notes?: string;
  cancellationReason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  typeId: string;
  status?: string;
  date: string;
  time: string;
  duration: string;
  reason: string;
  notes?: string;
  cancellationReason?: string;
  userId?: string;
}

export interface UpdateAppointmentData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  typeId: string;
  status?: string;
  date: string;
  time: string;
  duration: string;
  reason: string;
  notes?: string;
  cancellationReason?: string;
}

export interface AppointmentFilters {
  type?: string;
  status?: string;
  search?: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

class AppointmentService {
  // USER DASHBOARD ENDPOINTS
  // Get all appointments for the logged-in user
  async getMyAppointments(): Promise<Appointment[]> {
    try {
      // Extract userId from localStorage (user object or user_id)
      let userId = '';
      if (typeof window !== 'undefined') {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const parsed = JSON.parse(userRaw);
            userId = parsed.id || parsed.userId || userRaw;
          } catch {
            userId = userRaw;
          }
        }
      }
      if (!userId) throw new Error('User ID not found. Please log in again.');
      const response: any = await api.get(`/user/appointments?userId=${userId}`);
      return response.data?.appointments || response.appointments || [];
    } catch (error: any) {
      console.error('Error fetching user appointments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch your appointments');
    }
  }

  // Get a specific appointment for the logged-in user
  async getMyAppointmentById(id: string, userEmail?: string): Promise<Appointment> {
    try {
      // Extract userId from localStorage (user object or user_id)
      let userId = '';
      if (typeof window !== 'undefined') {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const parsed = JSON.parse(userRaw);
            userId = parsed.id || parsed.userId || userRaw;
          } catch {
            userId = userRaw;
          }
        }
      }
      if (!userId) throw new Error('User ID not found. Please log in again.');
      const response: any = await api.get(`/user/appointments/${id}?userId=${userId}`);
      return response.data?.appointment || response.appointment;
    } catch (error: any) {
      console.error('Error fetching user appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment');
    }
  }

  // Create a new appointment for the logged-in user
  async createMyAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
      // Add userId from localStorage if not present
      let userId = data.userId;
      if (!userId) {
        // Try to get userId from localStorage (either as a string or from a user object)
        const userRaw = localStorage.getItem('user_id') || localStorage.getItem('user');
        if (userRaw) {
          try {
            // If userRaw is a JSON object, parse and extract id; otherwise, use as string
            const parsed = JSON.parse(userRaw);
            userId = parsed.id || parsed.userId || userRaw;
          } catch {
            userId = userRaw;
          }
        } else {
          userId = '';
        }
      }
      const payload = { ...data, userId };
      const response: any = await api.post('/user/appointments', payload);
      return response.data?.appointment || response.appointment;
    } catch (error: any) {
      console.error('Error creating user appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to create appointment');
    }
  }

  // Cancel an appointment for the logged-in user (updates status to CANCELLED)
  async cancelMyAppointment(id: string): Promise<void> {
    try {
      // Extract userId from localStorage (user object or user_id)
      let userId = '';
      if (typeof window !== 'undefined') {
        const userRaw = localStorage.getItem('user');
        if (userRaw) {
          try {
            const parsed = JSON.parse(userRaw);
            userId = parsed.id || parsed.userId || userRaw;
          } catch {
            userId = userRaw;
          }
        }
      }
      if (!userId) throw new Error('User ID not found. Please log in again.');
      await api.patch(`/user/appointments/${id}/cancel?userId=${userId}`, {});
    } catch (error: any) {
      console.error('Error cancelling user appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  }

  // ADMIN ENDPOINTS
  // Get all appointments with optional filters (ADMIN)
  async getAllAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response: any = await api.get(`/admin/appointments?${params.toString()}`);

      return response.appointments || response.data?.appointments || [];
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }

  // Get single appointment by ID (ADMIN)
  async getAppointmentById(id: string): Promise<Appointment> {
    try {
      const response: any = await api.get(`/admin/appointments/${id}`);

      return response.appointment || response.data?.appointment;
    } catch (error: any) {
      console.error('Error fetching appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment');
    }
  }

  // Create new appointment (ADMIN)
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
      const response: any = await api.post('/admin/appointments', data);

      return response.appointment || response.data?.appointment;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to create appointment');
    }
  }

  // Update appointment (ADMIN)
  async updateAppointment(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    try {
      const response: any = await api.put(`/admin/appointments/${id}`, data);

      return response.appointment || response.data?.appointment;
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to update appointment');
    }
  }

  // Delete appointment (ADMIN)
  async deleteAppointment(id: string): Promise<void> {
    try {
      await api.delete(`/admin/appointments/${id}`);
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete appointment');
    }
  }

  // Get all appointment types (ADMIN)
  async getAdminTypes(): Promise<AppointmentType[]> {
    try {
      const response: any = await api.get('/admin/appointments/types');
      return response.types || response.data?.types || [];
    } catch (error: any) {
      console.error('Error fetching admin appointment types:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment types');
    }
  }

  // Create new appointment type (ADMIN)
  async createType(name: string): Promise<void> {
    try {
      await api.post('/admin/appointments/types', { name });
    } catch (error: any) {
      console.error('Error creating appointment type:', error);
      throw new Error(error.response?.data?.message || 'Failed to create appointment type');
    }
  }

  // Delete appointment type (ADMIN)
  async deleteType(id: string): Promise<void> {
    try {
      await api.delete(`/admin/appointments/types/${id}`);
    } catch (error: any) {
      console.error('Error deleting appointment type:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete appointment type');
    }
  }

  // USER DASHBOARD ENDPOINTS
  // Get all appointment types (USER - for user dashboard)
  async getAllTypes(): Promise<AppointmentType[]> {
    try {
      const response: any = await api.get('/user/appointments/types');
      return response.types || response.data?.types || [];
    } catch (error: any) {
      console.error('Error fetching appointment types:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment types');
    }
  }

  // PUBLIC ENDPOINTS
  // Get all appointment types (PUBLIC - for booking page without authentication)
  async getPublicTypes(): Promise<AppointmentType[]> {
    try {
      const response: any = await api.get('/public/appointment-types');
      return response.types || response.data?.types || [];
    } catch (error: any) {
      console.error('Error fetching public appointment types:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment types');
    }
  }

  // Convenience aliases for shorter method names
  getTypes = this.getAllTypes.bind(this);
  getById = this.getAppointmentById.bind(this);
  create = this.createAppointment.bind(this);
  update = this.updateAppointment.bind(this);
  delete = this.deleteAppointment.bind(this);
}

export const appointmentService = new AppointmentService();
