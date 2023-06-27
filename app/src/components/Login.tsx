'use client'

import {useAuth} from "@/context/AuthContext";
import {useFetch} from "@/hooks/useFetch";
import {useEffect} from "react";
import {useAccount, useSignMessage} from "wagmi";

interface BaseResponse<T> {
  data: T
  success: boolean
}

interface NonceResponse {
  token: string
}

interface SignatureResponse {
  jwt: string
}

export function Login() {
  const {address} = useAccount()
  const {signMessageAsync} = useSignMessage()
  const {setJwt} = useAuth();


  const Login = async () => {
    const signingTokenResponse = await fetch(`http://localhost:3000/api/v1/nonce?publicAddress=${address}`, {method: 'GET'}).then(res => res.json());
    console.log(signingTokenResponse.data.token);
    const signingToken = signingTokenResponse.data.token;

    const signature = await signMessageAsync({message: signingToken});

    const signatureResponse = await fetch(`http://localhost:3000/api/v1/nonce`, {
      method: 'POST',
      body: JSON.stringify({jwtToken: signingToken, signature})
    }).then(res => res.json());

    setJwt(signatureResponse.data.jwt);
  };

  return (
    <div>
      {address}
      <br/>
      <button onClick={Login}>Login</button>
    </div>
  )
}