import toast from 'react-hot-toast';

const CertificateCard = ({ cert }) => (
  <div className="cert-card">
    <div className="cert-banner" style={{ background: cert.locked ? cert.bannerColor + '80' : cert.bannerColor }}>
      {cert.locked ? '🔒' : '🏅'}
    </div>
    <div className="cert-body">
      <div className="cert-name">{cert.title}</div>
      <div className="cert-date" style={{ color: cert.locked ? '#C62828' : 'inherit' }}>
        {cert.locked ? `In progress — ${cert.progress}% done` : `Issued: ${cert.issueDate} · ${cert.instructor}`}
      </div>
      <button
        className={`cert-btn ${cert.locked ? 'locked' : 'active'}`}
        disabled={cert.locked}
        onClick={() => !cert.locked && toast.success('Downloading certificate...')}
      >
        {cert.locked ? 'Locked' : 'Download Certificate'}
      </button>
    </div>
  </div>
);

export default CertificateCard;