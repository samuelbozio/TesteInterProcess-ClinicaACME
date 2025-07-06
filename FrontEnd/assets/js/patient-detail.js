import { ApiService } from './api.js';
import { formatDate, formatCPF, showToast } from './app.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');

    if (!patientId) {
        window.location.href = 'patients.html';
        return;
    }

    const patientName = document.getElementById('patientName');
    const patientCpf = document.getElementById('patientCpf');
    const patientBirthDate = document.getElementById('patientBirthDate');
    const patientGender = document.getElementById('patientGender');
    const patientStatus = document.getElementById('patientStatus');
    const patientCep = document.getElementById('patientCep');
    const patientAddress = document.getElementById('patientAddress');
    const patientDistrict = document.getElementById('patientDistrict');
    const patientCity = document.getElementById('patientCity');
    const patientComplement = document.getElementById('patientComplement');
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');
    const newAppointmentBtn = document.getElementById('newAppointmentBtn');
    const appointmentForm = document.getElementById('appointmentForm');
    const saveAppointmentBtn = document.getElementById('saveAppointmentBtn');
    const appointmentModal = new bootstrap.Modal(document.getElementById('appointmentModal'));

    let currentAppointmentId = null;

    await loadPatientData(patientId);
    await loadAppointments(patientId);

    newAppointmentBtn.addEventListener('click', () => {
        currentAppointmentId = null;
        document.getElementById('appointmentModalTitle').textContent = 'Novo Atendimento';
        document.getElementById('appointmentPatientId').value = patientId;
        appointmentForm.reset();
        appointmentModal.show();
    });

    saveAppointmentBtn.addEventListener('click', () => saveAppointment(patientId));

    async function loadPatientData(id) {
        try {
            showLoading(true);
            const patient = await ApiService.getPatient(id);

            patientName.textContent = patient.name;
            patientCpf.textContent = formatCPF(patient.cpf);
            patientBirthDate.textContent = formatDate(patient.birthDate);
            patientGender.textContent = getGenderDescription(patient.gender);
            patientStatus.innerHTML = `<span class="badge ${patient.isActive ? 'bg-success' : 'bg-secondary'}">${patient.isActive ? 'Ativo' : 'Inativo'}</span>`;

            patientCep.textContent = patient.cep || 'Não informado';
            patientAddress.textContent = patient.address || 'Não informado';
            patientDistrict.textContent = patient.district || 'Não informado';
            patientCity.textContent = patient.city || 'Não informado';
            patientComplement.textContent = patient.complement || 'Não informado';
        } catch (error) {
            showToast('Erro ao carregar paciente: ' + error.message, 'danger');
            window.location.href = 'patients.html';
        } finally {
            showLoading(false);
        }
    }

    async function loadAppointments(patientId) {
        try {
            showLoading(true, 'appointments');
            const appointments = await ApiService.getPatientAppointments(patientId);
            renderAppointments(appointments);
        } catch (error) {
            showToast('Erro ao carregar atendimentos: ' + error.message, 'danger');
        } finally {
            showLoading(false, 'appointments');
        }
    }

    function renderAppointments(appointments) {
        appointmentsTableBody.innerHTML = '';

        if (appointments.length === 0) {
            appointmentsTableBody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum atendimento encontrado</td></tr>';
            return;
        }

        appointments.forEach(appointment => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDateTime(appointment.dateTime)}</td>
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

        document.querySelectorAll('.edit-appointment').forEach(btn => {
            btn.addEventListener('click', (e) => editAppointment(e.target.closest('button').dataset.id));
        });

        document.querySelectorAll('.delete-appointment').forEach(btn => {
            btn.addEventListener('click', (e) => deleteAppointment(e.target.closest('button').dataset.id));
        });
    }

    async function saveAppointment(patientId) {
        try {
            if (!appointmentForm.checkValidity()) {
                appointmentForm.classList.add('was-validated');
                return;
            }

            showLoading(true, 'appointments');
            const appointmentData = {
                appointmentId: currentAppointmentId,
                patientId: patientId,
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
            loadAppointments(patientId);
        } catch (error) {
            showToast('Erro ao salvar atendimento: Verifique as informaçõpes e se a data está correta');
        } finally {
            showLoading(false, 'appointments');
        }
    }

    async function editAppointment(id) {
        try {
            showLoading(true, 'appointments');
            currentAppointmentId = id;
            const appointment = await ApiService.getAppointmentById(id);

            document.getElementById('appointmentModalTitle').textContent = 'Editar Atendimento';
            document.getElementById('appointmentId').value = appointment.appointmentId;
            document.getElementById('appointmentPatientId').value = appointment.patientId;

            const date = new Date(appointment.dateTime);
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const localISOTime = new Date(date - timezoneOffset).toISOString().slice(0, 16);

            document.getElementById('appointmentDateTime').value = localISOTime;
            document.getElementById('appointmentDescription').value = appointment.description;
            document.getElementById('appointmentStatus').value = appointment.isActive.toString();

            appointmentModal.show();
        } catch (error) {
            showToast('Erro ao carregar atendimento: ' + error.message, 'danger');
        } finally {
            showLoading(false, 'appointments');
        }
    }

    async function deleteAppointment(id) {
        if (!confirm('Tem certeza que deseja inativar este atendimento?')) return;

        try {
            showLoading(true, 'appointments');
            await ApiService.deleteAppointment(id);
            showToast('Atendimento inativado com sucesso!', 'success');
            loadAppointments(patientId);
        } catch (error) {
            showToast('Erro ao inativar atendimento: ' + error.message, 'danger');
        } finally {
            showLoading(false, 'appointments');
        }
    }

    function getGenderDescription(gender) {
        switch (gender) {
            case 'M': return 'Masculino';
            case 'F': return 'Feminino';
            default: return 'Outro';
        }
    }

    function formatDateTime(dateTimeString) {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleString('pt-BR');
    }

    function showLoading(show, type = 'patient') {
        document.getElementById(`loading${type.charAt(0).toUpperCase() + type.slice(1)}`).style.display = show ? 'block' : 'none';
    }
});