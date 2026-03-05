# **Sprint 1 Summary (Oct 28 – Nov 4)**

## **Objective**

To design and implement the **frontend interface**, establish the **authentication module**, and set up the **initial backend architecture** along with a **3-stage CI/CD pipeline** for Build, Test, and Coverage.

---

## **Date-wise Progress**

### **October 28**

- Conducted **Sprint Planning** and finalized user story assignments in Jira.
- Created the **Git repository** and set up standard branches: `main`, `develop`, and `feature/*`.
- Defined **branch naming conventions** and initialized the project with a README containing setup instructions.
- Sprint 1 backlog finalized and approved by all members.

---

### **October 29**

- **Frontend:** Implemented core UI components including the **navigation bar** and **dashboard skeleton** using React.
- Integrated **React Router** for multi-page navigation.
- **Authentication:** Developed initial **Login** and **Signup** screens.
- Feature branches created: `feature/frontend-base` and `feature/auth-ui`.

---

### **October 30**

- **Frontend:** Completed the **dashboard layout** and added **theme toggle** functionality.
- **Authentication:** Integrated **Two-Factor Authentication (2FA)** and **Password Reset** interfaces with mock validation.
- Frontend and authentication workflows tested for navigation and UI consistency.

---

### **October 31**

- **Backend:** Initialized the **server structure** using Node/Express and configured the **database connection**.
- Developed the **GET /portfolio** API endpoint with mock data.
- Verified basic API responses and ensured the backend skeleton was stable for future expansion.

---

### **November 1**

- Added the **real-time price monitoring service** integrated with the **CoinGecko API**.
- Connected backend APIs with mock database values for data visualization.
- **QA team** prepared initial test scripts for authentication and portfolio modules (`tests/test_auth_portfolio.js`).

---

### **November 2**

- Configured the **3-stage CI/CD pipeline** using GitHub Actions: **Build → Test → Coverage (≥60%)**.
- Automated CI/CD runs on pull requests for build and test verification.
- Peer reviews conducted on pull requests for code quality and standardization.

---

### **November 3**

- Merged **reviewed feature branches** into `develop`.
- Conducted **integration testing** between frontend and authentication modules.
- Ensured successful build and test completion through CI/CD monitoring.

---

### **November 4**

- Conducted **Sprint 1 Retrospective** to review achievements and identify blockers.
- Documented issues related to **API rate limits** during price fetch operations.
- Updated **Jira status**, closing completed stories and marking the sprint as delivered.

---

## **Deliverables**

- Fully functional **Frontend and Authentication UI**.
- Working **Portfolio API** integrated with mock data.
- **3-Stage CI/CD pipeline** operational (Build, Test, Coverage).
- **Minimum 60% code coverage** achieved.
- All **feature branches merged** after peer review.
- **Sprint 1 Retrospective** documented and Jira board updated.

---

## **Challenges & Learnings**

- Encountered **API rate limits** during real-time price fetch testing.
- Improved understanding of **branching workflow**, **CI/CD automation**, and **peer-review practices**.
- Strengthened coordination across **development**, **testing**, and **DevOps** workflows.

# **Sprint 1 Retrospective (Oct 28 – Nov 4)**

## **1. What Went Well**

- Successfully implemented **frontend interface** and **authentication module** as per the sprint goal.
- **3-stage CI/CD pipeline** (Build → Test → Coverage) was configured and automated using GitHub Actions.
- Maintained consistent **branching and merging discipline** (feature → develop) with proper peer reviews.
- Achieved **60%+ code coverage** and established continuous integration standards early.
- Effective collaboration between **frontend, backend, and QA** teams ensured stable builds throughout.

## **2. What Went Wrong**

- Encountered **API rate limits** from the CoinGecko API during testing of the price fetch module.
- Minor delays in backend setup due to initial **database configuration issues**.
- Test scripts for portfolio APIs required multiple iterations due to inconsistent mock data handling.

## **3. Action Items for Next Sprint**

- Implement **caching mechanisms** or fallback APIs to avoid rate limit issues.
- Expand **test coverage** beyond 70% by including integration tests.
- Improve **backend API documentation** for smoother analytics and report integration.
- Plan for **full backend integration** and **analytics module** in Sprint 2.
