const url = "api/game";

export class GameService {
  static getGame(gameid, username) {
    let fullUrl = url + "?gameid=" + gameid + "&username=" + username;
    return new Promise(async function(resolve, reject) {
      try {
        const res = await fetch(fullUrl);
        if (!res.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await res.json();
        resolve(data);
      } catch (err) {
        console.log(err.message);
        reject(err);
      }
    });
  }
}
