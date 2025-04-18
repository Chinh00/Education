using Education.Infrastructure.Validation;
using Newtonsoft.Json;
namespace Education.Infrastructure.Exception;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next.Invoke(context);
        }
        catch (System.Exception e)
        {
            if (e is ValidationException ve)
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = ve.ValidationModel.StatusCode;
                await context.Response.WriteAsync(JsonConvert.SerializeObject(ve.ValidationModel));
            }
            else
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;
                await context.Response.WriteAsync(JsonConvert.SerializeObject(e));
            }
        }
    }
}