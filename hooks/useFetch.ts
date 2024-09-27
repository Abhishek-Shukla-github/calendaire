const {useState} = require("react")

const useFetch = (cb) => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)


    const fn = async (...args) => {
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