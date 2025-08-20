using BudgetApi.Data;
using BudgetApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BudgetApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly BudgetDbContext _context;

        public TransactionsController(BudgetDbContext context)
        {
            _context = context;
        }

        // GET: api/transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions(
            [FromQuery] string? type,
            [FromQuery] string? category,
            [FromQuery] DateTime? date)
        {
            // Prendi l'ID dell'utente dal token JWT
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var query = _context.Transactions
                .Where(t => t.UserId == userId)
                .AsQueryable();

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(t => t.Type == type);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(t => t.Category == category);
            }

            if (date.HasValue)
            {
                query = query.Where(t => t.Date >= date.Value.Date);
            }

            return await query.OrderByDescending(t => t.Date).ToListAsync();
        }

        // POST: api/transactions
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction([FromBody] Transaction transaction)
        {
            // Prendi l'ID dell'utente dal token JWT
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            transaction.UserId = userId;
            transaction.Date = transaction.Date == default ? DateTime.UtcNow : transaction.Date;

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransactions), new { id = transaction.Id }, transaction);
        }

        // DELETE: api/transactions/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/transactions/balance
        [HttpGet("balance")]
        public async Task<ActionResult<decimal>> GetBalance()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var income = await _context.Transactions
                .Where(t => t.Type == "Income" && t.UserId == userId)
                .SumAsync(t => t.Amount);

            var expense = await _context.Transactions
                .Where(t => t.Type == "Expense" && t.UserId == userId)
                .SumAsync(t => t.Amount);

            var balance = income - expense;

            return Ok(balance);
        }
    }
}
