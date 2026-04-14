const CourseCard = ({ course, showProgress = true }) => (
  <div className="course-card">
    <div className="course-thumb" style={{
      background: course.completed
        ? 'linear-gradient(135deg, #BF360C, #E64A19)'
        : `linear-gradient(135deg, ${course.color1 || '#1565C0'}, ${course.color2 || '#1E88E5'})`
    }}>
      {course.completed && <span className="completed-tag">✓ Done</span>}
      {course.emoji}
    </div>
    <div className="course-body">
      <div className="course-name">{course.title}</div>
      <div className="course-meta">{course.instructor} · {course.lessons} lessons{course.duration && ` · ${course.duration}`}</div>
      {showProgress && (
        <>
          <div className="pbar">
            <div className="pfill" style={{
              width: `${course.progress}%`,
              backgroundColor: course.completed ? '#E64A19' : (course.color1 || '#1565C0')
            }}></div>
          </div>
          <div className="prow">
            <span>{course.progress === 100 ? 'Completed!' : `${course.progress}% complete`}</span>
            <span>{course.completedLessons}/{course.lessons}</span>
          </div>
        </>
      )}
      <button className={`card-btn ${course.completed ? 'green' : ''}`}>
        {course.completed ? 'View Certificate' : 'Continue Learning'}
      </button>
    </div>
  </div>
);

export default CourseCard;