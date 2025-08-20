namespace BudgetApi.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; } // "Income" or "Expense"

        public int UserId { get; set; }

        public int? PlannedTransactionId { get; set; }
    }

}
