import {Connect} from "@/components/Connect";
import {Login} from "@/components/Login";
import Me from "@/components/Me";
import Auction from "@/components/Auction";


export default function Page() {

    return (
        <>
            <Connect/>
            <Login/>
            <Me/>
            <Auction/>
        </>
    )
}