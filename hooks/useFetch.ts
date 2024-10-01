import { AvailabilityType,ClientEventType } from "@/types/types";
import { useState} from "react";

//cb is the server action
const useFetch = (cb) => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const fn = async (...args: ([AvailabilityType[] | ClientEventType | string])) => {
        setLoading(true);
        setError(null);

        try{
            const response = await cb(...args);
            setData(response)
            setError(null);
        }
        catch(error){
            setError(error)
        }
        finally{
            setLoading(false)
        }
    }

    return {loading, data,error, fn}
}

export default useFetch;