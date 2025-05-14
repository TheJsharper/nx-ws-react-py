import { Key } from "react";

export const uuidv4: () => Key = () => {
    const text = "10000000-1000-4000-8000-100000000000";
    return text.replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    ) as Key;
  }