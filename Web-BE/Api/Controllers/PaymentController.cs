using Application.Interfaces;
using Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Stripe.Checkout;
using Api.Common;

namespace Api.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	public class PaymentController : ControllerBase
	{
		private readonly IOrderService _orderService;

		private readonly IConfiguration _configuration;

		public PaymentController(IOrderService orderService, IConfiguration configuration)
		{
			_orderService = orderService;
			_configuration = configuration;
		}

		private Guid GetUserId()
		{
			var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? User.FindFirstValue("userId");
			return Guid.Parse(userIdStr!);
		}

		public record CreatePaymentRequest(Guid OrderId);
        public record CreatePaymentResponse(string PaymentUrl, string Code);
        public record StripeSessionRequest(Guid OrderId);
        public record StripeSessionResponse(string Url);
        public record FailRequest(Guid OrderId);

		[HttpPost("create")]
		public async Task<ActionResult<CreatePaymentResponse>> Create([FromBody] CreatePaymentRequest req, CancellationToken ct)
		{
			// Tạo URL giả lập thanh toán điều hướng về FE
			var feBase = _configuration.GetValue<string>("Frontend:BaseUrl") ?? $"{Request.Scheme}://{Request.Host}";
			var fakeUrl = $"{feBase.TrimEnd('/')}/payment-success?orderId={req.OrderId}";
			return Ok(new CreatePaymentResponse(fakeUrl, Messages.PaymentUrlCreated));
		}

		[HttpPost("success")]
		public async Task<ActionResult> Success([FromBody] CreatePaymentRequest req, CancellationToken ct)
		{
			await _orderService.MarkPaidAsync(GetUserId(), req.OrderId, ct);
			return Ok();
		}

        [HttpPost("fail")]
        public async Task<ActionResult> Fail([FromBody] FailRequest req, CancellationToken ct)
        {
            await _orderService.MarkFailedAsync(GetUserId(), req.OrderId, ct);
            return Ok();
        }

        [HttpPost("stripe/create-session")]
        public async Task<ActionResult<StripeSessionResponse>> CreateStripeSession([FromBody] StripeSessionRequest req, CancellationToken ct)
        {
            var secret = ConfigConstants.StripeSecretKey;
            if (string.IsNullOrWhiteSpace(secret)) return BadRequest("Stripe not configured");
            Stripe.StripeConfiguration.ApiKey = secret;

            // Lấy đơn để lấy tổng tiền
            var order = await _orderService.GetByIdAsync(GetUserId(), req.OrderId, ct);
            var feBase = _configuration.GetValue<string>("Frontend:BaseUrl") ?? $"{Request.Scheme}://{Request.Host}";

            // Stripe yêu cầu tổng tiền tối thiểu tương đương >= 0.50 USD.
            // Với VND (zero-decimal currency), truyền số VND trực tiếp, không nhân 100.
            // Ép min 13,000 VND (~>= $0.5) để tránh lỗi khi đơn quá nhỏ.
            var currency = "vnd";
            var minVnd = 13000L;
            var unitAmountVnd = (long)Math.Ceiling(order.TotalAmount);
            if (unitAmountVnd < minVnd) unitAmountVnd = minVnd;

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                Mode = "payment",
                ClientReferenceId = order.Id.ToString(),
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Quantity = 1,
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = currency,
                            UnitAmount = unitAmountVnd,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = $"Order {order.Id}"
                            }
                        }
                    }
                },
                SuccessUrl = $"{feBase.TrimEnd('/')}/payment-success?orderId={order.Id}",
                CancelUrl = $"{feBase.TrimEnd('/')}/checkout"
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options, cancellationToken: ct);
            return Ok(new StripeSessionResponse(session.Url!));
        }
	}
}


