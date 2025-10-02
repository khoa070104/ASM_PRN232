import Navbar from "../components/Navbar";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";

const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23f3f4f6'%3E%3Crect width='400' height='300' fill='%23f9fafb'/%3E%3Cpath d='M200 120 L240 160 L160 160 Z' fill='%23d1d5db'/%3E%3Ccircle cx='200' cy='180' r='20' fill='%23d1d5db'/%3E%3C/svg%3E";

export default function ProductDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isLoading, isError } = useProduct(id || "");

	if (isLoading) {
		return (
			<>
				<Navbar />
				<main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
					<div className="mx-auto max-w-4xl px-6 py-12">
						<div className="bg-white shadow-2xl rounded-2xl overflow-hidden animate-pulse">
							<div className="h-96 bg-gray-200"></div>
							<div className="p-8 space-y-4">
								<div className="h-8 bg-gray-200 rounded w-3/4"></div>
								<div className="h-4 bg-gray-200 rounded w-full"></div>
								<div className="h-4 bg-gray-200 rounded w-2/3"></div>
								<div className="h-6 bg-gray-200 rounded w-1/4"></div>
								<div className="flex gap-4 pt-4">
									<div className="h-12 bg-gray-200 rounded w-32"></div>
									<div className="h-12 bg-gray-200 rounded w-24"></div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</>
		);
	}

	if (isError) {
		return (
			<>
				<Navbar />
				<main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
					<div className="mx-auto max-w-lg px-6 py-12">
						<div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-8 rounded-xl text-center">
							<div className="text-6xl mb-4">❌</div>
							<h2 className="text-xl font-semibold mb-2">Không thể tải dữ liệu</h2>
							<p className="text-red-600 mb-6">Có lỗi xảy ra khi tải thông tin sản phẩm</p>
							<button 
								onClick={() => navigate("/")}
								className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
							>
								Quay về trang chủ
							</button>
						</div>
					</div>
				</main>
			</>
		);
	}

	if (!data) return null;

	return (
		<>
			<Navbar />
			<main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
				<div className="mx-auto max-w-4xl px-6 py-12">
					{/* Breadcrumb */}
					<nav className="mb-8">
						<ol className="flex items-center space-x-2 text-sm text-gray-600">
							<li>
								<Link to="/" className="hover:text-primary transition-colors">
									🏠 Trang chủ
								</Link>
							</li>
							<li className="text-gray-400">/</li>
							<li className="text-gray-900 font-semibold">Chi tiết sản phẩm</li>
						</ol>
					</nav>

					{/* Product Detail Card */}
					<div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
						<div className="md:flex">
							{/* Product Image */}
							<div className="md:w-1/2">
								<img 
									src={data.image || DEFAULT_IMAGE} 
									alt={data.name} 
									className="w-full h-96 md:h-full object-cover"
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.src = DEFAULT_IMAGE;
									}}
								/>
							</div>
							
							{/* Product Info */}
							<div className="md:w-1/2 p-8">
								<div className="h-full flex flex-col">
									<h1 className="text-3xl font-bold text-gray-900 mb-4">
										{data.name}
									</h1>
									
									<div className="text-4xl font-bold text-primary mb-6">
										${data.price.toFixed(2)}
									</div>
									
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-700 mb-3">
											📄 Mô tả sản phẩm
										</h3>
										<p className="text-gray-600 leading-relaxed">
											{data.description}
										</p>
									</div>
									
									{/* Action Buttons */}
									<div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
										<Link 
											to={`/edit/${data.id}`}
											className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center"
										>
											✏️ Chỉnh sửa sản phẩm
										</Link>
										<button 
											onClick={() => navigate("/")}
											className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
										>
											⬅️ Quay lại
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}


