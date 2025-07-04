import { ApiService } from './api.js';
import { formatDateTime, showToast } from './app.js'; // Agora formatDateTime está disponível

document.addEventListener('DOMContentLoaded', async () => {
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');
    const searchAppointmentsBtn = document.getElementById('searchAppointmentsBtn');
    const resetAppointmentsBtn = document.getElementById('resetAppointmentsBtn');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const appointmentPatient = document.getElementById('appointmentPatient');
    const appointmentStatusFilter = document.getElementById('appointmentStatusFilter');
    const appointmentForm = document.getElementById('appointmentForm');
    const saveAppointmentBtn = document.getElementById('saveAppointmentBtn');
    const appointmentModal = new bootstrap.Modal(document.getElementById('appointmentModal'));

    let currentAppointmentId = null;
    let patients = [];

    // Carrega pacientes para o select
    await loadPatients();
    // Carrega atendimentos ao iniciar
    await loadAppointments();

    // Event Listeners
    searchAppointmentsBtn.addEventListener('click', loadAppointments);
    resetAppointmentsBtn.addEventListener('click', resetFilters);
    saveAppointmentBtn.addEventListener('click', saveAppointment);

    // Função para carregar pacientes
    async function loadPatients() {
        try {
            patients = await ApiService.getPatients(null, null, true);
            renderPatientOptions();
        } catch (error) {
            showToast('Erro ao carregar pacientes: ' + error.message, 'danger');
        }
    }

    // Função para renderizar opções de pacientes
    function renderPatientOptions() {
        appointmentPatient.innerHTML = '<option value="">Todos</option>';
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.patientId;
            option.textContent = patient.name;
            appointmentPatient.appendChild(option);
        });
    }

    // Função para carregar atendimentos
    async function loadAppointments() {
        try {
            showLoading(true);
            const start = startDate.value ? new Date(startDate.value) : null;
            const end = endDate.value ? new Date(endDate.value) : null;
            const patientId = appointmentPatient.value || null;
            const isActive = appointmentStatusFilter.value === '' ? null : appointmentStatusFilter.value === 'true';

            const appointments = await ApiService.getAppointments(start, end, patientId, isActive);
            renderAppointments(appointments);
        } catch (error) {
            showToast('Erro ao carregar atendimentos: ' + error.message, 'danger');
        } finally {
            showLoading(false);
        }
    }

    // Função para renderizar atendimentos
    function renderAppointments(appointments) {
        appointmentsTableBody.innerHTML = '';

        if (appointments.length === 0) {
            appointmentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum atendimento encontrado</td></tr>';
            return;
        }

        appointments.forEach(appointment => {
            const patient = patients.find(p => p.patientId === appointment.patientId);
            const patientName = patient ? patient.name : 'Paciente não encontrado';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDateTime(appointment.dateTime)}</td>
                <td>${patientName}</td>
                <td>${appointment.description.substring(0, 50)}${appointment.description.length > 50 ? '...' : ''}</td>
                <td>
                    <span class="badge ${appointment.isActive ? 'bg-success' : 'bg-secondary'}">
                        ${appointment.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td class="text-end table-actions">
                    <button class="btn btn-sm btn-outline-primary edit-appointment" data-id="${appointment.appointmentId}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-appointment" data-id="${appointment.appointmentId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            appointmentsTableBody.appendChild(tr);
        });

        // Adiciona eventos aos botões
        document.querySelectorAll('.edit-appointment').forEach(btn => {
            btn.addEventListener('click', (e) => editAppointment(e.target.closest('button').dataset.id));
        });

        document.querySelectorAll('.delete-appointment').forEach(btn => {
            btn.addEventListener('click', (e) => deleteAppointment(e.target.closest('button').dataset.id));
        });
    }

    // Função para resetar filtros
    function resetFilters() {
        startDate.value = '';
        endDate.value = '';
        appointmentPatient.value = '';
        appointmentStatusFilter.value = '';
        loadAppointments();
    }

    // Função para salvar atendimento
    async function saveAppointment() {
        try {
            if (!appointmentForm.checkValidity()) {
                appointmentForm.classList.add('was-validated');
                return;
            }

            showLoading(true);
            const appointmentData = {
                patientId: document.getElementById('appointmentPatientId').value,
                dateTime: document.getElementById('appointmentDateTime').value,
                description: document.getElementById('appointmentDescription').value,
                isActive: document.getElementById('appointmentStatus').value === 'true'
            };

            if (currentAppointmentId) {
                await ApiService.updateAppointment(currentAppointmentId, appointmentData);
                showToast('Atendimento atualizado com sucesso!', 'success');
            } else {
                await ApiService.createAppointment(appointmentData);
                showToast('Atendimento criado com sucesso!', 'success');
            }

            appointmentModal.hide();
            loadAppointments();
        } catch (error) {
            showToast('Erro ao salvar atendimento: ' + error.message, 'danger');
        } finally {
            showLoading(false);
        }
    }

    // Função para mostrar/ocultar loading
    function showLoading(show) {
        document.getElementById('loadingAppointments').style.display = show ? 'block' : 'none';
    }
});