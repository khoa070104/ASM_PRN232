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

		public async Task<List<OrderReadDto>> GetMyOrdersAsync(Guid userId, CancellationToken ct = default)
		{
			var orders = await _orderRepository.GetByUserIdAsync(userId, ct);
			return orders.Select(MapOrder).ToList();
		}

		public async Task<OrderReadDto> GetByIdAsync(Guid userId, Guid orderId, CancellationToken ct = default)
		{
			var order = await _orderRepository.GetByIdAsync(orderId, ct);
			if (order == null) throw new AppException("Order not found", 404, Messages.OrderNotFound);
			if (order.UserId != userId) throw new AppException("Forbidden", 403, Messages.Forbidden);
			return MapOrder(order);
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


