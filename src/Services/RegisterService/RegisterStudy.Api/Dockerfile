FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
ENV ASPNETCORE_HTTP_PORTS=8080
WORKDIR /src
COPY ["src/Services/RegisterService/RegisterStudy.Api/RegisterStudy.Api.csproj", "src/Services/RegisterService/RegisterStudy.Api/"]
COPY ["src/BuildingBlock/Education.Core/Education.Core.csproj", "src/BuildingBlock/Education.Core/"]
COPY ["src/BuildingBlock/Education.Infrastructure/Education.Infrastructure.csproj", "src/BuildingBlock/Education.Infrastructure/"]
COPY ["src/Services/RegisterService/RegisterStudy.AppCore/RegisterStudy.AppCore.csproj", "src/Services/RegisterService/RegisterStudy.AppCore/"]
COPY ["src/Services/RegisterService/RegisterStudy.Domain/RegisterStudy.Domain.csproj", "src/Services/RegisterService/RegisterStudy.Domain/"]
COPY ["src/BuildingBlock/Education.Contract/Education.Contract.csproj", "src/BuildingBlock/Education.Contract/"]
COPY ["src/Services/RegisterService/RegisterStudy.Infrastructure/RegisterStudy.Infrastructure.csproj", "src/Services/RegisterService/RegisterStudy.Infrastructure/"]
RUN dotnet restore "src/Services/RegisterService/RegisterStudy.Api/RegisterStudy.Api.csproj"
COPY . .
WORKDIR "/src/src/Services/RegisterService/RegisterStudy.Api"
RUN dotnet build "./RegisterStudy.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./RegisterStudy.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RegisterStudy.Api.dll"]
