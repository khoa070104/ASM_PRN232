# build stage (context: Web-BE)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy entire solution folder (Api, Application, Domain, Infrastructure)
COPY . ./

# restore and publish Api
RUN dotnet restore Api/Api.csproj \
 && dotnet publish Api/Api.csproj -c Release -o /app/out --no-restore

# runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out ./

ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Api.dll"]


