using Microsoft.OpenApi.Models;

namespace Education.Infrastructure.Swagger;

public static class Extensions
{
    public static IServiceCollection AddSwaggerService(this IServiceCollection services, Type type,
        string prefixNameProxy,
        Action<IServiceCollection> action = null)
    {
        services.AddSwaggerGen(c =>
        {
            
            c.CustomSchemaIds(x => x.FullName?.Replace("+", "."));
            var xmlFilename = $"{type.Assembly.GetName().Name}.xml";
            c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            c.AddServer(new OpenApiServer
            {
                Url = $"/{prefixNameProxy}"
            });
        });
        action?.Invoke(services);
        return services;
    }

    public static IApplicationBuilder UseSwagger(this WebApplication app)
    {
        SwaggerBuilderExtensions.UseSwagger(app);
        app.UseSwaggerUI();
        app.MapFallback((context) =>
        {
            context.Response.Redirect("/swagger/index.html");
            return context.Response.WriteAsync("");
        });
        return app;
    }
}