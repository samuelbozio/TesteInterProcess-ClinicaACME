using AcmeClinic.API.Data;
using AcmeClinic.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AcmeClinic.API.Services
{
    public class PatientService : IPatientService
    {
        private readonly AcmeClinicContext _context;

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

        public async Task<Patient> GetPatientByIdAsync(Guid id)
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
            _context.Entry(patient).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeletePatientAsync(Guid id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient != null)
            {
                patient.IsActive = false;
                await UpdatePatientAsync(patient);
            }
        }

        public async Task<bool> PatientExists(Guid id)
        {
            return await _context.Patients.AnyAsync(e => e.PatientId == id);
        }

        public async Task<bool> CpfExists(string cpf, Guid? id = null)
        {
            if (id.HasValue)
                return await _context.Patients.AnyAsync(p => p.CPF == cpf && p.PatientId != id.Value);

            return await _context.Patients.AnyAsync(p => p.CPF == cpf);
        }

        public async Task<IEnumerable<Appointment>> GetPatientAppointmentsAsync(Guid patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId && a.IsActive)
                .ToListAsync();
        }
    }


}