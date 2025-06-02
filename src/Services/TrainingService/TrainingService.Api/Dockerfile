FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
ENV ASPNETCORE_HTTP_PORTS=8080
WORKDIR /src
COPY ["src/Services/TrainingService/TrainingService.Api/TrainingService.Api.csproj", "src/Services/TrainingService/TrainingService.Api/"]
COPY ["src/Services/TrainingService/TrainingService.Infrastructure/TrainingService.Infrastructure.csproj", "src/Services/TrainingService/TrainingService.Infrastructure/"]
COPY ["src/Services/TrainingService/TrainingService.Domain/TrainingService.Domain.csproj", "src/Services/TrainingService/TrainingService.Domain/"]
COPY ["src/BuildingBlock/Education.Core/Education.Core.csproj", "src/BuildingBlock/Education.Core/"]
COPY ["src/BuildingBlock/Education.Infrastructure/Education.Infrastructure.csproj", "src/BuildingBlock/Education.Infrastructure/"]
COPY ["src/Services/TrainingService/TrainingService.AppCore/TrainingService.AppCore.csproj", "src/Services/TrainingService/TrainingService.AppCore/"]
RUN dotnet restore "src/Services/TrainingService/TrainingService.Api/TrainingService.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/TrainingService/TrainingService.Api"
RUN dotnet build "./TrainingService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./TrainingService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TrainingService.Api.dll"]
