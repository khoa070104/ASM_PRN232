import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" sx={{ flexGrow: 1 }}>
					E-Commerce
				</Typography>
				<Button color="inherit" component={Link} to="/">Home</Button>
				<Button color="inherit" component={Link} to="/create">Create</Button>
			</Toolbar>
		</AppBar>
	);
}


