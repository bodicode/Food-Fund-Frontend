"use client";

import React from "react";
import { CreditCard, FileText, Globe, HelpCircle, Search, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader } from "@/components/animate-ui/icons/loader";
import { BankInfo } from "@/services/bank.service";

interface BankAccountSectionProps {
  form: {
    bank_account_number: string;
    bank_short_name: string;
    bank_name: string;
    bank_account_name: string;
  };
  errors: Record<string, string | undefined>;
  banks: BankInfo[];
  bankSearchQuery: string;
  isLoadingBanks: boolean;
  isVerifyingBank: boolean;
  isBankAccountLocked: boolean;
  isBankLookupDialogOpen: boolean;
  bankVerificationError: string | null;
  bankVerificationSuccess: string | null;
  loading: boolean;
  imagePreview: string | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFormBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBankSearchChange: (value: string) => void;
  onBankSelect: (bank: BankInfo) => void;
  onBankLookupDialogChange: (open: boolean) => void;
  onVerifyBank: () => void;
  fieldClass: (key: string) => string;
  ErrorLine: (props: { keyName: string }) => React.JSX.Element | null;
  refs: React.MutableRefObject<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>;
  filteredBanks: BankInfo[];
}

export const BankAccountSection = React.memo(function BankAccountSection({
  form,
  bankSearchQuery,
  isLoadingBanks,
  isVerifyingBank,
  isBankAccountLocked,
  isBankLookupDialogOpen,
  bankVerificationError,
  bankVerificationSuccess,
  loading,
  imagePreview,
  onFormChange,
  onFormBlur,
  onBankSearchChange,
  onBankSelect,
  onBankLookupDialogChange,
  onVerifyBank,
  fieldClass,
  ErrorLine,
  refs,
  filteredBanks,
}: BankAccountSectionProps) {
  return (
    <div className="md:col-span-2 pt-4">
      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm font-semibold text-amber-900 mb-2">📋 Hướng dẫn:</p>
        <ol className="text-sm text-amber-800 space-y-1 ml-4 list-decimal">
          <li>Nhập số tài khoản ngân hàng của bạn</li>
          <li>Bấm vào dấu <strong>?</strong> ở ô &quot;Mã ngân hàng&quot; để tìm mã và tên ngân hàng</li>
          <li>Sau khi chọn ngân hàng, bấm nút <strong>Check</strong> để xác nhận</li>
          <li>Tên chủ tài khoản sẽ được điền tự động</li>
        </ol>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Thông tin Tài khoản Ngân hàng</h3>
            <p className="text-xs text-gray-600 mt-0.5">Để nhận tiền ủng hộ từ cộng đồng</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Số tài khoản */}
          <div className="space-y-2">
            <Label htmlFor="bank_account_number" className="text-sm font-semibold text-gray-700">
              Số tài khoản <span className="text-red-500">*</span>
            </Label>
            <div className="relative group">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <Input
                id="bank_account_number"
                name="bank_account_number"
                ref={(el) => {
                  refs.current.bank_account_number = el;
                }}
                value={form.bank_account_number}
                onChange={onFormChange}
                onBlur={onFormBlur}
                placeholder="1234567890123"
                className={fieldClass("bank_account_number")}
                disabled={loading || !imagePreview}
              />
            </div>
            <ErrorLine keyName="bank_account_number" />
          </div>

          {/* Mã ngân hàng + Check Button */}
          <div className="space-y-2">
            <Label htmlFor="bank_short_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Mã ngân hàng <span className="text-red-500">*</span>
              <Dialog open={isBankLookupDialogOpen} onOpenChange={onBankLookupDialogChange}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                    title="Tìm mã ngân hàng của bạn"
                  >
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden" onWheel={(e) => e.stopPropagation()}>
                  <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                    <DialogTitle>Danh sách Ngân hàng</DialogTitle>
                    <DialogDescription>Tìm kiếm và chọn ngân hàng của bạn</DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4 overscroll-contain">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Tìm kiếm ngân hàng..."
                        value={bankSearchQuery}
                        onChange={(e) => onBankSearchChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="space-y-2">
                      {isLoadingBanks ? (
                        <div className="flex justify-center py-8">
                          <Loader className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                      ) : filteredBanks.length > 0 ? (
                        filteredBanks.map((bank) => (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() => onBankSelect(bank)}
                            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-900">{bank.name}</p>
                              <p className="text-xs text-gray-500">{bank.code}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-8">Không tìm thấy ngân hàng</p>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Label>
            <div className="flex gap-2">
              <div className="relative group flex-1">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <Input
                  id="bank_short_name"
                  name="bank_short_name"
                  ref={(el) => {
                    refs.current.bank_short_name = el;
                  }}
                  value={form.bank_short_name}
                  onChange={onFormChange}
                  onBlur={onFormBlur}
                  placeholder="VCB"
                  className={fieldClass("bank_short_name")}
                  disabled={loading || !imagePreview}
                />
              </div>
              <Button
                type="button"
                onClick={onVerifyBank}
                disabled={isVerifyingBank || !form.bank_account_number || !form.bank_short_name || isBankAccountLocked}
                className="self-end bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all disabled:opacity-50 h-12"
              >
                {isVerifyingBank ? <Loader className="w-4 h-4 animate-spin" /> : "Check"}
              </Button>
            </div>
            <ErrorLine keyName="bank_short_name" />
          </div>

          {/* Tên ngân hàng */}
          <div className="space-y-2">
            <Label htmlFor="bank_name" className="text-sm font-semibold text-gray-700">
              Tên ngân hàng <span className="text-red-500">*</span>
            </Label>
            <div className="relative group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <Input
                id="bank_name"
                name="bank_name"
                ref={(el) => {
                  refs.current.bank_name = el;
                }}
                value={form.bank_name}
                onChange={onFormChange}
                onBlur={onFormBlur}
                placeholder="Ngân hàng TMCP Ngoại Thương Việt Nam"
                className={fieldClass("bank_name")}
                disabled={loading || !imagePreview}
              />
            </div>
            <ErrorLine keyName="bank_name" />
          </div>

          {/* Tên chủ tài khoản - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="bank_account_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Tên chủ tài khoản <span className="text-red-500">*</span>
              {form.bank_account_name && (
                <div className="flex items-center gap-1 text-green-600">
                  <Shield className="w-3 h-3" />
                  <span className="text-xs font-normal">Đã xác nhận</span>
                </div>
              )}
            </Label>
            <div className="relative group">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {form.bank_account_name && <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />}
              <Input
                id="bank_account_name"
                name="bank_account_name"
                ref={(el) => {
                  refs.current.bank_account_name = el;
                }}
                value={form.bank_account_name}
                placeholder="Sẽ được điền tự động sau khi check"
                className={`${fieldClass("bank_account_name")} bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed`}
                disabled={true}
                readOnly={true}
              />
            </div>
            <ErrorLine keyName="bank_account_name" />
          </div>
        </div>

        {/* Bank Verification Messages */}
        {bankVerificationError && (
          <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg md:col-span-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{bankVerificationError}</p>
          </div>
        )}

        {bankVerificationSuccess && (
          <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg md:col-span-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-700 font-medium">{bankVerificationSuccess}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
