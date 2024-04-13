import { ReactNode } from "react";

interface PropsTile {
    className?: string;
    children: ReactNode;
}
export const Tile = ({ children, className }: PropsTile) => {
    return <div className={"rounded bg-zinc-900 border " + className}>
        {children}
    </div>
}
