"use client";

import { useAuthStore } from "@/store/Auth";
import { useEffect } from "react";

export default function SessionProvider() {
    const { verfiySession, hydrated } = useAuthStore();

    useEffect(() => {
        if (hydrated) {
            verfiySession();
        }
    }, [hydrated, verfiySession]);

    return null;
}
