namespace Domain.Common
{
	public static class Messages
	{
		public const string ValidationFailed = "VALIDATION_FAILED";
		public const string NotFound = "NOT_FOUND";
		public const string Created = "CREATED";
		public const string Updated = "UPDATED";
		public const string Deleted = "DELETED";

		// Cart & Order
		public const string ProductNotFound = "PRODUCT_NOT_FOUND";
		public const string CartItemNotFound = "CART_ITEM_NOT_FOUND";
		public const string QuantityInvalid = "QUANTITY_INVALID";
		public const string CartEmpty = "CART_EMPTY";
		public const string OrderNotFound = "ORDER_NOT_FOUND";
		public const string Forbidden = "FORBIDDEN";

		// Payment
		public const string PaymentUrlCreated = "PAYMENT_URL_CREATED";
		public const string PaymentAlreadyPaid = "PAYMENT_ALREADY_PAID";
	}
}


