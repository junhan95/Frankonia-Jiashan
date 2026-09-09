import type { Lang } from "./site-config";

export const legalSections = ["imprint", "privacy"] as const;
export type LegalSection = (typeof legalSections)[number];
export const legalPath = (section: LegalSection) => `/${section}`;
export const legalMeta: Record<Lang, Record<LegalSection, { label: string; description: string }>> = {
  zh: {
    imprint: { label: "法律声明", description: "Jiashan Frankonia EMC Co., Ltd. 网站运营信息、企业登记及备案信息。未核实事项以 [ ] 标示。" },
    privacy: { label: "隐私政策", description: "嘉善网站的个人信息处理说明：访问日志、询价、本地存储、境外接收方及个人信息权利。" },
  },
  en: {
    imprint: { label: "Imprint", description: "Website operator, company registration and filing information for Jiashan Frankonia EMC Co., Ltd. Unverified details are marked [ ]." },
    privacy: { label: "Privacy Policy", description: "Personal information on the Jiashan website: access logs, enquiries, local storage, overseas recipients and individual rights." },
  },
};
