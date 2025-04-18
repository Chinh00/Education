using Education.Infrastructure.Authentication;
using Education.Infrastructure.Logging;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddAuth(builder.Configuration)
    .AddLoggingService();

var app = builder.Build();



app.Run();

