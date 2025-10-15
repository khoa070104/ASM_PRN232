import { CssBaseline, ThemeProvider, createTheme, Container } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductsPage from "./features/products/ProductsPage";
import HomePage from "./components/HomePage";
import CartPage from "./features/cart/CartPage";
import CheckoutPage from "./features/orders/CheckoutPage";
import OrderHistoryPage from "./features/orders/OrderHistoryPage";
import PaymentSuccess from "./features/orders/PaymentSuccess";
import Header from "./components/Header";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ProductDetailPage from "./features/products/ProductDetailPage";
import ProductManagementPage from "./features/products/ProductManagementPage";
import ProtectedRoute from "./components/ProtectedRoute";
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
						<Header />
						<Container maxWidth="lg">
							<Routes>
								<Route path="/" element={<HomePage />} />
								<Route path="/asm" element={<ProductsPage />} />
								<Route path="/product/:id" element={<ProductDetailPage />} />
								<Route path="/login" element={<LoginPage />} />
								<Route path="/register" element={<RegisterPage />} />
								<Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
								<Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
								<Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
								<Route path="/payment-success" element={<PaymentSuccess />} />
								<Route path="/admin/products" element={<ProtectedRoute><ProductManagementPage /></ProtectedRoute>} />
							</Routes>
						</Container>
					</BrowserRouter>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}


