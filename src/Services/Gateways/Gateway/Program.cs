

using Education.Infrastructure.Logging;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLoggingService();



builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
var app = builder.Build();
app.UseWebSockets();
app.UseRouting();
app.MapReverseProxy();

app.Run();
