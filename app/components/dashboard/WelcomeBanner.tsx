import { Calendar } from "lucide-react";

interface WelcomeBannerProps {
    name: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
    return (
        <div className="group bg-gradient-to-br from-white via-white to-blue-50/50 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-900/10 border border-[#243F76]/10 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-500 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-6 overflow-hidden relative">
            <div className="z-10 text-center sm:text-left">
                <h2 className="text-xl md:text-2xl font-semibold text-[#1A2E56] dark:text-white" data-testid="text-welcome">
                    Welcome back, {name}!
                </h2>
            </div>

            <div className="z-10 flex items-center gap-2 text-xs md:text-base font-medium text-[#243F76]/80 dark:text-muted-foreground bg-[#243F76]/5 dark:bg-white/5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-[#243F76]/10 dark:border-white/10">
                <Calendar className="h-3.5 w-3.5 md:h-5 md:w-5 text-[#243F76] dark:text-blue-400 shrink-0" />
                <span className="truncate sm:whitespace-nowrap">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-[#243F76]/5 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
