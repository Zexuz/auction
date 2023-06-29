import React from "react";

export const Centered = ({children}: { children: React.ReactNode }) => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
            {children}
        </div>
    )
}