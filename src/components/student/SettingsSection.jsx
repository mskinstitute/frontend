import toast from 'react-hot-toast';

const SettingsSection = () => {
  return (
    <>
      <div className="page-hdr">
        <div className="page-title">Settings</div>
        <div className="page-sub">Manage your account, profile and preferences.</div>
      </div>

      <div className="settings-card">
        <div className="settings-title">Profile Information</div>
        <div className="avatar-upload-row">
          <div className="avatar lg">SK</div>
          <div>
            <button className="upload-btn" onClick={() => toast.info('File upload dialog would open here.')}>
              Upload Photo
            </button>
            <div style={{fontSize:'11px',color:'#8C93A5',marginTop:'5px'}}>
              JPG or PNG, max 2MB
            </div>
          </div>
        </div>
        <div className="form-grid" style={{gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          <div className="field-group">
            <div className="field-lbl">FULL NAME</div>
            <input type="text" defaultValue="Sumit Kumar" />
          </div>
          <div className="field-group">
            <div className="field-lbl">EMAIL ADDRESS</div>
            <input type="email" defaultValue="sumit@mskinstitute.com" />
          </div>
          <div className="field-group">
            <div className="field-lbl">PHONE NUMBER</div>
            <input type="text" defaultValue="+91 98765 43210" />
          </div>
          <div className="field-group">
            <div className="field-lbl">CITY</div>
            <input type="text" defaultValue="Bareilly, Uttar Pradesh" />
          </div>
        </div>
        <button className="save-btn" style={{marginTop:'16px'}} onClick={() => toast.success('Profile updated successfully!')}>
          Save Changes
        </button>
      </div>

      <div className="settings-card">
        <div className="settings-title">Change Password</div>
        <div className="field-group">
          <div className="field-lbl">CURRENT PASSWORD</div>
          <input type="password" placeholder="Enter current password" />
        </div>
        <div className="field-group">
          <div className="field-lbl">NEW PASSWORD</div>
          <input type="password" placeholder="Minimum 8 characters" />
        </div>
        <div className="field-group">
          <div className="field-lbl">CONFIRM NEW PASSWORD</div>
          <input type="password" placeholder="Repeat new password" />
        </div>
        <button className="save-btn" onClick={() => toast.success('Password updated successfully!')}>
          Update Password
        </button>
      </div>

      <div className="settings-card">
        <div className="settings-title">Notification Preferences</div>
        <div className="toggle-row">
          <span>Email reminders for demo classes</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="toggle-row">
          <span>SMS alerts for pending assignments</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="toggle-row">
          <span>Fee payment due reminders</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="toggle-row">
          <span>New course announcements</span>
          <input type="checkbox" />
        </div>
        <div className="toggle-row">
          <span>Weekly progress reports</span>
          <input type="checkbox" defaultChecked />
        </div>
        <button className="save-btn" style={{marginTop:'14px'}} onClick={() => toast.success('Notification preferences saved!')}>
          Save Preferences
        </button>
      </div>
    </>
  );
};

export default SettingsSection;