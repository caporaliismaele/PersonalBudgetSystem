using BudgetApi.Data;
using BudgetApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 🔧 CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:59506", "https://localhost:59506")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 🔧 Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔧 DbContext
builder.Services.AddDbContext<BudgetDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 🔧 Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<BudgetDbContext>()
    .AddDefaultTokenProviders();

// 🔧 Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "JwtBearer";
    options.DefaultChallengeScheme = "JwtBearer";
})
.AddJwtBearer("JwtBearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// 🔧 Filtro personalizzato per ModelState
builder.Services.AddScoped<ModelStateLoggerFilter>();

// 🔧 Controllers con filtro registrato come servizio
builder.Services.AddControllers(options =>
{
    options.Filters.AddService<ModelStateLoggerFilter>();
});

// 🔧 HTTPS + HTTP
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5022); // HTTP
    options.ListenLocalhost(7163, listenOptions =>
    {
        listenOptions.UseHttps();
    });
});

var app = builder.Build();

// ✅ Attiva Swagger
app.UseSwagger();
app.UseSwaggerUI();

// ✅ CORS prima di tutto
app.UseCors("AllowReactApp");

// ✅ Pipeline
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
