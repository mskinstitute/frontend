const ProgressSection = () => {
  return (
    <>
      <div className="page-hdr">
        <div className="page-title">Results & Progress</div>
        <div className="page-sub">Your skill development and assessment scores.</div>
      </div>

      <div className="progress-grid">
        <div className="skills-card">
          <div className="sec-title" style={{marginBottom:'16px'}}>Technical Skills</div>
          <div className="skill-row">
            <div className="skill-meta"><span>HTML / CSS</span><span className="skill-pct">92%</span></div>
            <div className="pbar"><div className="pfill" style={{width:'92%',background:'#1565C0'}}></div></div>
          </div>
          <div className="skill-row">
            <div className="skill-meta"><span>JavaScript</span><span className="skill-pct">78%</span></div>
            <div className="pbar"><div className="pfill" style={{width:'78%',background:'#1976D2'}}></div></div>
          </div>
          <div className="skill-row">
            <div className="skill-meta"><span>React.js</span><span className="skill-pct">70%</span></div>
            <div className="pbar"><div className="pfill" style={{width:'70%',background:'#00ACC1'}}></div></div>
          </div>
          <div className="skill-row">
            <div className="skill-meta"><span>Python</span><span className="skill-pct">55%</span></div>
            <div className="pbar"><div className="pfill" style={{width:'55%',background:'#6A1B9A'}}></div></div>
          </div>
          <div className="skill-row">
            <div className="skill-meta"><span>Django</span><span className="skill-pct">60%</span></div>
            <div className="pbar"><div className="pfill" style={{width:'60%',background:'#2E7D32'}}></div></div>
          </div>
          <div className="skill-row">
            <div className="skill-meta"><span>PostgreSQL</span><span className="skill-pct">65%</span></div>
            <div className="pbar"><div className="pfill" style={{width:'65%',background:'#E65100'}}></div></div>
          </div>
        </div>

        <div className="scores-card">
          <div className="sec-title" style={{marginBottom:'16px'}}>Assessment Scores</div>
          <div className="bar-chart-wrap" id="bar-chart">
            <div className="bar-col"><span className="bar-val">88%</span><div className="bar-block" style={{height:'114px',background:'#1565C0'}}></div></div>
            <div className="bar-col"><span className="bar-val">74%</span><div className="bar-block" style={{height:'96px',background:'#6A1B9A'}}></div></div>
            <div className="bar-col"><span className="bar-val">82%</span><div className="bar-block" style={{height:'107px',background:'#00838F'}}></div></div>
            <div className="bar-col"><span className="bar-val">95%</span><div className="bar-block" style={{height:'123px',background:'#2E7D32'}}></div></div>
            <div className="bar-col"><span className="bar-val">79%</span><div className="bar-block" style={{height:'102px',background:'#E65100'}}></div></div>
          </div>
          <div className="bar-label-row" id="bar-labels">
            <div className="bar-label">Web Dev</div>
            <div className="bar-label">Python</div>
            <div className="bar-label">UI/UX</div>
            <div className="bar-label">Cloud</div>
            <div className="bar-label">Quiz 1</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressSection;