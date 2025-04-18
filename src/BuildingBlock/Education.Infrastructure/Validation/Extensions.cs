using FluentValidation;
using FluentValidation.AspNetCore;

namespace Education.Infrastructure.Validation;

public static class Extensions
{
    public static IServiceCollection AddValidation(this IServiceCollection services, Type repo,
        Action<IServiceCollection> action = null)
    {
        services.AddFluentValidationAutoValidation().AddValidatorsFromAssembly(repo.Assembly);
        action?.Invoke(services);
        return services;
    }
}