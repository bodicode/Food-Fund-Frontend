"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import client from "@/lib/apollo-client";
import { GET_PUBLIC_PHASE_DISBURSEMENTS } from "@/graphql/query/disbursement/get-public-phase-disbursements";
import { formatCurrency } from "@/lib/utils/currency-utils";
import { formatDateTime } from "@/lib/utils/date-utils";
import { Loader } from "@/components/animate-ui/icons/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DollarSign,
    Calendar,
    User,
    FileText,
    AlertCircle,
    X,
} from "lucide-react";

interface Disbursement {
    id: string;
    amount: string;
    campaignPhaseId: string;
    completedAt?: string;
    createdAt: string;
    transactionType: "INGREDIENT" | "COOKING" | "DELIVERY";
    proof: string;
    receiver: {
        fullName: string;
        id: string;
        username: string;
        role: string;
        email: string;
    };
}

interface DisbursementListProps {
    campaignPhaseId: string;
}

const transactionTypeLabels: Record<string, string> = {
    INGREDIENT: "Nguyên liệu",
    COOKING: "Nấu ăn",
    DELIVERY: "Vận chuyển",
};

export function DisbursementList({ campaignPhaseId }: DisbursementListProps) {
    const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedProofUrl, setSelectedProofUrl] = useState<string>("");

    useEffect(() => {
        const fetchDisbursements = async () => {
            try {
                const { data } = await client.query<{
                    getPublicPhaseDisbursements: Disbursement[];
                }>({
                    query: GET_PUBLIC_PHASE_DISBURSEMENTS,
                    variables: { campaignPhaseId },
                    fetchPolicy: "no-cache",
                });

                if (data?.getPublicPhaseDisbursements) {
                    setDisbursements(data.getPublicPhaseDisbursements);
                }
            } catch (error) {
                console.error("Error fetching disbursements:", error);
            } finally {
                setLoading(false);
            }
        };

        if (campaignPhaseId) {
            fetchDisbursements();
        }
    }, [campaignPhaseId]);

    const openLightbox = (proofUrl: string) => {
        setSelectedProofUrl(`https://foodfund.sgp1.cdn.digitaloceanspaces.com/${proofUrl}`);
        setLightboxOpen(true);
    };

    const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
    const isPdf = (url: string) => /\.pdf$/i.test(url);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-color" />
            </div>
        );
    }

    if (disbursements.length === 0) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có giải ngân nào cho giai đoạn này</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {disbursements.map((disbursement) => (
                <Card key={disbursement.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <div>
                                    <p className="text-xs text-gray-600">Số tiền</p>
                                    <p className="font-bold text-green-600">
                                        {formatCurrency(parseFloat(disbursement.amount))}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                    <span className="text-gray-600">Loại giao dịch:</span>
                                    <span className="font-medium">{transactionTypeLabels[disbursement.transactionType]}</span>
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <div>
                                    <p className="text-xs text-gray-600">Người nhận</p>
                                    <p className="font-medium text-gray-900">
                                        {disbursement.receiver.fullName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-600" />
                                <div>
                                    <p className="text-xs text-gray-600">Ngày giải ngân</p>
                                    <p className="font-medium text-gray-900">
                                        {formatDateTime(new Date(disbursement.createdAt))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => openLightbox(disbursement.proof)}
                                className="text-sm text-blue-600 hover:underline p-0 h-auto"
                            >
                                Xem hóa đơn giải ngân
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Lightbox Dialog */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="!max-w-[98vw] !w-[98vw] !h-[98vh] p-0 bg-black/95 border-none" showCloseButton={false}>
                    <DialogTitle className="sr-only">Chứng chỉ giải ngân</DialogTitle>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Content Display */}
                        <div className="relative w-full h-full flex items-center justify-center p-12">
                            {isImage(selectedProofUrl) ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={selectedProofUrl}
                                        alt="Chứng chỉ giải ngân"
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                    />
                                </div>
                            ) : isPdf(selectedProofUrl) ? (
                                <iframe
                                    src={selectedProofUrl}
                                    className="w-full h-full"
                                    title="Chứng chỉ giải ngân"
                                />
                            ) : (
                                <div className="text-white text-center">
                                    <p className="mb-4">Không thể hiển thị file này</p>
                                    <a
                                        href={selectedProofUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        Tải xuống file
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
