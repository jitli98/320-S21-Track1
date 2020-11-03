import axios from 'axios';

// Universal fetch request using axios
export default function universalFetch(
    setResponse,
    endpoint,
    onError,
    onSuccess
) {
    console.log('GET started');
    setResponse({
        data: null,
        loading: true,
        error: null,
    });
    axios
        .get(endpoint)
        .then((resp) => {
            console.log('Response received');
            console.log(resp);
            setResponse({
                data: resp.data,
                loading: false,
                error: null,
            });
            onSuccess && onSuccess();
        })
        .catch((err) => {
            console.log(`Fetch failed with error ${err.message}`);
            setResponse({
                data: null,
                loading: false,
                error: err,
            });
            onError && onError();
        });
}
