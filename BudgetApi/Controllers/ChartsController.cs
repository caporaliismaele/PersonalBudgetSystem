using BudgetApi.Data;
using BudgetApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/charts")]
[Authorize] // Solo utenti loggati
public class ChartsController : ControllerBase
{
    private readonly BudgetDbContext _context;
    private readonly UserManager<User> _userManager;

    public ChartsController(BudgetDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // 🔹 1. Cashflow: entrate e uscite ultimi 12 mesi
    [HttpGet("cashflow")]
    public async Task<IActionResult> GetCashflow()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var now = DateTime.Now;
        var startDate = now.AddMonths(-11); // ultimi 12 mesi inclusi

        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId && t.Date >= new DateTime(startDate.Year, startDate.Month, 1))
            .ToListAsync();

        var result = Enumerable.Range(0, 12)
            .Select(i =>
            {
                var month = startDate.AddMonths(i);
                var monthTransactions = transactions
                    .Where(t => t.Date.Year == month.Year && t.Date.Month == month.Month);

                var income = monthTransactions
                    .Where(t => t.Type == "Income")
                    .Sum(t => t.Amount);

                var expense = monthTransactions
                    .Where(t => t.Type == "Expense")
                    .Sum(t => t.Amount);

                return new
                {
                    Month = month.ToString("MMM yyyy"),
                    Cashflow = income - expense
                };
            })
            .ToList();

        return Ok(result);
    }


    // 🔹 2. Balance: saldo mese per mese
    [HttpGet("balance")]
    public async Task<IActionResult> GetBalance()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var now = DateTime.Now;
        var startDate = new DateTime(now.Year, now.Month, 1).AddMonths(-11); 

        // 🔹 Calcolo del saldo iniziale prima del periodo
        var initialTransactions = await _context.Transactions
            .Where(t => t.UserId == userId && t.Date < startDate)
            .ToListAsync();

        decimal cumulative = initialTransactions
            .Where(t => t.Type == "Income").Sum(t => t.Amount)
            - initialTransactions.Where(t => t.Type == "Expense").Sum(t => t.Amount);

        // 🔹 Transazioni nel periodo da visualizzare
        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId && t.Date >= startDate)
            .OrderBy(t => t.Date)
            .ToListAsync();

        var result = Enumerable.Range(0, 12)
            .Select(i =>
            {
                var month = startDate.AddMonths(i);
                var monthTransactions = transactions
                    .Where(t => t.Date.Year == month.Year && t.Date.Month == month.Month);

                cumulative += monthTransactions
                    .Where(t => t.Type == "Income").Sum(t => t.Amount);
                cumulative -= monthTransactions
                    .Where(t => t.Type == "Expense").Sum(t => t.Amount);

                return new
                {
                    Month = month.ToString("MMM yyyy"),
                    Balance = cumulative
                };
            })
            .ToList();

        return Ok(result);
    }


    // 🔹 3. Stats per categoria per tipo (Income o Expense) nel mese corrente
    [HttpGet("statsForType/{type}")]
    public async Task<IActionResult> GetStatsForType(string type)
    {
        if (type != "Income" && type != "Expense") return BadRequest("Invalid type");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var now = DateTime.Now;

        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId && t.Type == type && t.Date.Year == now.Year && t.Date.Month == now.Month)
            .ToListAsync();

        var grouped = transactions
            .GroupBy(t => t.Category)
            .Select(g => new { Category = g.Key, Amount = g.Sum(t => t.Amount) })
            .ToList();

        return Ok(grouped);
    }
}
