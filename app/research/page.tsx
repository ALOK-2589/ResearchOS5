import { redirect } from "next/navigation";
import { ResearchExperience } from "./research-experience";

type ResearchPageProps = {
  searchParams: Promise<{ topic?: string | string[] }>;
};

function getTopicParam(topic: string | string[] | undefined): string | null {
  const value = Array.isArray(topic) ? topic[0] : topic;
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function generateMetadata({ searchParams }: ResearchPageProps) {
  const { topic } = await searchParams;
  const title = getTopicParam(topic);

  return {
    title: title ? `${title} | ResearchOS` : "Research | ResearchOS",
  };
}

export default async function ResearchPage({ searchParams }: ResearchPageProps) {
  const { topic } = await searchParams;
  const researchTopic = getTopicParam(topic);

  if (!researchTopic) {
    redirect("/");
  }

  return <ResearchExperience key={researchTopic} topic={researchTopic} />;
}
