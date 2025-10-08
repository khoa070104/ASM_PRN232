using Application.DTOs;
using Application.Interfaces;
using Domain.Common;
using Domain.Entities;
using Domain.Exceptions;

namespace Application.Services
{
	public class CartService : ICartService
	{
		private readonly ICartRepository _cartRepository;
		private readonly IProductRepository _productRepository;

		public CartService(ICartRepository cartRepository, IProductRepository productRepository)
		{
			_cartRepository = cartRepository;
			_productRepository = productRepository;
		}

		public async Task<List<CartItemReadDto>> GetMyCartAsync(Guid userId, CancellationToken ct = default)
		{
			var items = await _cartRepository.GetByUserIdAsync(userId, ct);
			return items.Select(MapCartItem).ToList();
		}

		public async Task<List<CartItemReadDto>> AddAsync(Guid userId, CartAddRequestDto dto, CancellationToken ct = default)
		{
			if (dto.Quantity <= 0)
				throw new AppException("Quantity invalid", 400, Messages.QuantityInvalid);

			if (!Guid.TryParse(dto.ProductId, out var productId))
				throw new AppException("Product not found", 404, Messages.ProductNotFound);

			var product = await _productRepository.GetByIdAsync(productId, ct);
			if (product == null)
				throw new AppException("Product not found", 404, Messages.ProductNotFound);

			var existing = await _cartRepository.GetByUserAndProductAsync(userId, productId, ct);
			if (existing == null)
			{
				var newItem = new CartItem
				{
					Id = Guid.NewGuid(),
					UserId = userId,
					ProductId = productId,
					Quantity = dto.Quantity,
					CreatedAtUtc = DateTime.UtcNow
				};
				await _cartRepository.AddAsync(newItem, ct);
			}
			else
			{
				existing.Quantity += dto.Quantity;
				existing.UpdatedAtUtc = DateTime.UtcNow;
				await _cartRepository.UpdateAsync(existing, ct);
			}

			var items = await _cartRepository.GetByUserIdAsync(userId, ct);
			return items.Select(MapCartItem).ToList();
		}

		public async Task<List<CartItemReadDto>> UpdateAsync(Guid userId, Guid itemId, CartUpdateRequestDto dto, CancellationToken ct = default)
		{
			if (dto.Quantity <= 0)
				throw new AppException("Quantity invalid", 400, Messages.QuantityInvalid);

			var items = await _cartRepository.GetByUserIdAsync(userId, ct);
			var item = items.FirstOrDefault(x => x.Id == itemId);
			if (item == null)
				throw new AppException("Cart item not found", 404, Messages.CartItemNotFound);

			item.Quantity = dto.Quantity;
			item.UpdatedAtUtc = DateTime.UtcNow;
			await _cartRepository.UpdateAsync(item, ct);

			items = await _cartRepository.GetByUserIdAsync(userId, ct);
			return items.Select(MapCartItem).ToList();
		}

		public async Task<List<CartItemReadDto>> RemoveAsync(Guid userId, Guid itemId, CancellationToken ct = default)
		{
			var items = await _cartRepository.GetByUserIdAsync(userId, ct);
			var item = items.FirstOrDefault(x => x.Id == itemId);
			if (item == null)
				throw new AppException("Cart item not found", 404, Messages.CartItemNotFound);

			await _cartRepository.DeleteAsync(item, ct);
			items = await _cartRepository.GetByUserIdAsync(userId, ct);
			return items.Select(MapCartItem).ToList();
		}

		private static CartItemReadDto MapCartItem(CartItem item)
		{
			var unitPrice = item.Product?.Price ?? 0m;
			return new CartItemReadDto(
				item.Id.ToString(),
				item.ProductId.ToString(),
				item.Product?.Name ?? string.Empty,
				item.Product?.Image,
				unitPrice,
				item.Quantity,
				unitPrice * item.Quantity
			);
		}
	}
}


