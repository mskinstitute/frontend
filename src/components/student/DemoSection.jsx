import toast from 'react-hot-toast';

const DemoSection = () => {
  const DemoBookingRow = ({ booking }) => (
    <tr>
      <td style={{ fontWeight: '500' }}>{booking.title}</td>
      <td>{booking.dateTime}</td>
      <td>
        <span className={`mode-badge ${booking.mode === 'Online' ? 'mode-online' : 'mode-offline'}`}>
          {booking.mode}
        </span>
      </td>
      <td>{booking.trainer}</td>
      <td>
        <span className={`pill ${booking.status.toLowerCase()}`}>
          {booking.status}
        </span>
      </td>
      <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {booking.status === 'Booked' && booking.canJoin && (
          <button className="btn-sm btn-join" onClick={() => toast.success('Opening meeting link...')}>
            Join Now
          </button>
        )}
        {booking.status === 'Booked' && (
          <button className="btn-sm btn-cancel" onClick={() => toast.success('Booking cancelled')}>
            {booking.canJoin ? 'Reschedule' : 'Cancel'}
          </button>
        )}
      </td>
    </tr>
  );

  const demoBookings = [
    {
      id: 1,
      title: 'Full Stack Web Dev Demo',
      dateTime: 'Apr 12, 2026 · 11:00 AM',
      mode: 'Online',
      trainer: 'Sumit Kumar',
      status: 'Booked',
      canJoin: true
    },
    {
      id: 2,
      title: 'Python Intro Demo',
      dateTime: 'Apr 15, 2026 · 3:00 PM',
      mode: 'Offline',
      trainer: 'Rahul Singh',
      status: 'Booked',
      canJoin: false
    },
    {
      id: 3,
      title: 'UI/UX Fundamentals Demo',
      dateTime: 'Apr 5, 2026 · 2:00 PM',
      mode: 'Online',
      trainer: 'Priya Sharma',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Cloud Computing Overview',
      dateTime: 'Mar 28, 2026 · 10:00 AM',
      mode: 'Offline',
      trainer: 'Amit Verma',
      status: 'Cancelled'
    }
  ];

  return (
    <>
      <div className="page-hdr">
        <div className="page-title">Demo Classes</div>
        <div className="page-sub">Book, manage and join your demo sessions.</div>
      </div>

      <div className="alert-strip">
        <span className="alert-ico">🔔</span>
        <span className="alert-text">
          <strong>Upcoming Tomorrow:</strong> "Full Stack Web Dev Demo" at 11:00 AM — Zoom link sent to your registered email
        </span>
      </div>

      <div className="book-form">
        <div style={{fontSize:'14px',fontWeight:'600',color:'#1A1F2E',marginBottom:'16px',fontFamily:'Sora,sans-serif'}}>
          Book a New Demo Class
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-lbl">SELECT COURSE</label>
            <select>
              <option>Full Stack Web Development</option>
              <option>Python for Beginners</option>
              <option>UI/UX Design Fundamentals</option>
              <option>Cloud Computing Essentials</option>
              <option>Data Science Introduction</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-lbl">PREFERRED DATE</label>
            <input type="date" defaultValue="2026-04-14" />
          </div>
          <div className="form-group">
            <label className="form-lbl">MODE</label>
            <select>
              <option>Online (Zoom)</option>
              <option>Offline (Institute Centre)</option>
            </select>
          </div>
          <button className="btn-primary" onClick={() => toast.success('Demo class booked! You will receive a confirmation email shortly.')}>
            Book Now
          </button>
        </div>
      </div>

      <div className="sec-head">
        <span className="sec-title">Booked Classes</span>
      </div>

      <div className="demo-table-wrap">
        <table className="demo-table">
          <thead>
            <tr>
              <th>CLASS TITLE</th>
              <th>DATE & TIME</th>
              <th>MODE</th>
              <th>TRAINER</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {demoBookings.map((booking) => (
              <DemoBookingRow key={booking.id} booking={booking} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DemoSection;