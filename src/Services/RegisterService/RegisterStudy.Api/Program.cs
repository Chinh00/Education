using Education.Infrastructure.Authentication;
using Education.Infrastructure.Logging;
using Education.Infrastructure.Mediator;
using Education.Infrastructure.Redis;
using RegisterStudy.AppCore;
using RegisterStudy.AppCore.Repository;
using RegisterStudy.Infrastructure;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddAuth(builder.Configuration)
    .AddLoggingService()
    .AddMediatorService([typeof(Anchor)])
    .AddMasstransitService(builder.Configuration)
    .AddRedis(builder.Configuration)
    .AddScoped(typeof(IRegisterRepository<>), typeof(RedisRegisterRepository<>));

var app = builder.Build();



app.Run();

