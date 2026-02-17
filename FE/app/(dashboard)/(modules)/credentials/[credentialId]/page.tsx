import { requireAuth } from "@/lib/auth-utils";

const Page = async ({ params }: PageProps<"/credentials/[credentialId]">) => {
  await requireAuth();
  const { credentialId } = await params;
  return <p>{credentialId}</p>;
};

export default Page;
