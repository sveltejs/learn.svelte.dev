export async function getRandomNumber() {
    // Appelle un nombre aléatoire entre 0 et 100
    // (avec un délai, de manière à pouvoir visualiser le chargement)
    const res = await fetch('/random-number');

    if (res.ok) {
        return await res.text();
    } else {
        // L'appel API échouera parfois !
        throw new Error('Request failed');
    }
}