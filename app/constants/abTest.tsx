interface ABTest {
  name: string;
  weight: number;
}

export const LIVE_TESTS: ABTest[] = [];
