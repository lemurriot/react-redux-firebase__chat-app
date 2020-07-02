export const emojiColonToUnicode = (message, emojiIndex) => {
  return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
    x = x.replace(/:/g, "");
    let emoji = emojiIndex.emojis[x];
    if (typeof emoji !== "undefined") {
      let unicode = emoji.native;
      if (typeof unicode !== "undefined") {
        return unicode;
      }
    }
    x = ":" + x + ":";
    return x;
  })
}