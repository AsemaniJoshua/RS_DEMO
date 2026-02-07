
  import axios from 'axios';

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

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
  userId: string;
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
  private getAuthHeader() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

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
      const response = await axios.get(
        `${API_BASE_URL}/user/appointments`,
        {
          params: { userId },
          ...this.getAuthHeader()
        }
      );
      return response.data.data.appointments;
    } catch (error: any) {
      console.error('Error fetching user appointments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch your appointments');
    }
  }

  // Get a specific appointment for the logged-in user
  async getMyAppointmentById(id: string, userEmail: string): Promise<Appointment> {
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
      const response = await axios.get(
        `${API_BASE_URL}/user/appointments/${id}`,
        {
          params: { userId },
          ...this.getAuthHeader()
        }
      );
      return response.data.data.appointment;
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
      const response = await axios.post(
        `${API_BASE_URL}/user/appointments`,
        payload,
        this.getAuthHeader()
      );
      return response.data.data.appointment;
    } catch (error: any) {
      console.error('Error creating user appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to create appointment');
    }
  }

  // Get all appointments with optional filters
  async getAllAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await axios.get(
        `${API_BASE_URL}/admin/appointments?${params.toString()}`,
        this.getAuthHeader()
      );

      return response.data.appointments;
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }

  // Get single appointment by ID
  async getAppointmentById(id: string): Promise<Appointment> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/appointments/${id}`,
        this.getAuthHeader()
      );

      return response.data.appointment;
    } catch (error: any) {
      console.error('Error fetching appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment');
    }
  }

  // Create new appointment
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/appointments`,
        data,
        this.getAuthHeader()
      );

      return response.data.appointment;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to create appointment');
    }
  }

  // Update appointment
  async updateAppointment(id: string, data: CreateAppointmentData): Promise<Appointment> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/appointments/${id}`,
        data,
        this.getAuthHeader()
      );

      return response.data.appointment;
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to update appointment');
    }
  }

  // Delete appointment
  async deleteAppointment(id: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/appointments/${id}`,
        this.getAuthHeader()
      );
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete appointment');
    }
  }

  // Get all appointment types (user dashboard fetches from user endpoint)
  async getAllTypes(): Promise<AppointmentType[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/appointments/types`,
        this.getAuthHeader()
      );
      return response.data.types;
    } catch (error: any) {
      console.error('Error fetching appointment types:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment types');
    }
  }

  // Create new appointment type
  async createType(name: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/admin/appointments/types`,
        { name },
        this.getAuthHeader()
      );
    } catch (error: any) {
      console.error('Error creating appointment type:', error);
      throw new Error(error.response?.data?.message || 'Failed to create appointment type');
    }
  }

  // Delete appointment type
  async deleteType(id: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/appointments/types/${id}`,
        this.getAuthHeader()
      );
    } catch (error: any) {
      console.error('Error deleting appointment type:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete appointment type');
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
