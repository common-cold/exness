import { useEffect, useRef } from "react";

export function usePrev(value: number) {
    const ref = useRef(0);

    useEffect(() => {
        ref.current = value
    }, [value]);

    return ref.current;
}