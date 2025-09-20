import UserPageWrapper from "@/components/UserPageClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `GitFlex - ${username}`,
    description: `GitHub contribution calendar for ${username}`,
  };
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params;

  return <UserPageWrapper username={username} />;
}
