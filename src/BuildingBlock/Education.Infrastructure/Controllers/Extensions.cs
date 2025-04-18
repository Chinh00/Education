using System.Text.Json.Serialization;
using Education.Infrastructure.Behavior;
using MediatR;

namespace Education.Infrastructure.Controllers;

public static class Extensions
{
    public static IServiceCollection AddControllerService(this IServiceCollection services,
        Type[] types,
        Action<IServiceCollection> action = null)
    {
        services.AddMediatR(c => c.RegisterServicesFromAssemblies(types.Select(e => e.Assembly).ToArray()))
            .AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestValidateBehaviorPipeline<,>));
        services.AddControllers();
        services.AddControllers().AddJsonOptions(opt =>
        {
            opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            opt.JsonSerializerOptions.WriteIndented = true;

        });;
        action?.Invoke(services);
        return services;
    }
}