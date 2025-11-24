export function validateTeam({ teamName, selectedValue }) {
  let teamNameError = "";
  let selectionError = "";

  // Team name validation
  if (!teamName.trim()) {
    teamNameError = "Team name is required.";
  } else if (teamName.length < 3) {
    teamNameError = "Team name should be at least 3 characters long.";
  } else if (teamName.length > 20) {
    teamNameError = "Team name should not exceed 10 characters.";
  } else if (!/^[A-Za-z0-9\s]+$/.test(teamName)) {
    teamNameError = "Team name should only contain letters, numbers, and spaces.";
  } else {
    teamNameError = "";
  }

  // Team category (dropdown) validation
  if (!selectedValue) {
    selectionError = "Please select a team category.";
  } else if (!["personal", "organization", "college"].includes(selectedValue)) {
    selectionError = "Invalid team category selected.";
  } else {
    selectionError = "";
  }

  return { teamNameError, selectionError };
}
