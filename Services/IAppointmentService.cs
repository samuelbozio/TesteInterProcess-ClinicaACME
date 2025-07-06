using AcmeClinic.API.Models;

namespace AcmeClinic.API.Services
{
    public interface IAppointmentService
    {
        Task<IEnumerable<Appointment>> GetAppointmentsAsync(DateTime? startDate, DateTime? endDate, int? patientId, bool? isActive);
        Task<Appointment> GetAppointmentByIdAsync(int id);
        Task<Appointment> CreateAppointmentAsync(Appointment appointment);
        Task UpdateAppointmentAsync(Appointment appointment);
        Task DeleteAppointmentAsync(int id);
        Task<bool> AppointmentExists(int id);
    }
}