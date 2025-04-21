FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
ENV ASPNETCORE_HTTP_PORTS=80
WORKDIR /src
COPY ["src/Services/StudentService/StudentService.Api/StudentService.Api.csproj", "src/Services/StudentService/StudentService.Api/"]
COPY ["src/BuildingBlock/Education.Contract/Education.Contract.csproj", "src/BuildingBlock/Education.Contract/"]
COPY ["src/BuildingBlock/Education.Core/Education.Core.csproj", "src/BuildingBlock/Education.Core/"]
COPY ["src/BuildingBlock/Education.Infrastructure/Education.Infrastructure.csproj", "src/BuildingBlock/Education.Infrastructure/"]
COPY ["src/Services/StudentService/StudentService.AppCore/StudentService.AppCore.csproj", "src/Services/StudentService/StudentService.AppCore/"]
COPY ["src/Services/StudentService/StudentService.Domain/StudentService.Domain.csproj", "src/Services/StudentService/StudentService.Domain/"]
COPY ["src/Services/StudentService/StudentService.Infrastructure/StudentService.Infrastructure.csproj", "src/Services/StudentService/StudentService.Infrastructure/"]
RUN dotnet restore "src/Services/StudentService/StudentService.Api/StudentService.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/StudentService/StudentService.Api"
RUN dotnet build "./StudentService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./StudentService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=80
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StudentService.Api.dll"]
