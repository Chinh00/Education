using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Education.Infrastructure.Authentication;

public static class Extensions
{
    private const string Cors = "CorsPolicy";
    
    public static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration configuration,
        Action<IServiceCollection> action = null)
    {
        services.AddCors(c => c.AddPolicy(Cors, builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }));
        services.AddAuthentication().AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
        {
            options.Authority = configuration.GetValue<string>("IdentityServer:Url");
            options.RequireHttpsMetadata = false;
            options.TokenValidationParameters.ValidateIssuer = false;
            options.TokenValidationParameters.ValidateAudience = false;
            options.TokenValidationParameters.SignatureValidator = (token, parameters) => new JsonWebToken(token);
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];

                    if (!string.IsNullOrEmpty(accessToken))
                        context.Token = accessToken;
                    return Task.CompletedTask;
                }
            };
        });
        services.AddAuthorization();
        
        
        
        services.AddHttpContextAccessor();
        services.AddTransient<IClaimContextAccessor, ClaimContextAccessor>();
        action?.Invoke(services);
        return services;
    }

    public static IApplicationBuilder UseAuth(this IApplicationBuilder app)
    {
        app.UseCors(Cors);
        app.UseAuthentication();
        app.UseAuthorization();
        return app;
    }
}