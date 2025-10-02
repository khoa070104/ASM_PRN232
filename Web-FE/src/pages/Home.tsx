import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { useDeleteProduct, useProducts } from "../hooks/useProducts";
import toast from "react-hot-toast";
import { Messages } from "../common/messages";

export default function Home() {
	const { data, isLoading, isError } = useProducts();
	const del = useDeleteProduct();

	const handleDelete = (id: string) => {
		del.mutate(id, { 
			onSuccess: () => toast.success(Messages.DeleteSuccess), 
			onError: () => toast.error(Messages.DeleteFailed) 
		});
	};

	return (
		<>
			<Navbar />
			<main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
				<div className="mx-auto max-w-7xl px-6 py-8">
					{/* Header Section */}
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							🛍️ Cửa hàng sản phẩm
						</h1>
						<p className="text-gray-600 text-lg max-w-2xl mx-auto">
							Khám phá bộ sưu tập sản phẩm tuyệt vời của chúng tôi
						</p>
					</div>

					{/* Loading State */}
					{isLoading && (
						<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
									<div className="h-48 shimmer" />
									<div className="p-6 space-y-4">
										<div className="h-5 shimmer rounded w-2/3" />
										<div className="h-4 shimmer rounded w-full" />
										<div className="h-4 shimmer rounded w-3/4" />
										<div className="h-6 shimmer rounded w-1/3" />
										<div className="flex gap-2 pt-2">
											<div className="h-10 shimmer rounded-full flex-1" />
											<div className="h-10 shimmer rounded-full flex-1" />
											<div className="h-10 shimmer rounded-full flex-1" />
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Error State */}
					{isError && (
						<div className="max-w-md mx-auto">
							<div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl text-center">
								<div className="text-3xl mb-2">❌</div>
								<div className="font-semibold">{Messages.LoadFailed}</div>
							</div>
						</div>
					)}

					{/* Empty State */}
					{!isLoading && !isError && data?.length === 0 && (
						<EmptyState />
					)}

					{/* Products Grid */}
					{!isLoading && !isError && data && data.length > 0 && (
						<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{data.map(product => (
								<ProductCard 
									key={product.id} 
									product={product} 
									onDelete={handleDelete}
								/>
							))}
						</div>
					)}
				</div>
			</main>
		</>
	);
}


