"use client"
import { toast } from "sonner";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

export default function VanishInput() {
  const placeholder = [
    "Responsive navbar with dropdowns.",
    "Card with image, title, and text.",
    "Login form with email and password.",
    "Sidebar with expandable sections.",
    "Modal with 'Yes'/'No' buttons.",
    "Hero section with background and CTA.",
    "Paginated list with search.",
    "Profile card with avatar and links.",
    "Pricing table with three tiers.",
    "Footer with links and social icons.",
    "Progress bar for multi-step form.",
    "Image carousel with navigation.",
    "Contact form with fields and submit.",
    "Notification banner with dismiss.",
    "Tabbed interface for content switch.",
    "Product card with price and 'Add to Cart'.",
    "Timeline with dates and events.",
    "Responsive photo grid layout.",
    "Dropdown menu with subcategories.",
    "Dashboard with stats and graphs."
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    toast.success(`Haven't figured how to pass the input to the generate route!`)
    e.preventDefault();
  };
  return (
      <PlaceholdersAndVanishInput
        placeholders={placeholder}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
  );
}