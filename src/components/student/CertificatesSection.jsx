import CertificateCard from './CertificateCard';

const CertificatesSection = () => {
  const certificates = [
    {
      id: 1,
      title: 'Cloud Computing Essentials',
      issueDate: 'March 2026',
      instructor: 'Amit Verma',
      bannerColor: 'linear-gradient(135deg,#1A237E,#1565C0)',
      locked: false
    },
    {
      id: 2,
      title: 'HTML & CSS Masterclass',
      issueDate: 'January 2026',
      instructor: 'Sumit Kumar',
      bannerColor: 'linear-gradient(135deg,#004D40,#00796B)',
      locked: false
    },
    {
      id: 3,
      title: 'Full Stack Web Development',
      progress: 72,
      bannerColor: 'linear-gradient(135deg,#4A148C,#7B1FA2)',
      locked: true
    },
    {
      id: 4,
      title: 'Python for Beginners',
      progress: 45,
      bannerColor: 'linear-gradient(135deg,#BF360C,#E64A19)',
      locked: true
    }
  ];

  return (
    <>
      <div className="page-hdr">
        <div className="page-title">Certificates</div>
        <div className="page-sub">Download your earned certificates.</div>
      </div>

      <div className="cert-grid">
        {certificates.map((cert) => (
          <CertificateCard key={cert.id} cert={cert} />
        ))}
      </div>
    </>
  );
};

export default CertificatesSection;