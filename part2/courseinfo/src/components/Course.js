const Course = ({ course }) => {
  const parts = course.parts;
  const total = parts.reduce((total, part) => total + part.exercises, 0);

  return (
    <div>
      <h1 key={course.id}>{course.name}</h1>
      {parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
      <p>
        <b>total of {total} exercises</b>
      </p>
    </div>
  );
};

export default Course;
