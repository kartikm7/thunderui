import axios from "axios";

export async function getDataset() {
  try {
    const response = await axios.get("https://huggingface.co/datasets/valentin-marquez/react-shadcn-codex/resolve/main/react_shadcn_codex.json");
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error("Error fetching dataset:", error);
  }
}

getDataset();