using Microsoft.AspNetCore.Mvc;
using AcmeClinic.API.Models;
using AcmeClinic.API.Services;
using System.ComponentModel.DataAnnotations;

namespace AcmeClinic.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientsController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients(
            [FromQuery] string? name,
            [FromQuery] string? cpf,
            [FromQuery] bool? isActive)
        {
            var patients = await _patientService.GetPatientsAsync(name, cpf, isActive);
            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, Patient patient)
        {
            if (id != patient.PatientId)
            {
                return BadRequest();
            }

            if (await _patientService.CpfExists(patient.CPF, id))
            {
                return BadRequest("CPF já cadastrado para outro paciente");
            }

            try
            {
                await _patientService.UpdatePatientAsync(patient);
            }
            catch (Exception)
            {
                if (!await _patientService.PatientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(Patient patient)
        {
            if (await _patientService.CpfExists(patient.CPF))
            {
                return BadRequest("CPF já cadastrado");
            }

            await _patientService.CreatePatientAsync(patient);

            return CreatedAtAction("GetPatient", new { id = patient.PatientId }, patient);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            await _patientService.DeletePatientAsync(id);
            return NoContent();
        }

        [HttpGet("{id}/appointments")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetPatientAppointments(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            var appointments = await _patientService.GetPatientAppointmentsAsync(id);
            return Ok(appointments);
        }
    }
}