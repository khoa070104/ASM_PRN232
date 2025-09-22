namespace Domain.Exceptions
{
	public class AppException : Exception
	{
		public int StatusCode { get; }
		public string ErrorCode { get; }

		public AppException(string message, int statusCode = 400, string errorCode = "APP_ERROR") : base(message)
		{
			StatusCode = statusCode;
			ErrorCode = errorCode;
		}
	}
}


