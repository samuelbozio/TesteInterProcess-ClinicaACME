using AcmeClinic.API.Models;

namespace AcmeClinic.API.Services
{
    public interface IAppointmentService
    {
        Task<IEnumerable<Appointment>> GetAppointmentsAsync(DateTime? startDate, DateTime? endDate, Guid? patientId, bool? isActive);
        Task<Appointment> GetAppointmentByIdAsync(Guid id);
        Task<Appointment> CreateAppointmentAsync(Appointment appointment);
        Task UpdateAppointmentAsync(Appointment appointment);
        Task DeleteAppointmentAsync(Guid id);
        Task<bool> AppointmentExists(Guid id);
    }
}