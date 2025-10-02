import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductsPage from "./features/products/ProductsPage";
import HomePage from "./components/HomePage";

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
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/asm01" element={<ProductsPage />} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</QueryClientProvider>
	);
}


