import { ApiService } from './api.js';
import { formatDate, formatCPF, showToast } from './app.js';
const bootstrap = window.bootstrap || { Modal: class {} };

document.addEventListener('DOMContentLoaded', () => {
    const patientsTableBody = document.getElementById('patientsTableBody');
    const searchBtn = document.getElementById('searchBtn');
    const searchName = document.getElementById('searchName');
    const searchCpf = document.getElementById('searchCpf');
    const searchStatus = document.getElementById('searchStatus');
    const patientForm = document.getElementById('patientForm');
    const savePatientBtn = document.getElementById('savePatientBtn');
    const patientModalEl = document.getElementById('patientModal');
    const patientModal = new bootstrap.Modal(patientModalEl);

    let currentPatientId = null;

    // Carrega pacientes ao iniciar
    loadPatients();

    // Event Listeners
    searchBtn.addEventListener('click', loadPatients);
    savePatientBtn.addEventListener('click', savePatient);

    // Função para carregar pacientes
    async function loadPatients() {
        try {
            showLoading(true);
            const name = searchName.value.trim() || null;
            const cpf = searchCpf.value.trim() || null;
            const isActive = searchStatus.value === '' ? null : searchStatus.value === 'true';

            const patients = await ApiService.getPatients(name, cpf, isActive);
            renderPatients(patients);
        } catch (error) {
            showToast('Erro ao carregar pacientes: ' + error.message, 'danger');
        } finally {
            showLoading(false);
        }
    }

    // Função para renderizar pacientes na tabela
    function renderPatients(patients) {
        patientsTableBody.innerHTML = '';

        if (patients.length === 0) {
            patientsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum paciente encontrado</td></tr>';
            return;
        }

        patients.forEach(patient => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${patient.name}</td>
                <td>${formatCPF(patient.cpf)}</td>
                <td>${formatDate(patient.birthDate)}</td>
                <td>
                    <span class="badge ${patient.isActive ? 'bg-success' : 'bg-secondary'}">
                        ${patient.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td class="text-end table-actions">
                    <button class="btn btn-sm btn-outline-primary edit-patient" data-id="${patient.patientId}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-patient" data-id="${patient.patientId}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <a href="patient-detail.html?id=${patient.patientId}" class="btn btn-sm btn-outline-info">
                        <i class="fas fa-eye"></i>
                    </a>
                </td>
            `;
            patientsTableBody.appendChild(tr);
        });

        // Adiciona eventos aos botões
        document.querySelectorAll('.edit-patient').forEach(btn => {
            btn.addEventListener('click', (e) => editPatient(e.target.closest('button').dataset.id));
        });

        document.querySelectorAll('.delete-patient').forEach(btn => {
            btn.addEventListener('click', (e) => deletePatient(e.target.closest('button').dataset.id));
        });
    }

    // Função para editar paciente
    async function editPatient(id) {
        try {
            showLoading(true);
            currentPatientId = id;
            const patient = await ApiService.getPatient(id);

            document.getElementById('patientModalTitle').textContent = 'Editar Paciente';
            document.getElementById('patientId').value = patient.patientId;
            document.getElementById('name').value = patient.name;
            document.getElementById('birthDate').value = patient.birthDate.split('T')[0];
            document.getElementById('cpf').value = patient.cpf;
            document.getElementById('gender').value = patient.gender;
            document.getElementById('status').value = patient.isActive.toString();
            document.getElementById('cep').value = patient.cep || '';
            document.getElementById('city').value = patient.city || '';
            document.getElementById('district').value = patient.district || '';
            document.getElementById('address').value = patient.address || '';
            document.getElementById('complement').value = patient.complement || '';

            patientModal.show();
        } catch (error) {
            showToast('Erro ao carregar paciente: ' + error.message, 'danger');
        } finally {
            showLoading(false);
        }
    }

    // Função para salvar paciente (criar/editar)
    async function savePatient() {
        try {
            if (!patientForm.checkValidity()) {
                patientForm.classList.add('was-validated');
                return;
            }

            showLoading(true);
            const patientData = {
                name: document.getElementById('name').value,
                birthDate: document.getElementById('birthDate').value,
                cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
                gender: document.getElementById('gender').value,
                isActive: document.getElementById('status').value === 'true',
                cep: document.getElementById('cep').value,
                city: document.getElementById('city').value,
                district: document.getElementById('district').value,
                address: document.getElementById('address').value,
                complement: document.getElementById('complement').value
            };

            if (currentPatientId) {
                await ApiService.updatePatient(currentPatientId, patientData);
                showToast('Paciente atualizado com sucesso!', 'success');
            } else {
                await ApiService.createPatient(patientData);
                showToast('Paciente criado com sucesso!', 'success');
            }

            patientModal.hide();
            loadPatients();
            resetForm();
        } catch (error) {
            showToast('Erro ao salvar paciente: ' + error.message, 'danger');
        } finally {
            showLoading(false);
        }
    }

    // Função para deletar paciente
    async function deletePatient(id) {
        if (!confirm('Tem certeza que deseja inativar este paciente?')) return;

        try {
            showLoading(true);
            await ApiService.deletePatient(id);
            showToast('Paciente inativado com sucesso!', 'success');
            loadPatients();
        } catch (error) {
            showToast('Erro ao inativar paciente: ' + error.message, 'danger');
        } finally {
            showLoading(false);
        }
    }

    // Função para resetar o formulário
    function resetForm() {
        currentPatientId = null;
        patientForm.reset();
        patientForm.classList.remove('was-validated');
        document.getElementById('patientModalTitle').textContent = 'Novo Paciente';
    }

    // Função para mostrar/ocultar loading
    function showLoading(show) {
        document.getElementById('loadingPatients').style.display = show ? 'block' : 'none';
    }
});