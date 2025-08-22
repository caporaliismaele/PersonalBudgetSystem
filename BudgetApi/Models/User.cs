using Microsoft.AspNetCore.Identity;

namespace BudgetApi.Models
{
    public class User : IdentityUser
    {
        public DateTime CreatedAt { get; set; }
    }

}
