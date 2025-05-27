import { apiClient } from "../api-client/api-client";
import HomeComponent from "../components/home/home.component";


async function checkHealth() {
  try {
      const res = await apiClient.get('health');
  } catch (e) {
      throw e;
  }
}


export default async function App() {
  return <HomeComponent />;
}
