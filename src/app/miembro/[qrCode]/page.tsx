import MemberPageClient from "./MemberPageClient";

export function generateStaticParams() {
  return [];
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ qrCode: string }>;
}) {
  const { qrCode } = await params;
  return <MemberPageClient qrCode={qrCode} />;
}
