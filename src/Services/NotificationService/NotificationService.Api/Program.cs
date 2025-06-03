using Education.Infrastructure;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.Controllers;
using Education.Infrastructure.Logging;
using Education.Infrastructure.Mediator;
using Education.Infrastructure.Mongodb;
using Education.Infrastructure.Swagger;
using Education.Infrastructure.Validation;
using NotificationService.AppCore;
using NotificationService.Infrastructure;
using NotificationService.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuth(builder.Configuration)
    .AddLoggingService()
    .AddControllerService([typeof(Program)])
    .AddValidation(typeof(Anchor))
    .AddSwaggerService(typeof(Program), "notificationservice")
    .AddMediatorService([typeof(Anchor)])
    .AddMongodbService(builder.Configuration, typeof(MongoRepository<>))
    .AddMasstransitService(builder.Configuration)
    .AddOpenTelemetryCustom(builder.Configuration, "notification-service");

var app = builder.Build();
app.UseAuth();
app.MapControllers();
app.UseSwagger();


app.Run();

