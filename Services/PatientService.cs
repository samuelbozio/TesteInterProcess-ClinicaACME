using AcmeClinic.API.Data;
using AcmeClinic.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AcmeClinic.API.Services
{
    public class PatientService : IPatientService
    {
        private readonly AcmeClinicContext _context;
        private readonly IPatientService _patientService;

        public PatientService(AcmeClinicContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetPatientsAsync(string? name, string? cpf, bool? isActive)
        {
            var query = _context.Patients.AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(p => p.Name.Contains(name));

            if (!string.IsNullOrEmpty(cpf))
                query = query.Where(p => p.CPF.Contains(cpf));

            if (isActive.HasValue)
                query = query.Where(p => p.IsActive == isActive.Value);

            return await query.ToListAsync();
        }

        public async Task<Patient?> GetPatientByIdAsync(int id)
        {
            return await _context.Patients.FindAsync(id);
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task UpdatePatientAsync(Patient patient)
        {
            var existing = await _context.Patients.FindAsync(patient.PatientId);
            if (existing == null)
                throw new InvalidOperationException("Paciente não encontrado");

            // Mapeia manualmente os campos permitidos
            existing.Name = patient.Name;
            existing.BirthDate = patient.BirthDate;
            existing.CPF = patient.CPF;
            existing.Gender = patient.Gender;
            existing.CEP = patient.CEP;
            existing.City = patient.City;
            existing.District = patient.District;
            existing.Address = patient.Address;
            existing.Complement = patient.Complement;
            existing.IsActive = patient.IsActive;

            await _context.SaveChangesAsync();
        }

        public async Task DeletePatientAsync(int id)
        {
            // Acesse o contexto diretamente, não através do próprio serviço
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                throw new KeyNotFoundException("Paciente não encontrado");

            if (!patient.IsActive)
                throw new InvalidOperationException("Paciente já está inativo");

            // Faça a inativação diretamente
            patient.IsActive = false;


            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
        }



        public async Task<bool> PatientExists(int id)
        {
            return await _context.Patients.AnyAsync(p => p.PatientId == id);
        }

        public async Task<bool> CpfExists(string cpf, int? id = null)
        {
            if (id.HasValue)
                return await _context.Patients.AnyAsync(p => p.CPF == cpf && p.PatientId != id.Value);

            return await _context.Patients.AnyAsync(p => p.CPF == cpf);
        }

        public async Task<IEnumerable<Appointment>> GetPatientAppointmentsAsync(int patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId && a.IsActive)
                .ToListAsync();
        }
    }
}
