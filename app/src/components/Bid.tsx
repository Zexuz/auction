import {useState} from "react";
import {getAuctionContractConfig} from "@/contracts";
import {useContractWrite, useWaitForTransaction} from "wagmi";
import {useAuctionId} from "@/hooks/useAuctionId";

export function BidParent() {
    const {data: auctionId, isLoading} = useAuctionId();
    if (isLoading) {
        return <p>loading...</p>
    }

    if (!auctionId) {
        return <p>auction is null</p>
    }

    return (
        <Bid auctionId={auctionId}/>
    )
}

function Bid({auctionId}: { auctionId: number }) {
    const {write, data, error, isLoading, isError} = useContractWrite({
        ...getAuctionContractConfig(),
        functionName: 'bid',
    })
    const {
        data: receipt,
        isLoading: isPending,
        isSuccess,
    } = useWaitForTransaction({hash: data?.hash})


    const [bid, setBid] = useState<string>("0")
    const [isValueValid, setIsValueValid] = useState<boolean>(false)

    const onSubmit = () => {
        if (!isValueValid) {
            //TODO: show error
            return;
        }

        write({
            args: [BigInt(auctionId)],
            value: BigInt(bid)
        });
    }

    const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const valueAsNumber = Number(value)
        if (isNaN(valueAsNumber)) {
            setIsValueValid(false)
            return
        }
        setIsValueValid(true)
        setBid(value)
    }


    const isDisabled = isLoading || isPending || isError || !isValueValid
    const text = isLoading ? "Check wallet..." : isPending ? "Pending..." : isError ? "Error" : "Bid"

    return (
        <>
            <input type="text" onChange={onValueChange} style={{color: "red"}}/>
            <button disabled={isDisabled} onClick={onSubmit}>{text}</button>
        </>
    );
}