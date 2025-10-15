using Application.DTOs;
using Application.Interfaces;
using Domain.Common;
using Domain.Entities;
using Domain.Exceptions;

namespace Application.Services
{
	public class OrderService : IOrderService
	{
		private readonly IOrderRepository _orderRepository;
		private readonly ICartRepository _cartRepository;
		private readonly IProductRepository _productRepository;

		public OrderService(IOrderRepository orderRepository, ICartRepository cartRepository, IProductRepository productRepository)
		{
			_orderRepository = orderRepository;
			_cartRepository = cartRepository;
			_productRepository = productRepository;
		}

		public async Task<OrderCreateResponseDto> CreateFromCartAsync(Guid userId, CancellationToken ct = default)
		{
			var cart = await _cartRepository.GetByUserIdAsync(userId, ct);
			if (cart.Count == 0) throw new AppException("Cart empty", 400, Messages.CartEmpty);

			// Refresh product prices and compute totals
			decimal total = 0m;
			var details = new List<OrderDetail>();
			foreach (var item in cart)
			{
				var product = await _productRepository.GetByIdAsync(item.ProductId, ct);
				if (product == null) throw new AppException("Product not found", 404, Messages.ProductNotFound);
				var unitPrice = product.Price;
				total += unitPrice * item.Quantity;
				details.Add(new OrderDetail
				{
					Id = Guid.NewGuid(),
					ProductId = product.Id,
					Quantity = item.Quantity,
					UnitPrice = unitPrice,
					CreatedAtUtc = DateTime.UtcNow
				});
			}

			var order = new Order
			{
				Id = Guid.NewGuid(),
				UserId = userId,
				Status = "Pending",
				TotalAmount = total,
				CreatedAtUtc = DateTime.UtcNow,
				OrderDetails = details
			};

			await _orderRepository.AddAsync(order, ct);
			await _cartRepository.DeleteByUserIdAsync(userId, ct);

			return new OrderCreateResponseDto(order.Id.ToString(), order.TotalAmount);
		}


		public async Task<PagedOrders> GetMyOrdersPagedAsync(Guid userId, int page, int pageSize, CancellationToken ct = default)
		{
			if (page <= 0) page = 1;
			if (pageSize <= 0) pageSize = 10;
			var (items, total) = await _orderRepository.GetByUserIdPagedAsync(userId, page, pageSize, ct);
			var mapped = items.Select(MapOrder).ToList();
			return new PagedOrders(mapped, total, page, pageSize);
		}

		public async Task<OrderReadDto> GetByIdAsync(Guid userId, Guid orderId, CancellationToken ct = default)
		{
			var order = await _orderRepository.GetByUserIdAndIdAsync(userId, orderId, ct);
			if (order == null) throw new AppException("Order not found", 404, Messages.OrderNotFound);
			return MapOrder(order);
		}

		public async Task MarkPaidAsync(Guid userId, Guid orderId, CancellationToken ct = default)
		{
			var order = await _orderRepository.GetByUserIdAndIdAsync(userId, orderId, ct);
			if (order == null) throw new AppException("Order not found", 404, Messages.OrderNotFound);
			if (order.Status != "Paid")
			{
				order.Status = "Paid";
				await _orderRepository.UpdateAsync(order, ct);
				return;
			}
			// Idempotent: nếu đã Paid thì không ném lỗi
			await _orderRepository.UpdateAsync(order, ct);
		}

		public async Task MarkFailedAsync(Guid userId, Guid orderId, CancellationToken ct = default)
		{
			var order = await _orderRepository.GetByUserIdAndIdAsync(userId, orderId, ct);
			if (order == null) throw new AppException("Order not found", 404, Messages.OrderNotFound);
			if (order.Status == "Paid") return; // không hạ trạng thái đơn đã thanh toán
			order.Status = "Failed";
			await _orderRepository.UpdateAsync(order, ct);
		}

		private static OrderReadDto MapOrder(Order order)
		{
			return new OrderReadDto(
				order.Id.ToString(),
				order.UserId.ToString(),
				order.TotalAmount,
				order.Status,
				order.CreatedAtUtc,
				order.OrderDetails.Select(od => new OrderDetailReadDto(
					od.ProductId.ToString(),
					od.Product?.Name ?? string.Empty,
					od.Quantity,
					od.UnitPrice,
					od.UnitPrice * od.Quantity
				)).ToList()
			);
		}
	}
}


