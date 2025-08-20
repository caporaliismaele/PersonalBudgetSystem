using Microsoft.AspNetCore.Identity;

namespace BudgetApi.Models
{
    public class User : IdentityUser
    {
        public int Id { get; set; }
        
        //username ereditato da identity user
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
