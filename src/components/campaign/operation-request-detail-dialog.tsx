import { RequestDetailDialog } from "@/components/admin/request-detail-dialog";

interface OperationRequestDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
}

export function OperationRequestDetailDialog({
  isOpen,
  onClose,
  requestId,
}: OperationRequestDetailDialogProps) {
  return (
    <RequestDetailDialog
      isOpen={isOpen}
      onClose={onClose}
      requestId={requestId}
      requestType="operation"
    />
  );
}
