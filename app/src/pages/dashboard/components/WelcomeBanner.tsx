import { Calendar, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface WelcomeBannerProps {
    name: string;
    primaryStat: {
        title: string;
        value: string;
        icon: LucideIcon;
    };
    ctaLabel: string;
    ctaLink: string;
}

export function WelcomeBanner({ name, primaryStat, ctaLabel, ctaLink }: WelcomeBannerProps) {
    return (
        <div className="group bg-gradient-to-br from-white via-white to-blue-50/50 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-900/10 border border-[#243F76]/10 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-500 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
            <div className="flex-1 space-y-1 z-10">
                <h2 className="text-2xl font-semibold text-[#1A2E56] dark:text-white" data-testid="text-welcome">
                    Welcome back, {name}!
                </h2>
                <div className="flex items-center gap-4 text-sm text-[#243F76]/70 dark:text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 ml-[5px] sm:ml-0" />
                        <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div className="hidden sm:block w-px h-3 bg-[#243F76]/20 dark:bg-border" />
                    <div className="flex items-center gap-1.5">
                        <primaryStat.icon className="h-4 w-4 ml-[5px] sm:ml-0" />
                        <span><span className="font-semibold">{primaryStat.value}</span> {primaryStat.title}</span>
                    </div>
                </div>
            </div>

            <div className="z-10">
                <Link href={ctaLink}>
                    <Button className="bg-[#106bc6] hover:bg-[#0e5a9e] text-white gap-2 shadow-md h-9 md:h-11 px-5 md:px-8 text-sm md:text-base">
                        {ctaLabel}
                    </Button>
                </Link>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-[#243F76]/5 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
