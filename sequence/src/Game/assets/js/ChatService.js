const url = "api/messages";

export class ChatService {
  // Get Messages
  static getMessages(gameid) {
    return new Promise(async function(resolve, reject) {
      try {
        const res = await fetch(url + "?gameid=" + gameid);
        if (!res.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await res.json();
        resolve(
          data.map(message => ({
            ...message,
            when: new Date(message.when).toTimeString().split(" ")[0]
          }))
        );
      } catch (err) {
        console.log(err.message);
        reject(err);
      }
    });
  }
}
