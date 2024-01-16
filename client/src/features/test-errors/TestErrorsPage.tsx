import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

export default function AboutPage() {
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	function getValidationError() {
		agent.TestErrors.getValidationError()
			//We are expecting a 400, so the promise will not be fulfilled, which means the code after "then" should not be executed
			.then(() => console.log("should not see this"))
			.catch(error => setValidationErrors(error));
	}
	return (
		<Container>
			<Typography gutterBottom variant="h2">Errors Testing Page</Typography>
			<ButtonGroup fullWidth>
				<Button variant='contained' onClick={() => agent.TestErrors.get400Error().catch(error => console.log(error))}> Test 400 Error </Button>
				<Button variant='contained' onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))}> Test 401 Error </Button>
				<Button variant='contained' onClick={() => agent.TestErrors.get404Error().catch(error => console.log(error))}> Test 404 Error </Button>
				<Button variant='contained' onClick={() => agent.TestErrors.get500Error().catch(error => console.log(error))}> Test 500 Error </Button>
				<Button variant='contained' onClick={getValidationError}> Test Validation Error </Button>
			</ButtonGroup>
			{/*T he code after the && will be executed if the condition before is true*/}
			{validationErrors.length > 0 &&
				<Alert severity='error'>
					<AlertTitle> Validation Errors </AlertTitle>
					<List>
						{validationErrors.map(error => (
							<ListItem key={error}>
								<ListItemText>{error}</ListItemText>
							</ListItem>
						))}
					</List>
				</Alert>
			}
		</Container>

	)
}