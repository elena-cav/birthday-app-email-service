import isYourBirthday from "../lambdas/isYourBirthday";

const data = [
  {
    input: "2020-01-01",
    expected: true,
  },
  {
    input: "01/01/2020",
    expected: true,
  },
  {
    input: "2020-01-02",
    expected: false,
  },
  {
    input: "2020-01-03",
    expected: false,
  },
  {
    input: "2020-01-04",
    expected: false,
  },
  {
    input: "2020-01-05",
    expected: false,
  },
  {
    input: "05/01/2020",
    expected: false,
  },
];

describe.each(data)(`Is it your birthday?`, (d) => {
  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

  it(`whose date is ${d.input} should be ${d.expected}`, () => {
    expect(isYourBirthday(d.input)).toBe(d.expected);
  });
});
