export function formatRole(role) {
  if (!role) return "";
  // Replace underscores with spaces and capitalize each word
  return role
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}