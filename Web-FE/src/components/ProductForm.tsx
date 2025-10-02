import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { ProductCreate } from "../api/products";

const schema: yup.ObjectSchema<ProductCreate> = yup.object({
	name: yup.string().required("Tên sản phẩm là bắt buộc").max(200, "Tên sản phẩm không được quá 200 ký tự"),
	description: yup.string().required("Mô tả là bắt buộc").max(2000, "Mô tả không được quá 2000 ký tự"),
	price: yup.number().required("Giá là bắt buộc").moreThan(0, "Giá phải lớn hơn 0"),
	image: yup.string().url("URL ảnh không hợp lệ").nullable().optional(),
}) as yup.ObjectSchema<ProductCreate>;

type Props = {
    defaultValues?: Partial<ProductCreate>;
    onSubmit: (data: ProductCreate) => void | Promise<void>;
    loading?: boolean;
};

export default function ProductForm({ defaultValues, onSubmit, loading }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<ProductCreate>({
        defaultValues: defaultValues as any,
        resolver: yupResolver(schema) as any,
    });

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100 backdrop-blur-sm">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {defaultValues ? "✏️ Chỉnh sửa sản phẩm" : "➕ Tạo sản phẩm mới"}
                    </h2>
                    <p className="text-gray-600">
                        {defaultValues ? "Cập nhật thông tin sản phẩm" : "Điền thông tin để tạo sản phẩm mới"}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📝 Tên sản phẩm
                        </label>
                        <input 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 shadow-sm hover:shadow-md" 
                            {...register("name")} 
                            placeholder="Nhập tên sản phẩm..." 
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                ❌ {errors.name.message as string}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📄 Mô tả sản phẩm
                        </label>
                        <textarea 
                            rows={4} 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none bg-white hover:border-gray-300 shadow-sm hover:shadow-md" 
                            {...register("description")} 
                            placeholder="Mô tả chi tiết về sản phẩm..." 
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                ❌ {errors.description.message as string}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            💰 Giá bán
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                            <input 
                                type="number" 
                                step="0.01" 
                                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 shadow-sm hover:shadow-md" 
                                {...register("price", { valueAsNumber: true })} 
                                placeholder="0.00" 
                            />
                        </div>
                        {errors.price && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                ❌ {errors.price.message as string}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🖼️ URL hình ảnh (tùy chọn)
                        </label>
                        <input 
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 shadow-sm hover:shadow-md" 
                            {...register("image")} 
                            placeholder="https://example.com/image.jpg" 
                        />
                        {errors.image && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                ❌ {errors.image.message as string}
                            </p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-4 focus:ring-purple-500/30"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                {defaultValues ? "💾 Cập nhật sản phẩm" : "🚀 Tạo sản phẩm"}
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}


