using Education.Infrastructure.Authentication;
using Education.Infrastructure.Logging;
using Education.Infrastructure.Mediator;
using RegisterStudy.AppCore;
using RegisterStudy.Infrastructure;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddAuth(builder.Configuration)
    .AddLoggingService()
    .AddMediatorService([typeof(Anchor)])
    .AddMasstransitService(builder.Configuration);

var app = builder.Build();



app.Run();

