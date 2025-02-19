import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const ThemedLogo = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-[120px] h-[80px]" />;
    }

    const logoSrc = resolvedTheme === 'dark'
        ? "/4th-IR_white_Horizontal.png"
        : "/4th-IR_Horizontal.png";

    return (
        <Image
            src={logoSrc}
            alt="Fourth IR Logo"
            width={120}
            height={80}
            priority={true}
        />
    );
};

export default ThemedLogo;