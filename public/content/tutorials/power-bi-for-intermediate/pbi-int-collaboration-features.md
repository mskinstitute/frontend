# Enterprise Collaboration: Subscriptions, Alerts & Microsoft Teams

Business intelligence is most valuable when insights lead directly to collaborative action. Power BI provides an array of enterprise sharing and alerting mechanisms that integrate directly into the daily operational workflow of business teams.

---

## 1. Automated Email Subscriptions

Executive leaders frequently want to receive their morning KPI summary directly in their email inbox before their first meeting without needing to manually log into Power BI:

### Setting Up a Subscription:
1. In the Power BI Service, open the desired report page.
2. Click **Subscribe to report** in the top action bar.
3. In the Subscription pane:
   - Name the subscription (e.g., `Daily Executive KPI Digest`).
   - Add recipients (individuals or Entra ID distribution lists).
   - Set frequency: Daily, Weekly, or **After data refresh** (ensures emails are only sent once new data arrives!).
   - Attach preview image and optional PDF/PowerPoint report export.

---

## 2. Real-Time Data-Driven Alerts

While subscriptions send updates on a scheduled timetable, **Data Alerts** notify managers immediately when a critical threshold is breached:
- *"Alert me when Gross Profit Margin falls below 15%"*
- *"Alert me when Daily Warehouse Returns exceed 500 units"*

```
                     Data-Driven Alert Mechanism
                                  |
     [Streaming / Refreshed Data: Metric = 12% (Threshold < 15%)]
                                  |
               +------------------+------------------+
               |                                     |
      [Power BI Mobile Notification]      [Power Automate Trigger]
      Instant push alert to phone         Automated workflow:
                                          - Posts in MS Teams Channel
                                          - Creates ticket in ServiceNow / Jira
```

> **Configuration Constraint:** Data Alerts can **ONLY** be set on **Dashboards** (not report pages), and only on three specific visual types: **Cards**, **KPI Visuals**, and **Gauges**!

---

## 3. Microsoft Teams & PowerPoint Integration

Power BI integrates natively into the Microsoft 365 ecosystem:
1. **Power BI in Microsoft Teams:**
   - Pin interactive reports as dedicated tabs inside any Teams departmental channel.
   - Start contextual conversation threads around specific visuals.
2. **Interactive Live PowerPoint Embed:**
   - Rather than pasting static screenshot images into presentation slides, insert the **Power BI PowerPoint Add-in**.
   - The slide renders a **live, fully interactive report canvas** where presenters can slice and drill down directly during executive board meetings!

---

# Multiple Choice Questions

### 1. On which Power BI visual types can Data-Driven Alerts be configured?
A. Slicers, Matrices, and Treemaps
B. Cards, KPI Visuals, and Gauges pinned to a Dashboard
C. Custom HTML5 visuals only
D. Python script visuals
**Answer:** B
**Explanation:** Data-driven alerts require a single scalar numerical tracking metric and can only be configured on Cards, KPIs, or Gauge visuals pinned to a Power BI Dashboard.

### 2. When configuring an automated email subscription, why is selecting "After data refresh" considered a best practice?
A. It saves power on the server
B. It guarantees that recipients only receive emails containing freshly updated figures rather than stale data
C. It prevents emails from reaching spam folders
D. It reduces report font sizes
**Answer:** B
**Explanation:** Triggering subscriptions "After data refresh" prevents users from receiving reports based on yesterday's numbers if a scheduled data refresh runs slightly behind schedule.

### 3. How does the Power BI Add-in for Microsoft PowerPoint enhance executive board presentations?
A. It changes slide transitions to 3D animations
B. It embeds a live, fully interactive Power BI report directly inside the slide, allowing real-time filtering and drilldowns during the meeting
C. It deletes the PowerPoint file after presentation
D. It converts PowerPoint into a SQL database
**Answer:** B
**Explanation:** The live PowerPoint add-in replaces static screenshots with an interactive canvas, enabling executives to explore data points live during presentations.

### 4. What Microsoft 365 tool can be triggered automatically by a Power BI Data Alert to send customized alerts or log tickets in external systems?
A. Microsoft Word
B. Power Automate (Flow)
C. Windows Calculator
D. Notepad
**Answer:** B
**Explanation:** Power BI Data Alerts integrate with Power Automate, allowing organizations to trigger automated workflows, send Teams notifications, or open support tickets when thresholds are breached.

### 5. In Microsoft Teams, how can team members collaborate around a specific Power BI report?
A. By taking photos of their computer screens
B. By embedding the report as a dedicated tab inside the Teams channel and using the "Chat in Teams" feature
C. By printing paper copies
D. By installing Linux
**Answer:** B
**Explanation:** Power BI features direct Microsoft Teams integration, allowing reports to be pinned as channel tabs and enabling threaded discussions around specific data insights.

---
