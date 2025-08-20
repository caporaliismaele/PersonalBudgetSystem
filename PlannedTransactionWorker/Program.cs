using BudgetApi.Data;
using Microsoft.EntityFrameworkCore;
using PlannedTransactionWorker;
using PlannedTransactionWorker.Services;
using Serilog;

var builder = Host.CreateApplicationBuilder(args);

// 🔧 Connection string dal file di configurazione
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 🧱 Registrazione dei servizi
builder.Services.AddDbContext<BudgetDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<PlannedTransactionService>();
builder.Services.AddHostedService<Worker>();

Log.Logger = new LoggerConfiguration()
    .WriteTo.File(
        path: "Logs/worker-log-.txt", // usa il suffisso per RollingInterval.Day
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level}] {Message}{NewLine}{Exception}"
    )
    .CreateLogger();

// 🚀 Registrazione del Worker
builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
