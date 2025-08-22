namespace BudgetApi.Models
{
    public class PlannedTransaction
    {
        public int Id { get; set; }

        public decimal Amount { get; set; }
        public string Type { get; set; } // "Income" o "Expense"
        public int DayOfMonth { get; set; } // Giorno del mese della ricorrenza
        public DateTime StartDate { get; set; } = DateTime.Now;


        public string Category { get; set; }

        public string Description { get; set; }

        public string UserId { get; set; }



    }



}
