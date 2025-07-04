using AcmeClinic.API.Models;

namespace AcmeClinic.API.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetPatientsAsync(string? name, string? cpf, bool? isActive);
        Task<Patient> GetPatientByIdAsync(Guid id);
        Task<IEnumerable<Appointment>> GetPatientAppointmentsAsync(Guid patientId); // Add this line
        Task<Patient> CreatePatientAsync(Patient patient);
        Task UpdatePatientAsync(Patient patient);
        Task DeletePatientAsync(Guid id);
        Task<bool> PatientExists(Guid id);
        Task<bool> CpfExists(string cpf, Guid? id = null);
    }
}