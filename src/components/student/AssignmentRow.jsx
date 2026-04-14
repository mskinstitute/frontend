const AssignmentRow = ({ assignment }) => (
  <div className="assign-row">
    <div className={`assign-icon ${assignment.status === 'completed' ? 'done' : 'pending'}`}>
      {assignment.status === 'completed' ? '✅' : '📝'}
    </div>
    <div className="assign-info">
      <div className="assign-title">{assignment.title}</div>
      <div className="assign-meta">{assignment.course} · {assignment.dueDate}</div>
    </div>
    <span className={`pill ${assignment.status === 'completed' ? 'done' : 'pending'}`}>
      {assignment.status === 'completed' ? 'Completed' : 'Pending'}
    </span>
  </div>
);

export default AssignmentRow;