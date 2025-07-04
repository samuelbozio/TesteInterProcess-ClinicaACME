using System.ComponentModel.DataAnnotations;

namespace AcmeClinic.API.Models
{
    public class Patient
    {
        [Key]
        public Guid PatientId { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome não pode exceder 100 caracteres")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Data de nascimento é obrigatória")]
        public DateTime BirthDate { get; set; }

        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 caracteres")]
        public string CPF { get; set; }

        [Required(ErrorMessage = "Sexo é obrigatório")]
        public string Gender { get; set; } // M, F ou Outro

        // Endereço
        public string? CEP { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Address { get; set; }
        public string? Complement { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        public ICollection<Appointment> Appointments { get; set; }
    }
}