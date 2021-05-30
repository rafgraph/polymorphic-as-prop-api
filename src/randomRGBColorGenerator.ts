const randomNumber0to255 = () => Math.floor(256 * Math.random());

interface RandomRGBColorGenerator {
  (): [number, number, number];
}

export const randomRGBColorGenerator: RandomRGBColorGenerator = () => {
  const red = randomNumber0to255();
  const green = randomNumber0to255();
  const blue = randomNumber0to255();

  return [red, green, blue];
};
