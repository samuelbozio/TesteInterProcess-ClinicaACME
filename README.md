Clínica ACME - Sistema de Gerenciamento de Pacientes e Atendimentos
Sistema web para gerenciamento de pacientes e atendimentos, desenvolvido com backend em ASP.NET Core e frontend em Bootstrap, para facilitar o cadastro, edição e visualização dos dados clínicos e históricos de atendimento.

Tecnologias Utilizadas
Backend
.NET 6 / ASP.NET Core Web API

Entity Framework Core com SQLite (banco de dados embutido)

Migrations para versionamento e controle do esquema do banco de dados

Frontend
Bootstrap 5

HTML5 / CSS3

JavaScript (Vanilla)

Funcionalidades Principais
Visualização da lista de pacientes cadastrados

Cadastro e edição de pacientes

Visualização dos detalhes de cada paciente, incluindo seus atendimentos ativos

Visualização da lista de atendimentos ativos

Cadastro e edição de atendimentos

Telas do Sistema
1. Visualização dos Pacientes Cadastrados
![{C13D6206-B2A0-45D4-AD97-B968A5090D2E}](https://github.com/user-attachments/assets/fd943895-b1d2-42b2-839f-6ec4365688fa)

2. Novo Cadastro / Edição de Paciente
![{9377E9A7-C467-4C4D-80FB-8769CFB17A59}](https://github.com/user-attachments/assets/832b4c41-2c5d-45c3-8bb1-e596f4485a9d)

3. Detalhes do Paciente com Atendimentos Ativos
![{3968F916-4365-4E4C-A2FB-77CF3D227B0F}](https://github.com/user-attachments/assets/29e1b1eb-acf9-46b4-8127-3db58f6cd991)

4. Visualização dos Atendimentos Ativos
![{9BD15F7F-00C5-467B-8213-FD4EA89B2AE6}](https://github.com/user-attachments/assets/045c1799-1fac-478a-b5d6-eda6931035a6)

5. Novo Cadastro / Edição de Atendimento
![{534896D0-B84C-4514-85EB-91EAC4E0F9FA}](https://github.com/user-attachments/assets/43d3423c-c01d-4344-9b4a-e3cbfdc1cfa7)

Como Rodar o Projeto
Clone o repositório:

bash
Copiar
Editar
git clone https://github.com/seuusuario/nome-do-repositorio.git
cd nome-do-repositorio
Restaure as dependências e execute as migrações do Entity Framework:

bash
Copiar
Editar
dotnet restore
dotnet ef database update
Execute a API:

bash
Copiar
Editar
dotnet run --project Backend/ClinicaACME.Api
Abra o arquivo index.html do frontend no seu navegador ou configure um servidor local para o frontend.

Estrutura do Projeto
/Backend — Projeto ASP.NET Core com API REST e EF Core

/Frontend — HTML, CSS e JavaScript com Bootstrap para interface do usuário
