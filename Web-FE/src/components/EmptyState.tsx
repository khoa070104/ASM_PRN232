import { Link } from "react-router-dom";

const EMPTY_ILLUSTRATION = (
	<svg 
		viewBox="0 0 400 300" 
		className="w-64 h-48 mx-auto mb-8 opacity-70"
		fill="none" 
		xmlns="http://www.w3.org/2000/svg"
	>
		{/* Box */}
		<rect 
			x="150" 
			y="120" 
			width="100" 
			height="80" 
			rx="8" 
			fill="#e5e7eb" 
			stroke="#d1d5db" 
			strokeWidth="2"
		/>
		{/* Box lid */}
		<path 
			d="M140 120 L200 100 L260 120 L250 130 L200 110 L150 130 Z" 
			fill="#f3f4f6" 
			stroke="#d1d5db" 
			strokeWidth="2"
		/>
		{/* Floating dots */}
		<circle cx="120" cy="80" r="3" fill="#cbd5e1" opacity="0.6" />
		<circle cx="280" cy="90" r="2" fill="#cbd5e1" opacity="0.4" />
		<circle cx="100" cy="160" r="2" fill="#cbd5e1" opacity="0.5" />
		<circle cx="300" cy="140" r="3" fill="#cbd5e1" opacity="0.3" />
		{/* Stars */}
		<path d="M80 100 L82 106 L88 106 L83 110 L85 116 L80 112 L75 116 L77 110 L72 106 L78 106 Z" fill="#e2e8f0" />
		<path d="M320 160 L322 166 L328 166 L323 170 L325 176 L320 172 L315 176 L317 170 L312 166 L318 166 Z" fill="#e2e8f0" />
	</svg>
);

export default function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-4">
			{EMPTY_ILLUSTRATION}
			<h3 className="text-2xl font-semibold text-gray-600 mb-4 text-center">
				Chưa có sản phẩm nào
			</h3>
			<p className="text-gray-500 mb-8 text-center max-w-md">
				Hãy tạo sản phẩm đầu tiên để bắt đầu xây dựng cửa hàng của bạn!
			</p>
			<Link 
				to="/create"
				className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
			>
				<span className="text-xl">➕</span>
				Tạo sản phẩm đầu tiên
			</Link>
		</div>
	);
}
