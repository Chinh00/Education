var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAuth(builder.Configuration)
    .AddLoggingService()
    .AddControllerService([typeof(Program)])
    .AddValidation(typeof(Anchor))
    .AddSwaggerService(typeof(TrainingController))
    .AddMediatorService([typeof(Anchor)])
    .AddAutoMapperService(typeof(MapperConfigs))
    .AddMongodbService(builder.Configuration, typeof(MongoRepository<>))
    
    ;

var app = builder.Build();
app.UseAuth();
app.MapControllers();
app.UseSwagger();

app.Run();

