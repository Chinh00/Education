FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
ENV ASPNETCORE_HTTP_PORTS=8080
WORKDIR /src
COPY ["src/Services/Gateways/Gateway/Gateway.csproj", "src/Services/Gateways/Gateway/"]
COPY ["src/BuildingBlock/Education.Core/Education.Core.csproj", "src/BuildingBlock/Education.Core/"]
COPY ["src/BuildingBlock/Education.Infrastructure/Education.Infrastructure.csproj", "src/BuildingBlock/Education.Infrastructure/"]
RUN dotnet restore "src/Services/Gateways/Gateway/Gateway.csproj"
COPY . .
WORKDIR "/src/src/Services/Gateways/Gateway"
RUN dotnet build "./Gateway.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Gateway.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Gateway.dll"]
