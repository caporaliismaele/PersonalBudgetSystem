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
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

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
    public async Task<IActionResult> CreatePlannedTransaction([FromBody] PlannedTransaction pt)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        pt.UserId = userId; // associa automaticamente all'utente loggato

        _context.PlannedTransactions.Add(pt);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUserPlannedTransactions), new { id = pt.Id }, pt);
    }

    // DELETE: api/plannedtransaction/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlannedTransaction(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        var pt = await _context.PlannedTransactions.FindAsync(id);

        if (pt == null || pt.UserId != userId)
            return NotFound();

        _context.PlannedTransactions.Remove(pt);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
