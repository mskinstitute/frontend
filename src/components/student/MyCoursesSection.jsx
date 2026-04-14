import CourseCard from './CourseCard';

const MyCoursesSection = () => {
  const courses = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      instructor: 'Sumit Kumar',
      lessons: 25,
      duration: '6 months',
      progress: 72,
      completedLessons: 18,
      emoji: '⚙️',
      color1: '#1565C0',
      color2: '#1E88E5'
    },
    {
      id: 2,
      title: 'Python for Beginners',
      instructor: 'Rahul Singh',
      lessons: 20,
      duration: '3 months',
      progress: 45,
      completedLessons: 9,
      emoji: '🐍',
      color1: '#00695C',
      color2: '#00ACC1'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Priya Sharma',
      lessons: 20,
      duration: '3 months',
      progress: 30,
      completedLessons: 6,
      emoji: '🎨',
      color1: '#4A148C',
      color2: '#7B1FA2'
    },
    {
      id: 4,
      title: 'Cloud Computing Essentials',
      instructor: 'Amit Verma',
      lessons: 15,
      duration: '2 months',
      progress: 100,
      completedLessons: 15,
      completed: true,
      emoji: '☁️',
      color1: '#BF360C',
      color2: '#E64A19'
    }
  ];

  return (
    <>
      <div className="page-hdr">
        <div className="page-title">My Courses</div>
        <div className="page-sub">Track your learning progress across all enrolled courses.</div>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} showProgress={true} />
        ))}
      </div>
    </>
  );
};

export default MyCoursesSection;