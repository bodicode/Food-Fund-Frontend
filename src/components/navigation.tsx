"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, ChevronDown, Menu, HeartHandshake, Megaphone, Info } from "lucide-react";
import {
    Button,
} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import { MegaMenu } from "./mega-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function Navigation() {
    const [openSearch, setOpenSearch] = useState(false);

    return (
        <header className="absolute top-0 left-0 z-50 w-full bg-transparent">
            <nav className="container mx-auto px-4">
                <div className="hidden md:grid grid-cols-3 items-center h-22">
                    <div className="flex items-center gap-6">
                        <Dialog open={openSearch} onOpenChange={setOpenSearch}>
                            <DialogTrigger asChild>
                                <button
                                    className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                                    aria-label="Search"
                                >
                                    <Search className="h-5 w-5" />
                                    <span>Tìm kiếm</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">

                                <VisuallyHidden>
                                    <DialogTitle>Tìm kiếm chiến dịch</DialogTitle>
                                </VisuallyHidden>

                                <div className="flex gap-2">
                                    <Input
                                        autoFocus
                                        placeholder="Tìm kiếm theo tên chiến dịch"
                                    />
                                    <Button onClick={() => setOpenSearch(false)}>Tìm</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <MegaMenu
                            label="Ủng hộ"
                            description="Khám phá chiến dịch và tổ chức để hỗ trợ"
                            icon={<HeartHandshake className="h-5 w-5" />}
                            sections={[
                                {
                                    heading: "Danh mục chiến dịch",
                                    items: [
                                        { title: "Chiến dịch nổi bật", desc: "Các chiến dịch được cộng đồng quan tâm", href: "/donate/featured" },
                                        { title: "Khẩn cấp", desc: "Các trường hợp cần cứu trợ khẩn cấp", href: "/donate/emergency" },
                                        { title: "Hỗ trợ cá nhân", desc: "Giúp đỡ người bệnh, trẻ em, người già...", href: "/donate/personal" },
                                        { title: "Tổ chức xã hội", desc: "Gây quỹ cho nhóm thiện nguyện, tổ chức phi lợi nhuận", href: "/donate/organizations" },
                                    ],
                                },
                                {
                                    heading: "Hỗ trợ & định hướng",
                                    items: [
                                        { title: "Cách ủng hộ", desc: "Các hình thức ủng hộ an toàn & nhanh chóng", href: "/donate/how-to" },
                                        { title: "Hành trình yêu thương", desc: "Câu chuyện thực tế từ người nhận hỗ trợ", href: "/donate/stories" },
                                        { title: "Trung tâm hỗ trợ", desc: "Hướng dẫn, câu hỏi thường gặp", href: "/help" },
                                    ],
                                },
                            ]}
                        />


                        <MegaMenu
                            label="Gây quỹ"
                            description="Tạo và phát triển chiến dịch gây quỹ thành công"
                            icon={<Megaphone className="h-5 w-5" />}
                            sections={[
                                {
                                    heading: "Khởi tạo chiến dịch",
                                    items: [
                                        { title: "Tạo chiến dịch mới", desc: "Khởi động chiến dịch chỉ trong 2 phút", href: "/start" },
                                        { title: "Mẫu chiến dịch", desc: "Chọn mẫu theo mục tiêu: học phí, y tế, bếp ăn...", href: "/start/templates" },
                                        { title: "Tính phí & minh bạch", desc: "Chính sách phí và cách đảm bảo minh bạch", href: "/start/pricing" },
                                    ],
                                },
                                {
                                    heading: "Tăng trưởng & lan toả",
                                    items: [
                                        { title: "Mẹo gây quỹ", desc: "Lời khuyên giúp bạn gây quỹ hiệu quả hơn", href: "/start/tips" },
                                        { title: "Hợp tác cùng tổ chức", desc: "Gây quỹ cùng với tổ chức từ thiện", href: "/partners" },
                                        { title: "Câu chuyện thành công", desc: "Chiến dịch đạt mục tiêu vượt mong đợi", href: "/start/success-stories" },
                                    ],
                                },
                            ]}
                        />
                    </div>

                    <div className="flex items-center justify-center h-[64px]">
                        <Link href="/" className="inline-flex items-center" aria-label="Home">
                            <Image
                                src="/images/logo.png"
                                alt="FoodFund Logo"
                                width={200}
                                height={200}
                                className="w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="flex items-center justify-end gap-6">
                        <MegaMenu
                            label="Về chúng tôi"
                            description="Về FoodFund & các nguồn hỗ trợ"
                            icon={<Info className="h-5 w-5" />}
                            sections={[
                                {
                                    items: [
                                        { title: "Về FoodFund", desc: "Sứ mệnh, giá trị và đội ngũ", href: "/about" },
                                        { title: "Minh bạch & An toàn", desc: "Quy trình kiểm duyệt, trách nhiệm", href: "/trust-safety" },
                                        { title: "Blog & Tin tức", desc: "Câu chuyện tác động & cập nhật", href: "/blog" },
                                    ],
                                },
                                {
                                    items: [
                                        { title: "Trung tâm trợ giúp", desc: "FAQ & hướng dẫn chi tiết", href: "/help" },
                                        { title: "Liên hệ", desc: "Hỗ trợ người dùng & đối tác", href: "/contact" },
                                        { title: "Tuyển dụng", desc: "Gia nhập đội ngũ FoodFund", href: "/careers" },
                                    ],
                                },
                            ]}
                            align="end"
                        />

                        <Link
                            href="/login"
                            className="text-white hover:text-white/80 transition-colors"
                        >
                            Đăng nhập
                        </Link>
                    </div>

                </div>

                <div className="flex md:hidden items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Open menu">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[320px]">
                                <SheetHeader>
                                    <Image src="/images/logo.png" alt="FoodFund" width={100} height={100} />
                                </SheetHeader>

                                <div className="mt-4 space-y-1">
                                    <MobileItem href="/donate" label="Ủng hộ" />
                                    <MobileItem href="/start" label="Gây quỹ" />
                                    <MobileItem href="/about" label="Về chúng tôi" />
                                    <MobileItem href="/signin" label="Đăng nhập" />
                                </div>

                                <div className="mt-6">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full">
                                                <Search className="mr-2 h-4 w-4" />
                                                Tìm kiếm
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <VisuallyHidden>
                                                <DialogTitle>Tìm kiếm chiến dịch</DialogTitle>
                                            </VisuallyHidden>

                                            <div className="flex gap-2">
                                                <Input placeholder="Tìm kiếm theo tên chiến dịch" />
                                                <Button>Tìm</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Link href="/" aria-label="Home" className="inline-flex items-center">
                            <Image
                                src="/images/logo.png"
                                alt="FoodFund"
                                width={100}
                                height={24}
                                className="h-6 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="rounded-full h-9 px-3 border-foreground/20"
                    >
                        <Link href="/start">Tạo chiến dịch</Link>
                    </Button>
                </div>
            </nav>
        </header>
    );
}

function MobileItem({
    href,
    label,
}: {
    href: string;
    label: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent"
        >
            <span>{label}</span>
            <ChevronDown className="h-4 w-4 rotate-[-90deg] text-muted-foreground" />
        </Link>
    );
}
