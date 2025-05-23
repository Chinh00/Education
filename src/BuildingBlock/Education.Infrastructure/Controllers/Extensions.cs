using Education.Infrastructure.Behavior;
using MediatR;
using Newtonsoft.Json;

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
        services.AddControllers().AddNewtonsoftJson(opt =>
        {
            opt.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            // opt.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
            opt.SerializerSettings.Formatting = Formatting.Indented;
        });
        action?.Invoke(services);
        return services;
    }
}