using Microsoft.EntityFrameworkCore;
using AcmeClinic.API.Data;
using AcmeClinic.API.Services;
using System.ComponentModel.DataAnnotations;

var builder = WebApplication.CreateBuilder(args);

// Adiciona controladores
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura SQLite (altere o nome do arquivo se quiser)
builder.Services.AddDbContext<AcmeClinicContext>(options =>
    options.UseSqlite("Data Source=acmeclinic.db"));

// Registro de serviços
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();

// Configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()    // ou .WithOrigins("http://localhost:3000") se quiser restringir
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Swagger só em desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

// 🟡 Middleware de CORS deve vir depois de UseRouting e antes de UseAuthorization
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
