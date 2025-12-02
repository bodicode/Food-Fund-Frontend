"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { organizationService } from "@/services/organization.service";
import { campaignService } from "@/services/campaign.service";
import { EligibleOrganization } from "@/types/api/organization";
import { Campaign } from "@/types/api/campaign";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/animate-ui/icons/loader";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ReassignCampaignPage() {
    const params = useParams();
    const router = useRouter();
    const campaignId = params.id as string;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [organizations, setOrganizations] = useState<EligibleOrganization[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrgIds, setSelectedOrgIds] = useState<string[]>([]);
    const [reason, setReason] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [campaignData, orgsData] = await Promise.all([
                campaignService.getCampaignById(campaignId),
                organizationService.getEligibleOrganizations(campaignId),
            ]);

            setCampaign(campaignData);
            setOrganizations(orgsData.organizations);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, [campaignId]);

    useEffect(() => {
        if (campaignId) {
            fetchData();
        }
    }, [campaignId, fetchData]);

    const handleToggleOrg = (orgId: string) => {
        setSelectedOrgIds((prev) =>
            prev.includes(orgId)
                ? prev.filter((id) => id !== orgId)
                : [...prev, orgId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrgIds.length === organizations.length) {
            setSelectedOrgIds([]);
        } else {
            setSelectedOrgIds(organizations.map((org) => org.id));
        }
    };

    const handleAssign = async () => {
        if (selectedOrgIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất một tổ chức");
            return;
        }
        if (!reason.trim()) {
            toast.error("Vui lòng nhập lý do điều phối");
            return;
        }

        setIsAssigning(true);
        try {
            await campaignService.assignCampaignToOrganizations({
                campaignId,
                organizationIds: selectedOrgIds,
                reason,
            });
            toast.success("Đã điều phối chiến dịch thành công");
            router.push("/admin/cancelled-campaigns");
        } catch (error) {
            console.error("Error assigning campaign:", error);
            toast.error("Có lỗi xảy ra khi điều phối chiến dịch");
        } finally {
            setIsAssigning(false);
            setIsConfirmOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader animate loop className="w-8 h-8 text-gray-400" />
            </div>
        );
    }

    if (!campaign) {
        return <div>Không tìm thấy chiến dịch</div>;
    }

    return (
        <div className="space-y-6 mt-14">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Điều phối chiến dịch
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Chiến dịch: <span className="font-medium text-gray-900">{campaign.title}</span>
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsConfirmOpen(true)}
                    disabled={selectedOrgIds.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                    <CheckCircle className="w-4 h-4" />
                    Điều phối ({selectedOrgIds.length})
                </Button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Danh sách tổ chức phù hợp
                    </h2>
                    <p className="text-sm text-gray-500">
                        Chọn các tổ chức để tiếp nhận chiến dịch này
                    </p>
                </div>

                <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                            <tr>
                                <th className="sticky top-0 z-10 w-12 px-4 py-3 bg-gray-200 dark:bg-[#334155] shadow-sm text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrgIds.length === organizations.length && organizations.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                {[
                                    "Tên tổ chức",
                                    "Người đại diện",
                                    "Lĩnh vực",
                                    "Liên hệ",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="sticky top-0 z-10 text-left text-gray-700 dark:text-gray-200 text-sm font-semibold whitespace-nowrap px-4 py-3 bg-gray-200 dark:bg-[#334155] shadow-sm"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {organizations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-sm text-center text-gray-500">
                                        Không tìm thấy tổ chức nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                organizations.map((org, idx) => (
                                    <tr
                                        key={org.id}
                                        className={`
                                        border-t border-gray-200 dark:border-gray-700 
                                        text-gray-800 dark:text-gray-100 
                                        hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer
                                        ${idx % 2 === 0
                                                ? "bg-white dark:bg-slate-900"
                                                : "bg-gray-50/70 dark:bg-slate-800/40"
                                            }
                                    `}
                                        onClick={() => handleToggleOrg(org.id)}
                                    >
                                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedOrgIds.includes(org.id)}
                                                onChange={() => handleToggleOrg(org.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap font-medium">
                                            {org.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            {org.representativeName || "Chưa cập nhật"}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            {org.activityField || "Chưa cập nhật"}
                                        </td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span>{org.phoneNumber}</span>
                                                <span className="text-gray-500 text-xs">{org.email}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Dialog */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Xác nhận điều phối</h3>
                        <p className="text-sm text-gray-600">
                            Bạn đang điều phối chiến dịch cho <span className="font-bold">{selectedOrgIds.length}</span> tổ chức.
                            Vui lòng nhập lý do điều phối bên dưới.
                        </p>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do điều phối..."
                            className="w-full min-h-[100px] p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsConfirmOpen(false)}
                                disabled={isAssigning}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleAssign}
                                disabled={isAssigning || !reason.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            >
                                {isAssigning && <Loader animate loop className="w-4 h-4" />}
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
