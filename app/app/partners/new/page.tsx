import PartnerForm from "@/components/PartnerForm";

export default function NewPartnerPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">업체 등록</h1>
        <p className="text-sm text-gray-500 mt-1">새 제휴업체를 등록합니다.</p>
      </div>
      <PartnerForm />
    </div>
  );
}
