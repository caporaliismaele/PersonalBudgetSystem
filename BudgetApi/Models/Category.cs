using System.ComponentModel.DataAnnotations;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }          // es: "Food"
    public string Type { get; set; }          // "Income" o "Expense"
    public string UserId { get; set; }        // riferimento all'utente
}

