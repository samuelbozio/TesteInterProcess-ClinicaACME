using System.ComponentModel.DataAnnotations;

namespace AcmeClinic.API.Models
{
    public class Appointment
    {
        [Key]
        public Guid AppointmentId { get; set; }

        [Required]
        public Guid PatientId { get; set; }
        public Patient Patient { get; set; }

        [Required(ErrorMessage = "Data e hora são obrigatórias")]
        public DateTime DateTime { get; set; }

        [Required(ErrorMessage = "Descrição é obrigatória")]
        public string Description { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;
    }
}