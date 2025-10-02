import { Link } from "react-router-dom";
import type { Product } from "../api/products";

type Props = {
	product: Product;
	onDelete: (id: string) => void;
};

const DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23f3f4f6'%3E%3Crect width='400' height='300' fill='%23f9fafb'/%3E%3Cpath d='M200 120 L240 160 L160 160 Z' fill='%23d1d5db'/%3E%3Ccircle cx='200' cy='180' r='20' fill='%23d1d5db'/%3E%3C/svg%3E";

export default function ProductCard({ product, onDelete }: Props) {
    return (
        <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden border border-gray-100">
            <div className="relative overflow-hidden">
                <img 
                    src={product.image || DEFAULT_IMAGE} 
                    alt={product.name} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-6 space-y-3">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                    {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {product.description}
                </p>
                <div className="text-primary font-bold text-2xl">
                    ${product.price.toFixed(2)}
                </div>
                
                <div className="flex flex-wrap gap-2 pt-3">
                    <Link 
                        to={`/products/${product.id}`} 
                        className="flex-1 min-w-fit px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                    >
                        👁️ View
                    </Link>
                    <Link 
                        to={`/edit/${product.id}`} 
                        className="flex-1 min-w-fit px-4 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                    >
                        ✏️ Edit
                    </Link>
                    <button 
                        onClick={() => onDelete(product.id)} 
                        className="flex-1 min-w-fit px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
}


