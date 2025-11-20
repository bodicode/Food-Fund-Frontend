export interface BankInfo {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name?: string;
}

export interface BankAccountInfo {
  accountNumber: string;
  accountName: string;
  bank: string;
  ownerName?: string;
}

export const bankService = {
  async getAllBanks(): Promise<BankInfo[]> {
    try {
      const response = await fetch("https://api.vietqr.io/v2/banks");
      if (!response.ok) {
        throw new Error("Failed to fetch banks");
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching banks:", error);
      return [];
    }
  },

  async lookupBankAccount(
    bank: string,
    account: string
  ): Promise<BankAccountInfo | null> {
    try {
      const response = await fetch("https://api.banklookup.net", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "f98b46af-dc78-4cdb-8af8-a76684dc6511key",
          "x-api-secret": "494fe9b4-9cd0-4126-b11b-d77b0dbd84f9secret",
        },
        body: JSON.stringify({
          bank,
          account,
        }),
      });

      const data = await response.json();
      
      console.log("Bank lookup response:", data);

      // Check API response code first (API returns 200 but code can be 422)
      if (data.code === 422 || !data.success) {
        throw new Error(
          data.msg === "API_INFO_NOT_FOUND"
            ? "Không tìm thấy tài khoản. Vui lòng kiểm tra lại mã ngân hàng và số tài khoản."
            : data.msg || "Không thể xác nhận tài khoản"
        );
      }

      // Check if data exists and has results
      if (data.data) {
        const accountData = Array.isArray(data.data) ? data.data[0] : data.data;
        
        if (accountData && accountData.ownerName) {
          return {
            accountNumber: accountData.account || account,
            accountName: accountData.ownerName || accountData.accountName || "",
            bank: accountData.bank || bank,
            ownerName: accountData.ownerName,
          };
        }
      }

      throw new Error("Không tìm thấy thông tin tài khoản");
    } catch (error) {
      console.error("Error looking up bank account:", error);
      throw error;
    }
  },
};
