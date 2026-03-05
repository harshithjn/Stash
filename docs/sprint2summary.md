# **Sprint 2 Summary (Nov 4 – Nov 10)**

## **Objective**

To complete **backend integration**, implement **analytics and alert modules**, enhance the **CI/CD pipeline** to five stages, and conduct comprehensive **end-to-end testing** leading to the final deployment and submission.

---

## **Date-wise Progress**

### **November 4**

- Conducted **Sprint 2 Planning** and created new user stories for analytics, alerts, and notifications.
- Updated the **Jira board** with Sprint 2 backlog and assigned stories to team members.
- Defined deliverables and integration milestones for the backend and analytics modules.

---

### **November 5**

- **Frontend & Analytics:**
  - Implemented **currency conversion** functionality within the portfolio dashboard (DAP-F-006).
  - Integrated **dynamic portfolio updates** to reflect real-time values in user dashboards.
  - Developed the **analytics engine** including ROI and asset allocation charts (DAP-F-011).
- Feature branches created: `feature/dashboard-api` and `feature/analytics`.
- Verified data flow between frontend and analytics services.

---

### **November 6**

- **Reports & Notifications:**
  - Implemented **Export Reports** module supporting **CSV** and **PDF** downloads (DAP-F-013).
  - Developed the **Alerts and Notifications** module (DAP-F-014, DAP-F-015) for email and threshold-based notifications.
  - Tested report export formats and ensured accurate data mapping for generated reports.
- Branches: `feature/reports` and `feature/alerts` successfully merged after internal testing.

---

### **November 7**

- **Backend & Security Enhancements:**
  - Integrated **WebSocket support** for live portfolio value updates (DAP-F-010).
  - Conducted **security validation** using **AES-256 encryption** for data protection.
  - Verified **Two-Factor Authentication (2FA)** and session timeout mechanisms through QA tests.
- Created security validation reports and confirmed encryption compliance.

---

### **November 8**

- **CI/CD Pipeline Upgrade:**
  - Extended the CI/CD configuration to include **five stages** — **Build → Test → Coverage → Lint → Security**.
  - Added **linting** and **OWASP ZAP security scan** for automated vulnerability detection.
- **Testing:**
  - Ran automated test suites across all components ensuring stability post-deployment.
  - Recorded improved build reliability and reduced manual testing overhead.

---

### **November 9**

- Conducted **end-to-end testing (E2E)** covering all integrated modules:
  - UI → API → Analytics → Alerts.
  - Verified full workflow and real-time synchronization.
- **Integration Testing:** Confirmed cross-module data flow accuracy.
- Merged stable feature branches into `develop` after code reviews.
- Generated the **Test Summary Report** documenting coverage and test results.

---

### **November 10**

- Conducted **Sprint 2 Retrospective** focusing on performance, efficiency, and quality improvements.
- Updated documentation including **Traceability Matrix**, **Retrospective**, and **README.md** with CI/CD badges.
- Tagged the release as **v1.0-final** and merged the `develop` branch into `main`.
- Prepared the project for **demo and final submission**.

---

## **Deliverables**

- Fully functional **Digital Asset & Cryptocurrency Portfolio Tracker** with complete backend and analytics integration.
- Implemented **alerts and notifications system** with CSV/PDF report exports.
- Enhanced **5-stage CI/CD pipeline** (Build, Test, Coverage, Lint, Security).
- Conducted **unit, integration, and end-to-end testing** with ≥75% code coverage.
- Finalized **documentation**, **traceability matrix**, and **version tagging (v1.0-final)**.
- Project ready for **presentation and deployment**.

---

## **Challenges & Learnings**

- Addressed challenges with **WebSocket synchronization** and **data latency** during real-time updates.
- Enhanced expertise in **CI/CD automation**, **security integration**, and **multi-module testing**.
- Strengthened collaboration during merge and deployment phases, improving team efficiency.
- Gained deeper understanding of **analytics integration** and **alert management workflows** in production systems.

# **Sprint 2 Retrospective (Nov 4 – Nov 10)**

## **1. What Went Well**

- Completed **backend integration** and delivered **real-time analytics and alert systems** successfully.
- Upgraded CI/CD pipeline to **5 stages** — Build, Test, Coverage, Lint, and Security.
- Achieved **>75% code coverage** through robust unit, integration, and E2E testing.
- Implemented **WebSocket-based live updates** and **AES-256 encryption** for data security.
- Effective team coordination during **final release (v1.0-final)** and demo preparation.

## **2. What Went Wrong**

- Initial **WebSocket synchronization** caused delays and data latency issues during testing.
- **OWASP ZAP security scans** revealed a few low-priority vulnerabilities requiring patching.
- Merge conflicts occurred between analytics and alerts branches due to parallel development.

## **3. Action Items for Next Sprint / Future Iteration**

- Optimize **WebSocket performance** and implement retry mechanisms for real-time updates.
- Automate **vulnerability patching workflows** in CI/CD.
- Establish a **dedicated staging environment** for integration testing before production merge.
- Explore **Docker-based deployment** to simplify local and cloud builds.
