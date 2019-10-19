const url = "http://" + window.location.hostname + ":50135/api/cards";

export class CardService {
  // Get Messages
  static getCards(gameid, player) {
    let fullUrl = url + "?player=" + player + "&gameid=" + gameid;
    return new Promise(async function(resolve, reject) {
      try {
        const res = await fetch(fullUrl);
        if (!res.ok) {
          throw new Error("Network response was not ok.");
        }
        const cards = await res.json();
        resolve(cards);
      } catch (err) {
        console.log(err.message + " with status " + res.status);
        reject(err);
      }
    });
  }
}
