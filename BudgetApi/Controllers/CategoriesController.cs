using BudgetApi.Data;
using BudgetApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly BudgetDbContext _context;
    private readonly UserManager<User> _userManager;


    public CategoriesController(BudgetDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories([FromQuery] string? type)
    {
        var userId = _userManager.GetUserId(User);

        var query = _context.Categories
            .Where(c => c.UserId == userId)
            .AsQueryable();

        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(c => c.Type == type);
        }

        return await query.OrderBy(c => c.Name).ToListAsync();
    }



    [HttpPost]
    public async Task<IActionResult> AddCategory([FromBody] CategoryCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = _userManager.GetUserId(User);

        var category = new Category
        {
            Name = dto.Name,
            Type = dto.Type,
            UserId = userId
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(category);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var userId = _userManager.GetUserId(User);
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (category == null) return NotFound();

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
public class CategoryCreateDto
{
    [Required]
    public string Name { get; set; }

    [Required]
    public string Type { get; set; } // "Income" o "Expense"
}

