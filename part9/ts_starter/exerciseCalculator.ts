interface ExerciseInfo {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseInput {
  daily: Array<number>;
  target: number;
}

const parseExerciseArguments = (args: Array<string>): ExerciseInput => {
  if (args.length < 4) throw new Error("Not enough arguments");

  if (!isNaN(Number(args[2]))) {
    const daily = args.slice(3).map((d) => Number(d));
    if (daily.includes(NaN)) {
      throw new Error("Provided values were not numbers!");
    }
    return {
      daily,
      target: Number(args[2]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateExercises = (
  daily: Array<number>,
  target: number
): ExerciseInfo => {
  const periodLength = daily.length;
  const trainingDays = daily.filter((d) => d !== 0).length;
  const totalHours = daily.reduce((total, d) => total + d);
  const average = totalHours / periodLength;
  let rating, ratingDescription;
  if (average < target * 0.7) {
    rating = 1;
    ratingDescription = "Needs much improvement";
  } else if (average < target * 0.9) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  } else if (average >= target * 0.9 && average < target * 1.2) {
    rating = 3;
    ratingDescription = "Target met, good work";
  } else if (average < target * 1.5) {
    rating = 4;
    ratingDescription = "Target exceeded, good work";
  } else {
    rating = 5;
    ratingDescription = "Amazing, keep up the good work";
  }
  return {
    periodLength,
    trainingDays,
    success: totalHours >= target * daily.length,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { daily, target } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(daily, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
