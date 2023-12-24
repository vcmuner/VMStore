import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props {
	darkMode: boolean
	handleThemeChange: () => void
}

export default function Header({ darkMode, handleThemeChange }: Props) {
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6">NightCraft Store</Typography>
				<Switch checked={darkMode} onChange={handleThemeChange} />
			</Toolbar>
		</AppBar>
	)
}