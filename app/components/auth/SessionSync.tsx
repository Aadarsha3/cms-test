import { useProfileFetcher } from "@/hooks/useProfileFetcher";
export function SessionSync() {
  useProfileFetcher();

  return null;
}
