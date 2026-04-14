const AttendanceSection = () => {
  return (
    <>
      <div className="page-hdr">
        <div className="page-title">Attendance</div>
        <div className="page-sub">Your monthly attendance record for April 2026.</div>
      </div>

      <div className="attend-grid">
        <div className="circle-card">
          <div className="donut">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="42" fill="none" stroke="#EBF0F7" strokeWidth="12"/>
              <circle cx="55" cy="55" r="42" fill="none" stroke="#1565C0" strokeWidth="12"
                      strokeDasharray="226.2 263.9" strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '55px 55px' }}/>
            </svg>
            <div className="donut-txt">
              <span className="donut-pct">86%</span>
              <span className="donut-lbl">Present</span>
            </div>
          </div>
          <div className="attend-lbl">19 of 22 classes<br/>attended this month</div>
        </div>

        <div className="cal-card">
          <div className="cal-grid">
            <div className="cal-day-hdr">Mon</div><div className="cal-day-hdr">Tue</div><div className="cal-day-hdr">Wed</div><div className="cal-day-hdr">Thu</div><div className="cal-day-hdr">Fri</div><div className="cal-day-hdr">Sat</div><div className="cal-day-hdr">Sun</div>
            <div className="cal-cell H"></div><div className="cal-cell P">1</div><div className="cal-cell P">2</div><div className="cal-cell P">3</div><div className="cal-cell P">4</div><div className="cal-cell H">5</div><div className="cal-cell H">6</div>
            <div className="cal-cell P">7</div><div className="cal-cell A">8</div><div className="cal-cell P">9</div><div className="cal-cell P">10</div><div className="cal-cell P T">11</div><div className="cal-cell H">12</div><div className="cal-cell H">13</div>
            <div className="cal-cell P">14</div><div className="cal-cell P">15</div><div className="cal-cell P">16</div><div className="cal-cell A">17</div><div className="cal-cell P">18</div><div className="cal-cell H">19</div><div className="cal-cell H">20</div>
            <div className="cal-cell P">21</div><div className="cal-cell P">22</div><div className="cal-cell P">23</div><div className="cal-cell P">24</div><div className="cal-cell P">25</div><div className="cal-cell H">26</div><div className="cal-cell H">27</div>
            <div className="cal-cell P">28</div><div className="cal-cell P">29</div><div className="cal-cell P">30</div>
          </div>
          <div className="cal-legend">
            <span style={{display:'flex',alignItems:'center',gap:'5px'}}>
              <span className="legend-dot" style={{background:'#DBEAFE'}}></span>Present
            </span>
            <span style={{display:'flex',alignItems:'center',gap:'5px'}}>
              <span className="legend-dot" style={{background:'#FEE2E2'}}></span>Absent
            </span>
            <span style={{display:'flex',alignItems:'center',gap:'5px'}}>
              <span className="legend-dot" style={{background:'#F1F5F9'}}></span>Holiday
            </span>
            <span style={{display:'flex',alignItems:'center',gap:'5px'}}>
              <span className="legend-dot" style={{background:'transparent',border:'1.5px solid #1565C0'}}></span>Today
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceSection;