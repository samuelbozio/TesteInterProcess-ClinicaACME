using System.ComponentModel.DataAnnotations;

namespace AcmeClinic.API.DTOs
{
    public class AppointmentDTO
    {
        public Guid AppointmentId { get; set; }

        [Required(ErrorMessage = "Paciente é obrigatório")]
        public Guid PatientId { get; set; }

        [Required(ErrorMessage = "Data e hora são obrigatórias")]
        public DateTime DateTime { get; set; }

        [Required(ErrorMessage = "Descrição é obrigatória")]
        public string Description { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;
    }
}