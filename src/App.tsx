import React, { useState, useRef } from "react";
import crypto from "crypto";
import "./App.css";
import Identicon from "./Identicon";

function hexToByteArray(hexByteString: string) {
  const bytes = new Array(16);

  for (let i = 0; i < hexByteString.length; ) {
    const hexByte = hexByteString[i++] + hexByteString[i++];
    const byte = parseInt(hexByte, 16);

    bytes[i / 2 - 1] = byte;
  }

  return bytes;
}

function md5(data: string) {
  return crypto.createHash("md5").update(data).digest("hex");
}

const compose = (...fns: Function[]) => (x: any) =>
  fns.reduceRight((acc: any, cur: any) => cur(acc), x);

const chunkEvery = (arr: any[], count: number) => {
  return arr.reduce(
    (acc: any, cur: any) => {
      let lastChunk = acc[acc.length - 1];

      if (lastChunk.length === count) {
        acc.push([]);
        lastChunk = acc[acc.length - 1];
      }

      lastChunk.push(cur);

      return acc;
    },
    [[]]
  );
};

const excludeLastChunk = (arr: number[][]) => {
  const newArr = [...arr];
  newArr.splice(-1, 1);

  return newArr;
};

const repeatForthAndFifth = (arr: number[]) => {
  const [first, second] = arr;

  return [...arr, second, first];
};

interface IIdenticon {
  hex: number[];
  color: [R: number, G: number, B: number];
  grid: number[];
  pixel_map: { x: string; y: string };
}

const toObjectPairs = (arr: number[]) => {
  return arr.map((x, i) => [x % 2 === 0, i] as [boolean, number]);
};

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [identicon, setIdenticon] = useState<IIdenticon>();

  const onSubmit = () => {
    const input = inputRef.current!.value;

    const identicon = compose(buildGrid, pickColor, toHex)(input);

    setIdenticon({ ...identicon });
  };

  const buildGrid = (identicon: Partial<IIdenticon>) => {
    let grid2d: number[][];
    let grid: number[];
    let gridWithIndex: [boolean, number][];

    grid2d = chunkEvery(identicon.hex!, 3);
    grid2d = excludeLastChunk(grid2d);
    grid2d = grid2d.map(repeatForthAndFifth);
    grid = grid2d.flat();
    gridWithIndex = toObjectPairs(grid);
    gridWithIndex = gridWithIndex.filter(([x]) => x);
    grid = gridWithIndex.map(([, i]) => i);

    return { ...identicon, grid };
  };

  const pickColor = (identicon: Partial<IIdenticon>) => {
    const [R, G, B] = identicon.hex!;
    const color = [R, G, B];

    return { ...identicon, color };
  };

  const toHex = (input: string) => {
    const identicon: Partial<IIdenticon> = {};

    identicon.hex = hexToByteArray(md5(input));

    return identicon;
  };

  return (
    <div>
      <label>Input</label>
      <input type="text" ref={inputRef} />
      <button onClick={onSubmit}>Generate</button>
      <br />
      <br />
      {identicon && <Identicon grid={identicon.grid!} color={identicon.color!}></Identicon>}
    </div>
  );
}

export default App;
