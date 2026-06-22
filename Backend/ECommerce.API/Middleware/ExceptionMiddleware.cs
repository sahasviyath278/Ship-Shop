using System.Net;
using System.Text.Json;
using ECommerce.Application.Exceptions;

namespace ECommerce.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next) => _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            try { await _next(context); }
            catch (Exception ex) { await HandleExceptionAsync(context, ex); }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError;
            var result = string.Empty;

            switch (exception)
            {
                case ValidationException validationException:
                    code = HttpStatusCode.BadRequest;
                    result = JsonSerializer.Serialize(new { errors = validationException.Message });
                    break;
                case UnauthorizedException:
                    code = HttpStatusCode.Unauthorized;
                    result = JsonSerializer.Serialize(new { error = exception.Message });
                    break;
                case NotFoundException:
                    code = HttpStatusCode.NotFound;
                    result = JsonSerializer.Serialize(new { error = exception.Message });
                    break;
                default:
                    result = JsonSerializer.Serialize(new { error = "An error occurred." });
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}