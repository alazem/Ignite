import IgniteAnimation from '@/components/ignite-animation';

export const metadata = {
    title: 'Ignite | Experience the Flame',
    description: 'A stunning fire animation representing the moment something catches fire and transforms into energy and motion.',
};

export default function IgnitePage() {
    return (
        <main className="relative">
            <IgniteAnimation
                showText={true}
                textContent="Ignite"
                autoIgnite={true}
                igniteDelay={1500}
            />

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <div className="flex flex-col items-center gap-2 text-white/50">
                    <span className="text-sm tracking-widest uppercase">Click to ignite</span>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </main>
    );
}
