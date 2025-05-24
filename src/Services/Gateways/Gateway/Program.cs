

using Education.Infrastructure.Logging;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddLoggingService();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
var app = builder.Build();
app.UseWebSockets();
app.UseRouting();
app.MapReverseProxy();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/trainingservice/swagger/v1/swagger.json", "Training Service");
    c.SwaggerEndpoint("/studentservice/swagger/v1/swagger.json", "Student service");
    c.SwaggerEndpoint("/registerservice/swagger/v1/swagger.json", "Register service");
    c.SwaggerEndpoint("/identityservice/swagger/v1/swagger.json", "Identity service");
});

app.Run();
