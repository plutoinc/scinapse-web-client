interface ABTest {
  name: string;
  weight: number;
}

export const FULL_PAPER_TEST = "full_paper";

export const LIVE_TESTS: ABTest[] = [
  {
    name: FULL_PAPER_TEST,
    weight: 0.5,
  },
];
