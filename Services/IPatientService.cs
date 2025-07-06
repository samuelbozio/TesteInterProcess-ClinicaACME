using AcmeClinic.API.Models;

namespace AcmeClinic.API.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetPatientsAsync(string? name, string? cpf, bool? isActive);
        Task<Patient> GetPatientByIdAsync(int id);
        Task<IEnumerable<Appointment>> GetPatientAppointmentsAsync(int patientId); // Add this line
        Task<Patient> CreatePatientAsync(Patient patient);
        Task UpdatePatientAsync(Patient patient);
        Task DeletePatientAsync(int id);
        Task<bool> PatientExists(int id);
        Task<bool> CpfExists(string cpf, int? id = null);
    }
}