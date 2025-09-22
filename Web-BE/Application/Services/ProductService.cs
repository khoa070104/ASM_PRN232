using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Exceptions;

namespace Application.Services
{
    public class ProductService : IProductService
	{
		private readonly IProductRepository _repository;
		private readonly IMapper _mapper;

		public ProductService(IProductRepository repository, IMapper mapper)
		{
			_repository = repository;
			_mapper = mapper;
		}

		public async Task<List<ProductReadDto>> GetAllAsync(CancellationToken cancellationToken = default)
		{
			var entities = await _repository.GetAllAsync(cancellationToken);
			return _mapper.Map<List<ProductReadDto>>(entities);
		}

		public async Task<ProductReadDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
		{
			var entity = await _repository.GetByIdAsync(id, cancellationToken);
			if (entity == null)
			{
				throw new AppException(Messages.NotFound, 404, Messages.NotFound);
			}
			return _mapper.Map<ProductReadDto>(entity);
		}

		public async Task<ProductReadDto> CreateAsync(ProductCreateDto dto, CancellationToken cancellationToken = default)
		{
			var entity = _mapper.Map<Product>(dto);
			entity.Id = Guid.NewGuid();
			await _repository.AddAsync(entity, cancellationToken);
			return _mapper.Map<ProductReadDto>(entity);
		}

		public async Task<ProductReadDto> UpdateAsync(Guid id, ProductUpdateDto dto, CancellationToken cancellationToken = default)
		{
			var entity = await _repository.GetByIdAsync(id, cancellationToken);
			if (entity == null)
			{
				throw new AppException(Messages.NotFound, 404, Messages.NotFound);
			}
			_mapper.Map(dto, entity);
			entity.UpdatedAtUtc = DateTime.UtcNow;
			await _repository.UpdateAsync(entity, cancellationToken);
			return _mapper.Map<ProductReadDto>(entity);
		}

		public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
		{
			var entity = await _repository.GetByIdAsync(id, cancellationToken);
			if (entity == null)
			{
				throw new AppException(Messages.NotFound, 404, Messages.NotFound);
			}
			await _repository.DeleteAsync(entity, cancellationToken);
		}
	}
}


