'use client'

import {useAuth} from "@/context/AuthContext";
import {useAccount, useSignMessage} from "wagmi";


export function Login() {
    const {address} = useAccount()
    const {signMessageAsync} = useSignMessage()
    const {setJwt} = useAuth();

    const getSettings = () => {

        const baseUrl = process.env.NEXT_PUBLIC_IDP;
        if (!baseUrl) throw new Error(`Environment variable 'NEXT_PUBLIC_IDP' is not set`);

        return {
            baseUrl,
        }
    }

    const Login = async () => {
        const {baseUrl} = getSettings();
        const signingTokenResponse = await fetch(`${baseUrl}/api/v1/auth?publicAddress=${address}`, {method: 'GET'}).then(res => res.json());
        console.log(signingTokenResponse.token);
        const signingToken = signingTokenResponse.token;

        const signature = await signMessageAsync({message: signingToken});

        const signatureResponse = await fetch(`${baseUrl}/api/v1/auth`, {
            method: 'POST',
            body: JSON.stringify({jwtToken: signingToken, signature})
        }).then(res => res.json());

        setJwt(signatureResponse.jwt);
    };

    return (
        <div>
            {address}
            <br/>
            <button onClick={Login}>Login</button>
        </div>
    )
}