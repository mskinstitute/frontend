import AssignmentRow from './AssignmentRow';

const AssignmentsSection = () => {
  const assignments = [
    {
      id: 1,
      title: 'React Component Architecture — Project 3',
      course: 'Full Stack Web Dev',
      dueDate: 'Due: Apr 14, 2026',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Python OOP Exercise — Classes & Objects',
      course: 'Python Beginner',
      dueDate: 'Due: Apr 16, 2026',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Wireframe Submission — App Redesign',
      course: 'UI/UX Design',
      dueDate: 'Due: Apr 18, 2026',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Django REST API — Lab Assignment',
      course: 'Full Stack Web Dev',
      dueDate: 'Submitted: Apr 5, 2026',
      status: 'completed'
    },
    {
      id: 5,
      title: 'Cloud Storage Pricing Analysis',
      course: 'Cloud Computing',
      dueDate: 'Submitted: Mar 28, 2026',
      status: 'completed'
    },
    {
      id: 6,
      title: 'Variables & Data Types Quiz',
      course: 'Python Beginner',
      dueDate: 'Submitted: Mar 20, 2026',
      status: 'completed'
    }
  ];

  return (
    <>
      <div className="page-hdr">
        <div className="page-title">Assignments</div>
        <div className="page-sub">{assignments.filter(a => a.status === 'pending').length} pending assignments require your attention.</div>
      </div>

      <div className="assign-list">
        {assignments.map((assignment) => (
          <AssignmentRow key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </>
  );
};

export default AssignmentsSection;