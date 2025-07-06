const API_BASE_URL = 'http://localhost:5298/api';

export class ApiService {
    static async getPatients(name = null, cpf = null, isActive = null) {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (cpf) params.append('cpf', cpf);
        if (isActive !== null) params.append('isActive', isActive);

        const response = await fetch(`${API_BASE_URL}/patients?${params.toString()}`);
        return this._handleResponse(response);
    }

    static async getAppointment(id) {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}`);
        return this._handleResponse(response);
    }


    static async getPatient(id) {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`);
        return this._handleResponse(response);
    }

    static async updateAppointment(id, appointmentData) {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });
        return this._handleResponse(response);
    }

    static async createPatient(patientData) {
        const response = await fetch(`${API_BASE_URL}/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        });
        return this._handleResponse(response);
    }

    static async updatePatient(id, patientData) {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        });
        return this._handleResponse(response);
    }

    static async deletePatient(id) {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
            method: 'DELETE'
        });
        return this._handleResponse(response);
    }

    static async deleteAppointment(id) {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar atendimento');
        }
    }

    static async getPatientAppointments(patientId) {
        const response = await fetch(`${API_BASE_URL}/patients/${patientId}/appointments`);
        return this._handleResponse(response);
    }

    static async getAppointments(startDate = null, endDate = null, patientId = null, isActive = null) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());
        if (patientId) params.append('patientId', patientId);
        if (isActive !== null) params.append('isActive', isActive);

        const response = await fetch(`${API_BASE_URL}/appointments?${params.toString()}`);
        return this._handleResponse(response);
    }

    static async createAppointment(appointmentData) {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });
        return this._handleResponse(response);
    }

    static async _handleResponse(response) {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro na requisição');
        }
        return response.json();
    }
}