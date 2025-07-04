using Microsoft.EntityFrameworkCore;
using AcmeClinic.API.Models;

namespace AcmeClinic.API.Data
{
    public class AcmeClinicContext : DbContext
    {
        public AcmeClinicContext(DbContextOptions<AcmeClinicContext> options) : base(options)
        {
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuração para evitar CPF duplicado
            modelBuilder.Entity<Patient>()
                .HasIndex(p => p.CPF)
                .IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}