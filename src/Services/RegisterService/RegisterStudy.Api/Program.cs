using Education.Infrastructure.Authentication;
using Education.Infrastructure.Controllers;
using Education.Infrastructure.Exception;
using Education.Infrastructure.Logging;
using Education.Infrastructure.Mediator;
using Education.Infrastructure.Redis;
using Education.Infrastructure.Swagger;
using Hangfire;
using Hangfire.Redis.StackExchange;
using RegisterStudy.AppCore;
using RegisterStudy.Domain.Repository;
using RegisterStudy.Infrastructure;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddAuth(builder.Configuration)
    .AddLoggingService()
    .AddControllerService([typeof(Program)])
    .AddSwaggerService(typeof(Program))
    .AddMediatorService([typeof(Anchor)])
    .AddMasstransitService(builder.Configuration)
    .AddRedis(builder.Configuration)
    .AddScoped(typeof(IRegisterRepository<>), typeof(RedisRegisterRepository<>))
    .AddTrainingGrpcClient(builder.Configuration)
    .AddHangfire(config =>
    {
        config.UseRedisStorage($"{builder.Configuration.GetValue<string>("Redis:Server")}:{builder.Configuration.GetValue<string>("Redis:Port")},abortConnect=false");
    }); 
builder.Services.AddHangfireServer();
var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseAuth();
app.UseSwagger();
app.MapControllers();
app.UseHangfireDashboard();


app.Run();

