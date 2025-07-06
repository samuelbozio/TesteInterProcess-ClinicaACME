using AcmeClinic.API.Data;
using AcmeClinic.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AcmeClinic.API.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AcmeClinicContext _context;
        private readonly IPatientService _patientService;

        public AppointmentService(AcmeClinicContext context, IPatientService patientService)
        {
            _context = context;
            _patientService = patientService;
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsAsync(
            DateTime? startDate,
            DateTime? endDate,
            int? patientId,
            bool? isActive)
        {
            var query = _context.Appointments
                .Include(a => a.Patient)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(a => a.DateTime >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(a => a.DateTime <= endDate.Value);

            if (patientId.HasValue)
                query = query.Where(a => a.PatientId == patientId.Value);

            if (isActive.HasValue)
                query = query.Where(a => a.IsActive == isActive.Value);

            return await query.ToListAsync();
        }

        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);
        }

        public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
        {
            // Valida se o paciente existe e está ativo
            var patient = await _patientService.GetPatientByIdAsync(appointment.PatientId);
            if (patient == null || !patient.IsActive)
            {
                throw new Exception("Paciente não encontrado ou inativo");
            }

            // Valida se a data/hora não está no futuro
            if (appointment.DateTime > DateTime.Now)
            {
                throw new Exception("Não é possível agendar atendimentos com data futura");
            }

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task UpdateAppointmentAsync(Appointment appointment)
        {

            if (appointment.DateTime > DateTime.Now)
            {
                throw new Exception("Não é possível agendar atendimentos com data futura");
            }

            _context.Entry(appointment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment != null)
            {
                appointment.IsActive = false;
                await UpdateAppointmentAsync(appointment);
            }
        }

        public async Task<bool> AppointmentExists(int id)
        {
            return await _context.Appointments.AnyAsync(e => e.AppointmentId == id);
        }
    }
}