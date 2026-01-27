import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  type: AppointmentType; // Full type object from relation
  typeId: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  date: string;
  time: string;
  duration: string;
  reason: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  typeId: string; // Send typeId instead of type name
  status?: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  date: string;
  time: string;
  duration: string;
  reason: string;
  notes?: string;
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

  // Get all appointment types
  async getAllTypes(): Promise<AppointmentType[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/appointments/types`,
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
}

export const appointmentService = new AppointmentService();
