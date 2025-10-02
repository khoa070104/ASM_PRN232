import { Box, Container, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
	const navigate = useNavigate();

	return (
		<Container sx={{ py: 4 }}>
			<Typography variant="h4" gutterBottom>Assignment PRN232 - KhoaNA</Typography>
			<Typography variant="h6" sx={{ mb: 1 }}>List Assignment:</Typography>
			<Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
				<List>
					<ListItemButton onClick={() => navigate('/asm01')}>
						<ListItemText primary="ASM01" secondary="CRUD Products" />
					</ListItemButton>
				</List>
			</Box>
		</Container>
	);
}


