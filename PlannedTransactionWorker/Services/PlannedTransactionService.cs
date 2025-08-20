using BudgetApi.Data;
using BudgetApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;


namespace PlannedTransactionWorker.Services
{
    public class PlannedTransactionService
    {
        private readonly BudgetDbContext _context;
        private readonly ILogger<PlannedTransactionService> _logger;

        public PlannedTransactionService(BudgetDbContext context, ILogger<PlannedTransactionService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task ExecutePlannedTransactionsForDateAsync(DateTime date, CancellationToken cancellationToken)
        {
            var allCandidates = await _context.PlannedTransactions
                .Where(t => t.StartDate.Date <= date.Date)
                .ToListAsync(cancellationToken); 

            var transactions = allCandidates
                .Where(t => GetSafeScheduledDate(t.DayOfMonth, date).Date == date.Date)
                .ToList(); 



            foreach (var planned in transactions)
            {
                var alreadyExecuted = await _context.Transactions
                    .AnyAsync(t => t.PlannedTransactionId == planned.Id && t.Date.Date == date.Date, cancellationToken);

                if (alreadyExecuted)
                {
                    _logger.LogInformation($"Transazione già eseguita per PlannedTransaction ID {planned.Id} il {date:dd/MM/yyyy}");
                    continue;
                }

                var newTransaction = new Transaction
                {
                    Description = planned.Description,
                    Amount = planned.Amount,
                    Category = planned.Category,
                    Date = date,
                    Type = planned.Type,
                    UserId = planned.UserId,
                    PlannedTransactionId = planned.Id
                };

                _context.Transactions.Add(newTransaction);

                var logMessage = $"✅ Creata transazione da PlannedTransaction ID {planned.Id} per il giorno {date:dd/MM/yyyy}";
                Console.WriteLine(logMessage);
                _logger.LogInformation(logMessage);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }



        private DateTime GetSafeScheduledDate(int dayOfMonth, DateTime referenceDate)
        {
            var daysInMonth = DateTime.DaysInMonth(referenceDate.Year, referenceDate.Month);
            var safeDay = Math.Min(dayOfMonth, daysInMonth);
            return new DateTime(referenceDate.Year, referenceDate.Month, safeDay);
        }


    }
}
