using Confluent.Kafka;
using Duende.IdentityServer;
using Education.Contract.IntegrationEvents;
using Education.Infrastructure;
using Education.Infrastructure.Logging;
using Education.Infrastructure.Mediator;
using IdentityService;
using IdentityService.Data;
using IdentityService.Data.Internal;
using IdentityService.Externals;
using IdentityService.Models;
using IdentityService.Services;
using MassTransit;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Config = IdentityService.Config;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddLoggingService();
builder.Services.AddHttpClient();
builder.Services.AddMediatorService([typeof(EventDispatcher)]);
builder.Services.AddCors(c => c.AddPolicy("Cors", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
builder.Services.AddDbContext<IdentityContext>(c => c.UseNpgsql(builder.Configuration.GetConnectionString("postgres"), optionsBuilder =>
{
    optionsBuilder.MigrationsAssembly(typeof(IdentityContext).Assembly.FullName);
}));
builder.Services.AddHostedService<MigrationHostedService>();

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = false; // Không yêu cầu số
        options.Password.RequiredLength = 1;   // Độ dài tối thiểu là 6 ký tự
        options.Password.RequireNonAlphanumeric = false; // Không yêu cầu ký tự đặc biệt
        options.Password.RequireUppercase = false; // Không yêu cầu chữ in hoa
        options.Password.RequireLowercase = false; // Không yêu cầu chữ thường
        options.Password.RequiredUniqueChars = 0; // Yêu cầu ít nhất 1 ký tự duy nhất
    })
    .AddEntityFrameworkStores<IdentityContext>()
    .AddSignInManager<SigninManager>()
    .AddUserManager<UserManager>()
    .AddDefaultTokenProviders();
builder.Services.AddIdentityServer(options =>
    {
        options.Events.RaiseErrorEvents = true;
        options.Events.RaiseInformationEvents = true;
        options.Events.RaiseFailureEvents = true;
        options.Events.RaiseSuccessEvents = true;

        // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
        options.EmitStaticAudienceClaim = true;
        options.KeyManagement.Enabled = false;
        
        
        
    })
    .AddInMemoryIdentityResources(Config.IdentityResources)
    .AddInMemoryApiScopes(Config.ApiScopes)
    .AddInMemoryClients(Config.Clients)
    .AddExtensionGrantValidator<MicrosoftGrantValidator>()
    .AddExtensionGrantValidator<TestGrantValidator>()
    .AddAspNetIdentity<ApplicationUser>()
    .AddProfileService<ProfileService>()
    .AddDeveloperSigningCredential();
    ;
builder.Services.AddHttpClient();
builder.Services.AddAuthentication()
    .AddMicrosoftAccount(options =>
    {
        options.ClientId = "0f7c379c-0685-4e1d-96e3-42c9e3f7381c";
        options.ClientSecret = "bbf9aad6-5f58-4387-927e-02f0b07a72fa";
        options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
        options.AuthorizationEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
        options.TokenEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
        options.SaveTokens = true; 
    });

builder.Services.AddMassTransit(c =>
{
    c.SetKebabCaseEndpointNameFormatter();
    c.UsingInMemory();
    c.AddRider(e =>
    {
        e.AddConsumer<EventDispatcher>();
        e.UsingKafka((context, configurator) =>
        {
            configurator.Host(builder.Configuration.GetValue<string>("Kafka:BootstrapServers"));
            configurator.TopicEndpoint<StudentPulledIntegrationEvent>(nameof(StudentPulledIntegrationEvent), "identity-student",
                config =>
                {
                    config.CreateIfMissing(n => n.NumPartitions = 1);
                    config.AutoOffsetReset = AutoOffsetReset.Earliest;
                    config.ConfigureConsumer<EventDispatcher>(context);
                });

        });
    });
});
builder.Services.AddHostedService<SeedDataHostedService>();
builder.Services.AddOpenTelemetryCustom(builder.Configuration, "identity-service");


var app = builder.Build();
app.UseCors("Cors");

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}



app.UseIdentityServer();
app.UseStaticFiles();
app.Run();