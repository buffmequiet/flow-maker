import { getPartner } from "@/lib/bkend";
import { Partner } from "@/lib/types";
import PartnerForm from "@/components/PartnerForm";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditPartnerPage({ params }: Props) {
  const { id } = await params;
  let partner: Partner | null = null;
  try {
    partner = await getPartner(id);
  } catch {
    notFound();
  }
  if (!partner) notFound();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">업체 수정</h1>
        <p className="text-sm text-gray-500 mt-1">{partner.name_ko}</p>
      </div>
      <PartnerForm initial={partner} partnerId={id} />
    </div>
  );
}
