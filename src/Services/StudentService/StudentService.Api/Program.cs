
using Education.Infrastructure;
using Education.Infrastructure.Authentication;
using Education.Infrastructure.Controllers;
using Education.Infrastructure.Swagger;
using Education.Infrastructure.Exception;
using Education.Infrastructure.Logging;
using Education.Infrastructure.Mongodb;
using Education.Infrastructure.Validation;
using StudentService.Api.Controllers;
using StudentService.AppCore;
using StudentService.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuth(builder.Configuration)
    .AddHttpClient()
    .AddLoggingService()
    .AddControllerService([typeof(Anchor)])
    .AddSwaggerService(typeof(StudentController), "studentservice")
    .AddValidation(typeof(Anchor))
    .AddMongodbService(builder.Configuration, typeof(MongoRepository<>))
    .AddMasstransitService(builder.Configuration)
    // .AddHostedService<StudentSeedService>();
    // .AddOpenTelemetryCustom(builder.Configuration, "student-service")
    .AddOpenTelemetryCustom(builder.Configuration, "student-service")
    ;
    
var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseAuth();
app.UseSwagger();
app.MapControllers();


app.Run();

