using Application.Interfaces;
using Application.Mapping;
using Application.Services;
using FluentValidation;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
	.ReadFrom.Configuration(builder.Configuration)
	.CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(options =>
{
	options.AddPolicy("DefaultCors", policy =>
	{
		policy.WithOrigins(allowedOrigins)
			.AllowAnyHeader()
			.AllowAnyMethod();
	});
});

// DbContext
builder.Services.AddDbContext<ECommerceDbContext>(options =>
{
	options.UseNpgsql(builder.Configuration.GetConnectionString("DBDefault"));
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(ProductProfile).Assembly);

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Application.Validation.ProductCreateValidator>();

// Application services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<Application.Interfaces.IProductRepository, ProductRepository>();
builder.Services.AddTransient<ExceptionMiddleware>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();

app.UseCors("DefaultCors");

app.UseMiddleware<ExceptionMiddleware>();

app.MapControllers();

app.Run();
