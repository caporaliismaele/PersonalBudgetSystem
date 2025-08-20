using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PlannedTransactionWorker.Services;
using System;
using System.Threading;
using System.Threading.Tasks;
using static PlannedTransactionWorker.Class.WorkerState;
using Serilog;
using Serilog.Sinks.File;
using Serilog.Extensions.Hosting;



namespace PlannedTransactionWorker
{
    public class Worker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<Worker> _logger;

        public Worker(IServiceScopeFactory scopeFactory, ILogger<Worker> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {


            while (!stoppingToken.IsCancellationRequested)
            {




                try
                {
                    var lastRun = WorkerStateManager.Load().LastRunDate;
                    var today = DateTime.Today;

                    using var scope = _scopeFactory.CreateScope();
                    var service = scope.ServiceProvider.GetRequiredService<PlannedTransactionService>();

                    for (var date = lastRun.AddDays(1); date <= today; date = date.AddDays(1))
                    {
                        await service.ExecutePlannedTransactionsForDateAsync(date, stoppingToken);
                    }

                    // ✅ Esegui anche il giorno corrente ogni minuto
                    await service.ExecutePlannedTransactionsForDateAsync(today, stoppingToken);


                    WorkerStateManager.Save(today);

                    Log.Information("Transazioni pianificate eseguite correttamente.");

                }
                catch (Exception ex)
                {
                    Log.Fatal(ex, "Errore durante l'esecuzione del worker.");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
        /*taskkill /PID 25576 /F*/


    }
}
