using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AcmeClinic.API.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }

        [Required]
        public int PatientId { get; set; }
        [JsonIgnore]
        public Patient? Patient { get; set; }

        [Required(ErrorMessage = "Data e hora são obrigatórias")]
        public DateTime DateTime { get; set; }

        [Required(ErrorMessage = "Descrição é obrigatória")]
        public string Description { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;
    }
}