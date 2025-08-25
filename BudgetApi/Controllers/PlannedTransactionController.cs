using BudgetApi.Data;
using BudgetApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize] // obbliga l'autenticazione
public class PlannedTransactionController : ControllerBase
{
    private readonly BudgetDbContext _context;

    public PlannedTransactionController(BudgetDbContext context)
    {
        _context = context;
    }

    // GET: api/plannedtransaction
    [HttpGet]
    public async Task<IActionResult> GetUserPlannedTransactions(
    [FromQuery] string? type,
    [FromQuery] string? category)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var query = _context.PlannedTransactions
            .Where(pt => pt.UserId == userId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(pt => pt.Type == type);
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(pt => pt.Category == category);
        }

        var result = await query
            .OrderByDescending(pt => pt.StartDate)
            .ToListAsync();

        return Ok(result);
    }


    // POST: api/plannedtransaction
    [HttpPost]
    public async Task<IActionResult> CreatePlannedTransaction([FromBody] PlannedTransactionCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var pt = new PlannedTransaction
        {
            Description = dto.Description,
            Amount = dto.Amount,
            Category = dto.Category,
            StartDate =  DateTime.UtcNow,
            Type = dto.Type,
            DayOfMonth = dto.DayOfMonth,
            UserId = userId // associa automaticamente all'utente loggato
        };

        _context.PlannedTransactions.Add(pt);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUserPlannedTransactions), new { id = pt.Id }, pt);
    }


    // DELETE: api/plannedtransaction/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlannedTransaction(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var pt = await _context.PlannedTransactions.FindAsync(id);

        if (pt == null || pt.UserId != userId)
            return NotFound();

        _context.PlannedTransactions.Remove(pt);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("income-expense-ratio")]
    public async Task<ActionResult<decimal>> GetIncomeExpenseRatio()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Prendi solo le transazioni reali dell'utente
        var userTransactions = await _context.Transactions
            .Where(t => t.UserId == userId)
            .ToListAsync();

        if (!userTransactions.Any())
            return Ok(0m); // niente transazioni, ritorna 0

        var totalIncome = userTransactions
            .Where(t => t.Type == "Income")
            .Sum(t => t.Amount);

        var totalExpense = userTransactions
            .Where(t => t.Type == "Expense")
            .Sum(t => t.Amount);

        // Evita divisione per zero
        var ratio = totalExpense == 0 ? totalIncome : totalIncome / totalExpense;

        return Ok(Math.Round(ratio, 2));
    }

}
public class PlannedTransactionCreateDto
{
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public string Category { get; set; }

    public string Type { get; set; } 
    public int DayOfMonth { get; set; } 
}

