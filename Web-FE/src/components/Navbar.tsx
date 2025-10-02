import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);

	const pillBase = "px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-white/30";
	const pill = ({ isActive }: { isActive: boolean }) =>
		`${pillBase} ${isActive 
			? "bg-white/25 text-white" 
			: "bg-white/15 text-white hover:bg-white/25"
		}`;

	return (
		<header className="sticky top-0 z-50 shadow-2xl">
			<div className="w-full bg-gradient-to-r from-[#1e40af] via-[#3730a3] to-[#6b21a8]">
				<div className="w-full px-0">
					<div className="flex items-center gap-4 py-3 px-4">
						<Link 
							to="/" 
							className="text-white font-bold text-3xl tracking-wide hover:scale-105 transition-transform duration-300 drop-shadow-lg"
						>
							✨ E-Commerce
						</Link>
						
						<nav className="hidden md:flex items-center gap-4 ml-auto">
								<NavLink to="/" className={pill}>
									<span className="flex items-center gap-2 text-white">
										🏠 Home
									</span>
								</NavLink>
								<NavLink to="/create" className={pill}>
									<span className="flex items-center gap-2 text-white">
										➕ Create Product
									</span>
								</NavLink>
	                		</nav>

						<button
								aria-label="Toggle mobile menu"
								className="md:hidden text-white/90 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
								onClick={() => setOpen(v => !v)}
							>
								<svg 
									width="24" 
									height="24" 
									fill="none" 
									viewBox="0 0 24 24" 
									stroke="currentColor" 
									className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
								>
									{open ? (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									) : (
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									)}
								</svg>
							</button>
					</div>
				</div>
					
					{/* Mobile Menu */}
            		{open && (
						<div className="md:hidden pb-6 px-2">
							<div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 space-y-3 border border-white/30">
								<NavLink 
									to="/" 
									className={({ isActive }) => 
										`block px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
											isActive 
												? "bg-white text-blue-700 shadow-md"
												: "text-white bg-white/10 hover:bg-white/20"
										}`
									}
									onClick={() => setOpen(false)}
								>
									🏠 Home
								</NavLink>
								<NavLink 
									to="/create" 
									className={({ isActive }) => 
										`block px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
											isActive 
												? "bg-white text-blue-700 shadow-md"
												: "text-white bg-white/10 hover:bg-white/20"
										}`
									}
									onClick={() => setOpen(false)}
								>
									➕ Create Product
								</NavLink>
							</div>
						</div>
					)}
				</div>
		</header>
	);
}


