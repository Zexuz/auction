"use client"

import {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthContext";


export default function Me() {
    const [me, setMe] = useState(null)
    const {isLoggedIn, getJwt} = useAuth();
    const jwt = getJwt();

    useEffect(() => {
        if (!isLoggedIn()) return;

        (async () => {
            const res = await fetch(`http://localhost:3000/api/v1/me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            }).then(res => res.json());


            console.log(res.data);
            setMe(res.data)
        })()
    }, [jwt, isLoggedIn]);

    return (
        <div>
            <h1>Logged in as: {isLoggedIn() ? me : 'Not logged in'}</h1>
        </div>
    )

}