using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

public class ModelStateLoggerFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            foreach (var kvp in context.ModelState)
            {
                foreach (var error in kvp.Value.Errors)
                {
                    Console.WriteLine($"❌ Errore su '{kvp.Key}': {error.ErrorMessage}");
                }
            }

            // Puoi anche restituire direttamente un BadRequest con dettagli
            context.Result = new BadRequestObjectResult(context.ModelState);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // Non serve fare nulla qui per il tuo caso
    }
}
