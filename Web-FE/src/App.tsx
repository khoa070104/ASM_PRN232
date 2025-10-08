import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductsPage from "./features/products/ProductsPage";
import HomePage from "./components/HomePage";
import CartPage from "./features/cart/CartPage";
import CheckoutPage from "./features/orders/CheckoutPage";
import OrderHistoryPage from "./features/orders/OrderHistoryPage";
import { AuthProvider } from "./features/auth/AuthContext";

const theme = createTheme({});
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 0,
			staleTime: 30_000,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/asm01" element={<ProductsPage />} />
							<Route path="/cart" element={<CartPage />} />
							<Route path="/checkout" element={<CheckoutPage />} />
							<Route path="/orders" element={<OrderHistoryPage />} />
						</Routes>
					</BrowserRouter>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}


