import toast from 'react-hot-toast';

const PaymentSection = () => {
  const StatCard = ({ title, value, subtitle, stripeColor }) => (
    <div className="stat-card" style={{ '--stripe-color': stripeColor }}>
      <div className="stat-stripe" style={{ backgroundColor: stripeColor }}></div>
      <div className="stat-label">{title}</div>
      <div className="stat-val">{value}</div>
      {subtitle && <div className="stat-sub">{subtitle}</div>}
    </div>
  );

  const PaymentRow = ({ payment }) => (
    <div className="pay-row">
      <div className={`pay-icon ${payment.status === 'paid' ? '' : 'pending'}`} style={{
        backgroundColor: payment.status === 'paid' ? '#E8F5E9' : '#FFEBEE'
      }}>
        {payment.status === 'paid' ? '✅' : '⏳'}
      </div>
      <div className="pay-info">
        <div className="pay-desc">{payment.description}</div>
        <div className="pay-date">{payment.date} · {payment.method}</div>
      </div>
      <span className={`pay-amt ${payment.status}`}>
        ₹{payment.amount.toLocaleString()}
      </span>
    </div>
  );

  const payments = {
    summary: {
      totalPaid: 18500,
      outstanding: 4000,
      nextDueDate: 'May 1'
    },
    history: [
      {
        id: 1,
        description: 'Semester 1 — Full Stack Web Dev',
        date: 'Apr 1, 2026',
        method: 'Online',
        amount: 8500,
        status: 'paid'
      },
      {
        id: 2,
        description: 'Python Beginner Course',
        date: 'Mar 10, 2026',
        method: 'Online',
        amount: 3000,
        status: 'paid'
      },
      {
        id: 3,
        description: 'UI/UX Design Fundamentals',
        date: 'Mar 1, 2026',
        method: 'Cash',
        amount: 4000,
        status: 'paid'
      },
      {
        id: 4,
        description: 'Cloud Computing Essentials',
        date: 'Jan 15, 2026',
        method: 'Online',
        amount: 3000,
        status: 'paid'
      },
      {
        id: 5,
        description: 'Semester 2 — Full Stack Web Dev',
        date: 'Due: May 1, 2026',
        method: '',
        amount: 4000,
        status: 'pend'
      }
    ]
  };

  return (
    <>
      <div className="page-hdr">
        <div className="page-title">Payments & Fees</div>
        <div className="page-sub">View your fee status and payment history.</div>
      </div>

      <div className="pay-summary">
        <StatCard
          title="TOTAL PAID"
          value={`₹${payments.summary.totalPaid.toLocaleString()}`}
          subtitle="This academic year"
          stripeColor="#2E7D32"
        />
        <StatCard
          title="OUTSTANDING"
          value={`₹${payments.summary.outstanding.toLocaleString()}`}
          subtitle="Due May 1, 2026"
          stripeColor="#C62828"
        />
        <StatCard
          title="NEXT DUE DATE"
          value={payments.summary.nextDueDate}
          subtitle="Semester 2 installment"
          stripeColor="#E65100"
        />
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'12px'}}>
        <button className="btn-primary" onClick={() => toast.success('Redirecting to payment gateway...')}>
          Pay ₹4,000 Now
        </button>
      </div>

      <div className="pay-list">
        {payments.history.map((payment) => (
          <PaymentRow key={payment.id} payment={payment} />
        ))}
      </div>
    </>
  );
};

export default PaymentSection;