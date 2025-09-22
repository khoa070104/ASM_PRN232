using System.Net;
using Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Serilog;

namespace Api.Middleware
{
	public class ExceptionMiddleware : IMiddleware
	{
		public async Task InvokeAsync(HttpContext context, RequestDelegate next)
		{
			try
			{
				await next(context);
			}
			catch (AppException ex)
			{
				Log.Warning(ex, "AppException");
				context.Response.ContentType = "application/json";
				context.Response.StatusCode = ex.StatusCode;
				await context.Response.WriteAsJsonAsync(new { error = ex.ErrorCode, message = ex.Message });
			}
			catch (Exception ex)
			{
				Log.Error(ex, "UnhandledException");
				context.Response.ContentType = "application/json";
				context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
				await context.Response.WriteAsJsonAsync(new { error = "INTERNAL_ERROR", message = "Unexpected error" });
			}
		}
	}
}


