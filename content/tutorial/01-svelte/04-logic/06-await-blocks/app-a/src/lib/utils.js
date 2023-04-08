export async function getRandomNumber() {
    // Fetch a random number between 0 and 100
    // (with a delay, so that we can see it)
    const res = await fetch('/random-number');

    if (res.ok) {
        return await res.text();
    } else {
        // Sometimes the API will fail!
        throw new Error('Request failed');
    }
}