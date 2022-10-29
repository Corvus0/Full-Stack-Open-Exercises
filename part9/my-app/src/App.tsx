interface CourseName {
  courseName: string;
}

interface CourseContent {
  courseParts: CoursePart[];
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseNormalPart extends CoursePartBase {
  type: "normal";
  description: string;
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartBase {
  type: "submission";
  description: string;
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CoursePartBase {
  type: "special";
  description: string;
  requirements: string[];
}

type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseSpecialPart;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is the easy course part",
    type: "normal",
  },
  {
    name: "Advanced",
    exerciseCount: 7,
    description: "This is the hard course part",
    type: "normal",
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    type: "groupProject",
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
    type: "submission",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    type: "special",
  },
];

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Header = ({ courseName }: CourseName) => {
  return <h1>{courseName}</h1>;
};

const Content = ({ courseParts }: CourseContent) => {
  return (
    <div>
      {courseParts.map((p) => {
        let additional = null;
        switch (p.type) {
          case "normal":
            additional = <em>{p.description}</em>;
            break;
          case "groupProject":
            additional = `project exercises ${p.groupProjectCount}`;
            break;
          case "submission":
            additional = (
              <>
                <em>{p.description}</em>
                <br />
                submit to{" "}
                <a href={p.exerciseSubmissionLink}>
                  {p.exerciseSubmissionLink}
                </a>
              </>
            );
            break;
          case "special":
            additional = (
              <>
                <em>{p.description}</em>
                <br />
                required skills: {p.requirements.join(", ")}
              </>
            );
            break;
          default:
            return assertNever(p);
        }
        return (
          <div key={p.name}>
            <p>
              <b>
                {p.name} {p.exerciseCount}
              </b>
              <br />
              {additional}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const Total = ({ courseParts }: CourseContent) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

const App = () => {
  const courseName = "Half Stack application development";

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
