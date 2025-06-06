using Education.Infrastructure;
using TrainingService.Infrastructure;
using TrainingService.Infrastructure.GrpcService.Implements;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuth(builder.Configuration)
    .AddLoggingService()
    .AddControllerService([typeof(Program)])
    .AddValidation(typeof(Anchor))
    .AddSwaggerService(typeof(Program), "trainingservice")
    .AddMediatorService([typeof(Anchor)])
    .AddAutoMapperService(typeof(MapperConfigs))
    .AddMongodbService(builder.Configuration, typeof(MongoRepository<>))
    .AddMasstransitService(builder.Configuration)
    .AddOpenTelemetryCustom(builder.Configuration, "training-service")
    .AddGrpc();
    

var app = builder.Build();
app.UseAuth();
app.MapControllers();
app.UseSwagger();
app.MapGrpcService<TrainingGrpcService>();

app.Run();

