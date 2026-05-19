
type PixelIconProps = {
    className?: string;
    icon: string;
    condition: string;
}

export const PixelIcon = ({ className, icon, condition }: PixelIconProps) => {
    return (   
        <img className={className} src={icon} alt={condition} />
    );
}