using BudgetApi.Models; 
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;


namespace BudgetApi.Data
{
    public class BudgetDbContext : IdentityDbContext<User>
    {
        public BudgetDbContext(DbContextOptions<BudgetDbContext> options) : base(options) { }

        public DbSet<Transaction> Transactions { get; set; }
        // Aggiungi altre entità qui
        public DbSet<User> Users { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<PlannedTransaction> PlannedTransactions { get; set; }
    }
}
