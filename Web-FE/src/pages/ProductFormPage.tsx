import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import { useCreateProduct, useProduct, useUpdateProduct } from "../hooks/useProducts";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Messages } from "../common/messages";

export default function ProductFormPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = !!id;
	const { data, isLoading, isError } = useProduct(id || "");
	const createMut = useCreateProduct();
	const updateMut = useUpdateProduct(id || "");

	const handleSubmit = async (payload: any) => {
		try {
			if (isEdit) {
				await updateMut.mutateAsync(payload);
				toast.success(Messages.UpdateSuccess);
			} else {
				await createMut.mutateAsync(payload);
				toast.success(Messages.CreateSuccess);
			}
			navigate("/");
		} catch { toast.error(Messages.GeneralError); }
	};

	if (isEdit && isLoading) {
		return (
			<>
				<Navbar />
				<main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
					<div className="mx-auto max-w-lg px-6 py-12">
						<div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100 animate-pulse">
							<div className="text-center mb-8">
								<div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
							</div>
							<div className="space-y-6">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i}>
										<div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
										<div className="h-12 bg-gray-200 rounded-xl"></div>
									</div>
								))}
								<div className="h-12 bg-gray-200 rounded-xl"></div>
							</div>
						</div>
					</div>
				</main>
			</>
		);
	}

	if (isEdit && isError) {
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

	return (
		<>
			<Navbar />
			<main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
				<div className="mx-auto max-w-4xl px-6 py-12">
					<ProductForm 
						defaultValues={isEdit ? data : undefined} 
						onSubmit={handleSubmit} 
						loading={createMut.isPending || updateMut.isPending} 
					/>
				</div>
			</main>
		</>
	);
}


