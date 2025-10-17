import { Button } from "@/components/ui/button";

export function ActionPanel({
  canEdit,
  onEdit,
  onViewDonations,
  onDirection,
}: {
  canEdit: boolean;
  onEdit: () => void;
  onViewDonations: () => void;
  onDirection?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">Hành động</h3>
      <div className="grid grid-cols-1 gap-3">
        <Button onClick={onEdit} className="btn-color" disabled={!canEdit}>
          Chỉnh sửa chiến dịch
        </Button>
        <Button variant="outline" onClick={onViewDonations}>
          Xem quyên góp
        </Button>
        {onDirection && (
          <Button variant="outline" onClick={onDirection}>
            Chỉ đường
          </Button>
        )}
      </div>
    </div>
  );
}
