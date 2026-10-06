import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  ClipboardList,
  CalendarDays,
  Target,
  UserRound,
  Bell,
  Search,
  MapPin,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Upload,
  LogOut,
  LockKeyhole,
  Mail,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import "./App.css";

/* =========================================================
   AXIOS AUTHENTICATION
========================================================= */

const TOKEN_KEY = "careerlens_token";

const savedToken = localStorage.getItem(TOKEN_KEY);

if (savedToken) {
  axios.defaults.headers.common.Authorization = `Token ${savedToken}`;
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const [page, setPage] = useState("Dashboard");

  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [matches, setMatches] = useState([]);

  /* -------------------------------------------------------
     CHECK LOGIN
  ------------------------------------------------------- */

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    setAuthenticated(false);
    setCheckingAuth(false);
    return;
  }

  try {
    axios.defaults.headers.common.Authorization =
      `Token ${token}`;

    const response = await axios.get(
      "/api/auth/me/"
    );

    setUser(response.data);
    setAuthenticated(true);

  } catch (error) {
    console.error(
      "Authentication check failed:",
      error.response?.data ||
      error.message
    );

    localStorage.removeItem(TOKEN_KEY);

    delete axios.defaults.headers.common.Authorization;

    setUser(null);
    setAuthenticated(false);

  } finally {
    setCheckingAuth(false);
  }
};

  /* -------------------------------------------------------
     LOGIN SUCCESS
  ------------------------------------------------------- */

  const handleLoginSuccess = (loginData) => {
  console.log("LOGIN RESPONSE:", loginData);

  const token = loginData?.token;
  const loggedInUser = loginData?.user;

  if (!token) {
    console.error("Login response did not contain a token.");
    return;
  }

  // Save token
  localStorage.setItem(TOKEN_KEY, token);

  // Set token for future API requests
  axios.defaults.headers.common.Authorization =
    `Token ${token}`;

  // Set logged-in user
  setUser(
    loggedInUser || {
      username: "User",
    }
  );

  // Mark application as authenticated
  setAuthenticated(true);

  // Open dashboard
  setPage("Dashboard");

  console.log("CareerLens login successful.");
};

  /* -------------------------------------------------------
     LOGOUT
  ------------------------------------------------------- */

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout/");
    } catch (error) {
      console.error("Logout API error:", error);
    }

    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common.Authorization;

    setUser(null);
    setAuthenticated(false);
    setPage("Dashboard");

    setJobs([]);
    setResumes([]);
    setApplications([]);
    setInterviews([]);
    setQuestions([]);
    setMatches([]);
  };

  /* -------------------------------------------------------
     LOAD ALL DATA
  ------------------------------------------------------- */

  const loadData = async () => {
  try {
    const requests = await Promise.allSettled([
      axios.get("/api/jobs/"),
      axios.get("/api/resumes/"),
      axios.get("/api/applications/"),
      axios.get("/api/interviews/"),
      axios.get("/api/interviews/questions/"),
      axios.get("/api/matching/"),
    ]);

    const getData = (result) => {
      if (result.status !== "fulfilled") {
        console.error(
          "API request failed:",
          result.reason?.response?.data ||
          result.reason?.message
        );

        return [];
      }

      const data = result.value.data;

      return Array.isArray(data)
        ? data
        : data?.results || [];
    };

    setJobs(getData(requests[0]));
    setResumes(getData(requests[1]));
    setApplications(getData(requests[2]));
    setInterviews(getData(requests[3]));
    setQuestions(getData(requests[4]));
    setMatches(getData(requests[5]));

  } catch (error) {
    console.error(
      "Unexpected data loading error:",
      error
    );
  }
};

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  /* -------------------------------------------------------
     AUTH CHECKING SCREEN
  ------------------------------------------------------- */

  if (checkingAuth) {
    return (
      <div className="career-auth-loading">
        <div className="career-auth-loading-box">
          <div className="career-auth-logo">C</div>
          <h2>CareerLens</h2>
          <p>Checking your session...</p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     LOGIN / REGISTER
  ------------------------------------------------------- */

  if (!authenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  /* -------------------------------------------------------
     DASHBOARD DATA
  ------------------------------------------------------- */

  const shortlisted = applications.filter(
    (a) => a.status === "Shortlisted"
  ).length;

  const selected = applications.filter(
    (a) => a.status === "Selected"
  ).length;

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Resume", icon: FileText },
    { name: "Find Jobs", icon: BriefcaseBusiness },
    { name: "Applications", icon: ClipboardList },
    { name: "Interviews", icon: CalendarDays },
    { name: "Skill Match", icon: Target },
    { name: "Profile", icon: UserRound },
  ];

  return (
    <div className="app">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">C</div>

          <div className="brand-text">
            <h2>CareerLens</h2>
            <span>Career Intelligence</span>
          </div>
        </div>

        <div className="menu-heading">WORKSPACE</div>

        <nav className="navigation">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-link ${
                  page === item.name ? "selected" : ""
                }`}
                onClick={() => setPage(item.name)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="career-card">
            <Target size={17} />

            <div className="career-title">Profile strength</div>

            <div className="strength">
              <div className="strength-track">
                <div className="strength-value"></div>
              </div>

              <span>75%</span>
            </div>

            <p>
              Complete your profile to improve job matching.
            </p>

            <button
              className="complete-btn"
              onClick={() => setPage("Profile")}
            >
              Complete profile
            </button>

            <button
              className="logout-sidebar-button"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main">
        <header className="topbar">
          <div className="search-container">
            <Search size={18} />

            <input
              placeholder="Search jobs, applications or interviews..."
            />

            <span className="shortcut">⌘ K</span>
          </div>

          <div className="header-right">
            <button className="notification">
              <Bell size={19} />
              <span className="notification-dot"></span>
            </button>

            <div className="divider"></div>

            <div className="profile-mini">
              <div className="avatar">
                {user?.username
                  ? user.username.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div>
                <strong>
                  {user?.username || "User"}
                </strong>

                <span>Candidate</span>
              </div>

              <ChevronRight size={16} />
            </div>

            <button
              className="topbar-logout"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        {page === "Dashboard" && (
          <Dashboard
            user={user}
            jobs={jobs}
            applications={applications}
            interviews={interviews}
            resumes={resumes}
            matches={matches}
            shortlisted={shortlisted}
            selected={selected}
            setPage={setPage}
          />
        )}

        {/* ===================================================
            RESUME
        =================================================== */}

        {page === "My Resume" && (
          <ResumePage
            resumes={resumes}
            reloadData={loadData}
          />
        )}

        {/* ===================================================
            JOBS
        =================================================== */}

        {page === "Find Jobs" && (
          <JobsPage
            jobs={jobs}
            applications={applications}
            reloadData={loadData}
          />
        )}

        {/* ===================================================
            APPLICATIONS
        =================================================== */}

        {page === "Applications" && (
          <ApplicationsPage
            applications={applications}
            jobs={jobs}
            reloadData={loadData}
          />
        )}

        {/* ===================================================
            INTERVIEWS
        =================================================== */}

        {page === "Interviews" && (
          <InterviewsPage
            interviews={interviews}
            questions={questions}
          />
        )}

        {/* ===================================================
            SKILL MATCH
        =================================================== */}

        {page === "Skill Match" && (
          <MatchPage
            matches={matches}
            jobs={jobs}
            resumes={resumes}
          />
        )}

        {/* ===================================================
            PROFILE
        =================================================== */}

        {page === "Profile" && (
          <ProfilePage user={user} />
        )}
      </main>
    </div>
  );
}

/* =========================================================
   AUTH PAGE
========================================================= */

function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    resetMessages();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (mode === "register") {
      if (!email.trim()) {
        setError("Please enter your email.");
        return;
      }

      if (password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      if (mode === "register") {
        const response = await axios.post(
          "/api/auth/register/",
          {
            username: username.trim(),
            email: email.trim(),
            password,
          }
        );

        if (response.data?.token) {
          await onLoginSuccess(response.data);
        } else {
          setMessage(
            "Registration successful. Please login."
          );

          setMode("login");
          setPassword("");
          setConfirmPassword("");
        }
      } else {
        const response = await axios.post(
          "/api/auth/login/",
          {
            username: username.trim(),
            password,
          }
        );

        await onLoginSuccess(response.data);
      }
    } catch (err) {
      console.error("Authentication error:", err);

      const apiError = err.response?.data;

      if (typeof apiError === "string") {
        setError(apiError);
      } else if (apiError?.error) {
        setError(apiError.error);
      } else if (apiError?.detail) {
        setError(apiError.detail);
      } else {
        setError(
          mode === "login"
            ? "Login failed. Please check your username and password."
            : "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-auth-page">
      <div className="career-auth-left">
        <div className="career-auth-brand">
          <div className="career-auth-logo">C</div>

          <div>
            <h1>CareerLens</h1>
            <span>Career Intelligence Platform</span>
          </div>
        </div>

        <div className="career-auth-content">
          <div className="career-auth-label">
            SMART CAREER MANAGEMENT
          </div>

          <h2>
            Manage your career journey
            <br />
            with intelligence.
          </h2>

          <p>
            Upload your resume, discover opportunities,
            track applications and understand your job
            readiness in one place.
          </p>

          <div className="career-auth-features">
            <div>
              <Target size={19} />
              <span>Resume–Job Skill Matching</span>
            </div>

            <div>
              <ClipboardList size={19} />
              <span>Application Tracking</span>
            </div>

            <div>
              <CalendarDays size={19} />
              <span>Interview Preparation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="career-auth-right">
        <div className="career-auth-card">
          <div className="career-auth-mobile-logo">
            <div className="career-auth-logo">C</div>
            <strong>CareerLens</strong>
          </div>

          <div className="career-auth-heading">
            <h2>
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Login to continue to your CareerLens dashboard."
                : "Create your CareerLens account to get started."}
            </p>
          </div>

          {error && (
            <div className="career-auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="career-auth-success">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="career-auth-field">
              <label>Username</label>

              <div className="career-auth-input">
                <UserRound size={17} />

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="career-auth-field">
                <label>Email</label>

                <div className="career-auth-input">
                  <Mail size={17} />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter email"
                    autoComplete="email"
                  />
                </div>
              </div>
            )}

            <div className="career-auth-field">
              <label>Password</label>

              <div className="career-auth-input">
                <LockKeyhole size={17} />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div className="career-auth-field">
                <label>Confirm Password</label>

                <div className="career-auth-input">
                  <LockKeyhole size={17} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="career-auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <div className="career-auth-switch">
            {mode === "login" ? (
              <>
                Don't have an account?
                <button
                  onClick={() => switchMode("register")}
                >
                  <UserPlus size={15} />
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button
                  onClick={() => switchMode("login")}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .career-auth-page {
          min-height: 100vh;
          display: flex;
          background: #f8f9fc;
          color: #101828;
        }

        .career-auth-left {
          width: 52%;
          min-height: 100vh;
          padding: 55px 7%;
          background: #101828;
          color: white;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .career-auth-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .career-auth-brand h1 {
          margin: 0;
          font-size: 25px;
        }

        .career-auth-brand span {
          display: block;
          margin-top: 4px;
          color: #98a2b3;
          font-size: 13px;
        }

        .career-auth-logo {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-size: 28px;
          font-weight: 800;
          box-shadow: 0 12px 30px rgba(99, 102, 241, .25);
        }

        .career-auth-content {
          max-width: 600px;
          margin: auto 0;
        }

        .career-auth-label {
          color: #818cf8;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 18px;
        }

        .career-auth-content h2 {
          font-size: 48px;
          line-height: 1.1;
          margin: 0 0 22px;
          letter-spacing: -1.5px;
        }

        .career-auth-content > p {
          color: #98a2b3;
          font-size: 17px;
          line-height: 1.7;
          max-width: 540px;
          margin-bottom: 35px;
        }

        .career-auth-features {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .career-auth-features div {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #d0d5dd;
          font-size: 14px;
        }

        .career-auth-features svg {
          color: #818cf8;
        }

        .career-auth-right {
          width: 48%;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          box-sizing: border-box;
        }

        .career-auth-card {
          width: 100%;
          max-width: 460px;
          background: white;
          border: 1px solid #eaecf0;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(16, 24, 40, .08);
          box-sizing: border-box;
        }

        .career-auth-mobile-logo {
          display: none;
        }

        .career-auth-heading {
          margin-bottom: 28px;
        }

        .career-auth-heading h2 {
          margin: 0 0 8px;
          font-size: 29px;
        }

        .career-auth-heading p {
          margin: 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.5;
        }

        .career-auth-error,
        .career-auth-success {
          padding: 12px 14px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-size: 13px;
          line-height: 1.4;
        }

        .career-auth-error {
          background: #fef3f2;
          color: #b42318;
          border: 1px solid #fecdca;
        }

        .career-auth-success {
          background: #ecfdf3;
          color: #027a48;
          border: 1px solid #abefc6;
        }

        .career-auth-field {
          margin-bottom: 18px;
        }

        .career-auth-field label {
          display: block;
          margin-bottom: 7px;
          font-size: 13px;
          font-weight: 600;
          color: #344054;
        }

        .career-auth-input {
          height: 48px;
          border: 1px solid #d0d5dd;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 13px;
          transition: .2s;
          box-sizing: border-box;
          background: white;
        }

        .career-auth-input:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, .1);
        }

        .career-auth-input svg {
          color: #98a2b3;
          flex-shrink: 0;
        }

        .career-auth-input input {
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 14px;
          color: #101828;
        }

        .password-toggle {
          border: 0;
          background: transparent;
          color: #98a2b3;
          cursor: pointer;
          display: flex;
          padding: 3px;
        }

        .career-auth-submit {
          width: 100%;
          height: 49px;
          border: 0;
          border-radius: 10px;
          background: #6366f1;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 5px;
          transition: .2s;
        }

        .career-auth-submit:hover {
          background: #5558e8;
        }

        .career-auth-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .career-auth-switch {
          margin-top: 25px;
          padding-top: 22px;
          border-top: 1px solid #eaecf0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #667085;
          font-size: 13px;
        }

        .career-auth-switch button {
          border: 0;
          background: transparent;
          color: #6366f1;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .career-auth-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fc;
        }

        .career-auth-loading-box {
          text-align: center;
        }

        .career-auth-loading-box .career-auth-logo {
          margin: 0 auto 18px;
        }

        .career-auth-loading-box h2 {
          margin: 0 0 6px;
        }

        .career-auth-loading-box p {
          color: #667085;
          font-size: 14px;
        }

        .topbar-logout {
          width: 36px;
          height: 36px;
          border: 1px solid #eaecf0;
          background: white;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667085;
          cursor: pointer;
          margin-left: 8px;
        }

        .topbar-logout:hover {
          color: #d92d20;
          border-color: #fecdca;
          background: #fef3f2;
        }

        .logout-sidebar-button {
          width: 100%;
          margin-top: 12px;
          height: 38px;
          border: 1px solid #344054;
          background: transparent;
          color: #d0d5dd;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .logout-sidebar-button:hover {
          background: #344054;
          color: white;
        }

        @media (max-width: 900px) {
          .career-auth-page {
            display: block;
          }

          .career-auth-left {
            display: none;
          }

          .career-auth-right {
            width: 100%;
            min-height: 100vh;
            padding: 20px;
          }

          .career-auth-card {
            padding: 28px 22px;
          }

          .career-auth-mobile-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 28px;
          }

          .career-auth-mobile-logo .career-auth-logo {
            width: 40px;
            height: 40px;
            border-radius: 11px;
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  user,
  jobs,
  applications,
  interviews,
  resumes,
  matches,
  shortlisted,
  selected,
  setPage,
}) {
  const latestJobs = jobs.slice(0, 3);
  const latestApps = applications.slice(0, 4);

  const bestMatch =
    matches.length > 0
      ? Math.max(
          ...matches.map((m) =>
            Number(m.match_percentage || 0)
          )
        )
      : 0;

  const displayName =
    user?.username || "Candidate";

  return (
    <section className="dashboard">
      <div className="welcome">
        <div>
          <div className="eyebrow">DASHBOARD</div>

          <h1>
            Good morning, {displayName} 👋
          </h1>

          <p>
            Here's an overview of your career journey and
            job search activity.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setPage("Find Jobs")}
        >
          <BriefcaseBusiness size={17} />
          Explore jobs
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<ClipboardList />}
          title="Applications"
          value={applications.length}
        />

        <StatCard
          icon={<CalendarDays />}
          title="Interviews"
          value={interviews.length}
        />

        <StatCard
          icon={<Target />}
          title="Shortlisted"
          value={shortlisted}
        />

        <StatCard
          icon={<CheckCircle2 />}
          title="Selected"
          value={selected}
        />
      </div>

      <div className="dashboard-grid">
        <div className="card activity-card">
          <div className="card-header">
            <div>
              <h3>Career activity</h3>
              <p>
                Current activity in your CareerLens account
              </p>
            </div>

            <div className="activity-period">Live</div>
          </div>

          <div className="activity-overview">
            <ActivityStat
              icon={<ClipboardList size={16} />}
              title="Applications"
              value={applications.length}
              type="purple"
            />

            <ActivityStat
              icon={<BriefcaseBusiness size={16} />}
              title="Jobs available"
              value={jobs.length}
              type="blue"
            />

            <ActivityStat
              icon={<CalendarDays size={16} />}
              title="Interviews"
              value={interviews.length}
              type="green"
            />

            <ActivityStat
              icon={<FileText size={16} />}
              title="Resumes"
              value={resumes.length}
              type="orange"
            />
          </div>

          <div className="activity-message">
            <TrendingUp size={18} />

            <div>
              <strong>
                Your career activity is being tracked
              </strong>

              <p>
                CareerLens automatically updates this
                dashboard when you add resumes, jobs,
                applications and interviews.
              </p>
            </div>
          </div>
        </div>

        <div className="card match-card">
          <div className="card-header">
            <div>
              <h3>Best skill match</h3>
              <p>Your strongest job match</p>
            </div>

            <Target size={19} color="#12b76a" />
          </div>

          <div className="big-score">
            {bestMatch}%
          </div>

          <span className="score-label">
            Resume → Job compatibility
          </span>

          <div className="score-progress">
            <div
              style={{
                width: `${Math.min(bestMatch, 100)}%`,
              }}
            />
          </div>

          <button
            className="secondary-button"
            onClick={() => setPage("Skill Match")}
          >
            View skill analysis
          </button>
        </div>
      </div>

      <div className="lower-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <h3>Available jobs</h3>
              <p>
                Jobs currently stored in CareerLens
              </p>
            </div>

            <button
              className="view-button"
              onClick={() => setPage("Find Jobs")}
            >
              View all
            </button>
          </div>

          {latestJobs.length === 0 ? (
            <Empty text="No jobs available yet." />
          ) : (
            latestJobs.map((job) => (
              <JobItem
                key={job.id}
                job={job}
              />
            ))
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3>Upcoming interviews</h3>
              <p>Interview records</p>
            </div>

            <button
              className="view-button"
              onClick={() => setPage("Interviews")}
            >
              View all
            </button>
          </div>

          {interviews.length === 0 ? (
            <Empty text="No interviews scheduled." />
          ) : (
            interviews.slice(0, 3).map((interview) => (
              <InterviewItem
                key={interview.id}
                interview={interview}
              />
            ))
          )}
        </div>
      </div>

      <div className="card recent-card">
        <div className="card-header">
          <div>
            <h3>Recent applications</h3>
            <p>
              Real application records from your database
            </p>
          </div>

          <button
            className="view-button"
            onClick={() => setPage("Applications")}
          >
            View applications
          </button>
        </div>

        {latestApps.length === 0 ? (
          <Empty text="No applications yet." />
        ) : (
          <div className="application-table">
            <div className="table-head">
              <span>JOB</span>
              <span>STATUS</span>
              <span>APPLIED DATE</span>
            </div>

            {latestApps.map((application) => {
              const job = jobs.find(
                (j) =>
                  Number(j.id) ===
                  Number(application.job)
              );

              return (
                <div
                  className="table-row"
                  key={application.id}
                >
                  <span>
                    {job
                      ? `${job.title} - ${job.company}`
                      : `Job #${application.job}`}
                  </span>

                  <span
                    className={`status ${String(
                      application.status
                    )
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {application.status}
                  </span>

                  <span className="date">
                    {application.applied_date ||
                      "Not specified"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}



/* =========================================================
   RESUME
========================================================= */

function ResumePage({ resumes, reloadData }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const uploadResume = async () => {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    const formData = new FormData();

    // IMPORTANT:
    // Do not manually set Content-Type.
    // Axios/browser will automatically add the multipart boundary.
    formData.append("file", file);

    try {
      setUploading(true);
      setMessage("");
      setError("");

      const response = await axios.post(
        "/api/resumes/",
        formData
      );

      console.log(
        "Resume upload successful:",
        response.data
      );

      setMessage(
        "Resume uploaded successfully!"
      );

      setFile(null);

      // Refresh resumes, skills and matching data
      await reloadData();

    } catch (error) {
      console.error(
        "FULL RESUME UPLOAD ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      const serverError =
        error.response?.data;

      if (serverError) {
        if (serverError.file) {
          setError(
            `File error: ${
              Array.isArray(serverError.file)
                ? serverError.file.join(", ")
                : serverError.file
            }`
          );
        } else if (serverError.detail) {
          setError(
            `Error: ${serverError.detail}`
          );
        } else if (serverError.error) {
          setError(
            `Error: ${serverError.error}`
          );
        } else {
          setError(
            `Upload failed: ${JSON.stringify(
              serverError
            )}`
          );
        }
      } else {
        setError(
          error.message ||
            "Resume upload failed."
        );
      }

    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="dashboard">

      <PageHeading
        label="MY RESUME"
        title="Resume Intelligence"
        text="Upload and manage your resumes in CareerLens."
      />

      <div className="card upload-panel">

        <Upload
          size={32}
          color="#6366f1"
        />

        <h2>Upload your resume</h2>

        <p>
          Upload a PDF, DOCX or text document
          to store it in your CareerLens profile.
        </p>

        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => {
            const selectedFile =
              e.target.files?.[0] || null;

            setFile(selectedFile);
            setMessage("");
            setError("");
          }}
        />

        {file && (
          <p>
            Selected:{" "}
            <strong>{file.name}</strong>
          </p>
        )}

        <button
          className="primary-button"
          onClick={uploadResume}
          disabled={uploading}
        >
          <Upload size={16} />

          {uploading
            ? "Uploading..."
            : "Upload Resume"}
        </button>

        {message && (
          <div className="upload-message">
            {message}
          </div>
        )}

        {error && (
          <div className="career-auth-error">
            {error}
          </div>
        )}

      </div>

      <div className="card">

        <div className="card-header">
          <div>
            <h3>Uploaded Resumes</h3>

            <p>
              Resumes stored in your database
            </p>
          </div>
        </div>

        {resumes.length === 0 ? (

          <Empty
            text="No resumes uploaded yet."
          />

        ) : (

          resumes.map((resume) => (

            <div
              className="data-row"
              key={resume.id}
            >

              <FileText
                size={20}
                color="#6366f1"
              />

              <div>

                <strong>
                  Resume #{resume.id}
                </strong>

                <span>
                  Uploaded:{" "}
                  {resume.uploaded_at
                    ? new Date(
                        resume.uploaded_at
                      ).toLocaleString()
                    : "Available"}
                </span>

              </div>

            </div>

          ))

        )}

      </div>

    </section>
  );
}

/* =========================================================
   JOBS
========================================================= */

function JobsPage({
  jobs,
  applications,
  reloadData,
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [applyingJob, setApplyingJob] =
    useState(null);

  const applyForJob = async (jobId) => {
    const alreadyApplied =
      applications.some(
        (application) =>
          Number(application.job) ===
          Number(jobId)
      );

    if (alreadyApplied) {
      setMessage(
        "You have already applied for this job."
      );
      return;
    }

    try {
      setApplyingJob(jobId);
      setMessage("");
      setError("");

      await axios.post(
        "/api/applications/",
        {
          job: jobId,
          status: "Applied",
          applied_date: new Date()
            .toISOString()
            .split("T")[0],
          notes:
            "Applied through CareerLens",
        }
      );

      setMessage(
        "Application submitted successfully!"
      );

      await reloadData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Application failed. Please try again."
      );
    } finally {
      setApplyingJob(null);
    }
  };

  return (
    <section className="dashboard">
      <PageHeading
        label="FIND JOBS"
        title="Find your next opportunity"
        text="Explore jobs and apply directly through CareerLens."
      />

      {message && (
        <div className="upload-message">
          {message}
        </div>
      )}

      {error && (
        <div className="career-auth-error">
          {error}
        </div>
      )}

      <div className="jobs-grid">
        {jobs.length === 0 ? (
          <Empty text="No jobs available right now." />
        ) : (
          jobs.map((job) => {
            const alreadyApplied =
              applications.some(
                (application) =>
                  Number(application.job) ===
                  Number(job.id)
              );

            return (
              <div
                className="card job-card"
                key={job.id}
              >
                <div className="job-card-top">
                  <div className="company-icon">
                    <BriefcaseBusiness
                      size={22}
                    />
                  </div>

                  <span className="job-type">
                    {job.job_type}
                  </span>
                </div>

                <h3>{job.title}</h3>

                <p className="company-name">
                  {job.company}
                </p>

                <div className="job-meta">
                  <span>
                    <MapPin size={14} />
                    {job.location}
                  </span>

                  <span>
                    <Clock3 size={14} />
                    {job.experience_required ||
                      "Fresher"}
                  </span>
                </div>

                <p className="job-description">
                  {job.description}
                </p>

                <button
                  className="primary-button"
                  disabled={
                    alreadyApplied ||
                    applyingJob === job.id
                  }
                  onClick={() =>
                    applyForJob(job.id)
                  }
                >
                  {alreadyApplied
                    ? "Already Applied"
                    : applyingJob === job.id
                    ? "Applying..."
                    : "Apply Now"}

                  {!alreadyApplied && (
                    <ArrowUpRight
                      size={16}
                    />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

/* =========================================================
   APPLICATIONS
========================================================= */

function ApplicationsPage({
  applications,
  jobs,
  reloadData,
}) {
  const [updating, setUpdating] =
    useState(null);

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      setUpdating(applicationId);

      await axios.patch(
        `/api/applications/${applicationId}/`,
        {
          status,
        }
      );

      await reloadData();
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <section className="dashboard">
      <PageHeading
        label="JOB SEARCH"
        title="Applications"
        text="Track your applications and their current status."
      />

      {applications.length === 0 ? (
        <Empty text="No applications yet." />
      ) : (
        <div className="applications-list">
          {applications.map((application) => {
            const job = jobs.find(
              (item) =>
                Number(item.id) ===
                Number(application.job)
            );

            return (
              <div
                className="card application-card"
                key={application.id}
              >
                <div className="application-icon">
                  <ClipboardList size={22} />
                </div>

                <div className="application-info">
                  <h3>
                    {job
                      ? job.title
                      : `Job #${application.job}`}
                  </h3>

                  <p>
                    {job
                      ? job.company
                      : "Company not available"}
                  </p>

                  {job && (
                    <div className="application-meta">
                      <span>
                        <MapPin size={14} />
                        {job.location}
                      </span>

                      <span>
                        <BriefcaseBusiness
                          size={14}
                        />
                        {job.job_type}
                      </span>
                    </div>
                  )}
                </div>

                <div className="application-status">
                  <span className="status-badge">
                    {application.status}
                  </span>

                  <small>
                    Applied:{" "}
                    {application.applied_date ||
                      "Not specified"}
                  </small>

                  <select
                    value={application.status}
                    disabled={
                      updating === application.id
                    }
                    onChange={(e) =>
                      updateStatus(
                        application.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Saved">
                      Saved
                    </option>

                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Shortlisted">
                      Shortlisted
                    </option>

                    <option value="Assessment">
                      Assessment
                    </option>

                    <option value="Technical Interview">
                      Technical Interview
                    </option>

                    <option value="HR Interview">
                      HR Interview
                    </option>

                    <option value="Selected">
                      Selected
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   INTERVIEWS
========================================================= */

function InterviewsPage({
  interviews,
  questions,
}) {
  return (
    <section className="dashboard">
      <PageHeading
        label="INTERVIEWS"
        title="Interview preparation"
        text="Track your interview rounds and prepare with saved questions."
      />

      {interviews.length === 0 ? (
        <Empty text="No interviews scheduled yet." />
      ) : (
        <div className="interviews-list">
          {interviews.map((interview) => {
            const interviewQuestions =
              questions.filter(
                (question) =>
                  Number(question.interview) ===
                  Number(interview.id)
              );

            return (
              <div
                className="card interview-card"
                key={interview.id}
              >
                <div className="interview-icon">
                  <CalendarDays size={22} />
                </div>

                <div className="interview-info">
                  <h3>
                    {interview.round_name}
                  </h3>

                  <p>
                    Interview ID: #
                    {interview.id}
                  </p>

                  <div className="interview-meta">
                    <span>
                      <CalendarDays size={14} />

                      {interview.scheduled_date
                        ? new Date(
                            interview.scheduled_date
                          ).toLocaleString()
                        : "Date not scheduled"}
                    </span>

                    <span>
                      <CheckCircle2 size={14} />

                      {interview.status}
                    </span>
                  </div>
                </div>

                <div className="interview-status">
                  <span className="status-badge">
                    {interview.status}
                  </span>
                </div>

                <div className="interview-questions">
                  <h4>
                    Interview Questions
                  </h4>

                  {interviewQuestions.length ===
                  0 ? (
                    <p className="no-question">
                      No questions added for this
                      interview yet.
                    </p>
                  ) : (
                    interviewQuestions.map(
                      (question) => (
                        <div
                          className="question-item"
                          key={question.id}
                        >
                          <p>
                            {question.question}
                          </p>

                          <div className="question-details">
                            <span>
                              Topic:{" "}
                              {question.topic}
                            </span>

                            <span>
                              Difficulty:{" "}
                              {question.difficulty}
                            </span>
                          </div>

                          {question.answer && (
                            <div className="question-answer">
                              <strong>
                                Answer:
                              </strong>{" "}
                              {question.answer}
                            </div>
                          )}
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   SKILL MATCH
========================================================= */

function MatchPage({
  matches,
  jobs,
  resumes,
}) {
  return (
    <section className="dashboard">
      <PageHeading
        label="CAREER INTELLIGENCE"
        title="Skill Match"
        text="Analyze how closely your resume matches job requirements."
      />

      {matches.length === 0 ? (
        <div className="card">
          <Empty text="No skill matches calculated yet." />
        </div>
      ) : (
        matches.map((match) => {
          const job = jobs.find(
            (item) =>
              Number(item.id) ===
              Number(match.job)
          );

          const resume = resumes.find(
            (item) =>
              Number(item.id) ===
              Number(match.resume)
          );

          const percentage = Number(
            match.match_percentage || 0
          );

          const matchedCount =
            match.matched_skills
              ? match.matched_skills
                  .split(",")
                  .filter((item) => item.trim())
                  .length
              : 0;

          return (
            <div
              className="card match-result"
              key={match.id}
            >
              <div className="match-number">
                {percentage}%
              </div>

              <div className="match-content">
                <h3>
                  {job
                    ? job.title
                    : `Job #${match.job}`}
                </h3>

                {job && (
                  <p className="company-name">
                    {job.company} ·{" "}
                    {job.location}
                  </p>
                )}

                <p>
                  {resume
                    ? `Resume #${resume.id}`
                    : `Resume #${match.resume}`}
                </p>

                <div className="score-progress">
                  <div
                    style={{
                      width: `${Math.min(
                        percentage,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="match-skills">
                  <div>
                    <strong>
                      Matched skills
                    </strong>

                    <p>
                      {match.matched_skills ||
                        "None"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      Missing skills
                    </strong>

                    <p>
                      {match.missing_skills ||
                        "None"}
                    </p>
                  </div>
                </div>

                <div className="match-summary">
                  <span>
                    <CheckCircle2 size={15} />
                    {matchedCount} skills matched
                  </span>

                  <span>
                    <Target size={15} />
                    {percentage}% compatibility
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfilePage({ user }) {
  return (
    <section className="dashboard">
      <PageHeading
        label="ACCOUNT"
        title="Profile"
        text="Your CareerLens candidate profile."
      />

      <div className="card profile-page">
        <div className="big-avatar">
          {user?.username
            ? user.username
                .charAt(0)
                .toUpperCase()
            : "U"}
        </div>

        <h2>
          {user?.username || "Candidate"}
        </h2>

        <p>
          Python Full Stack Developer
        </p>

        <div className="profile-fields">
          <div>
            <span>Username</span>
            <strong>
              {user?.username || "-"}
            </strong>
          </div>

          <div>
            <span>Email</span>
            <strong>
              {user?.email || "-"}
            </strong>
          </div>

          <div>
            <span>Education</span>
            <strong>
              B.Tech - Computer Science
            </strong>
          </div>

          <div>
            <span>Location</span>
            <strong>
              Hyderabad
            </strong>
          </div>

          <div>
            <span>Primary Skills</span>
            <strong>
              Python · SQL · Django · MySQL
            </strong>
          </div>

          <div>
            <span>Career Focus</span>
            <strong>
              Python Full Stack Development
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-title">
        {title}
      </div>

      <div className="stat-description">
        Live database data
      </div>
    </div>
  );
}

function ActivityStat({
  icon,
  title,
  value,
  type,
}) {
  return (
    <div className="activity-stat">
      <div
        className={`activity-stat-icon ${type}`}
      >
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{title}</span>
      </div>
    </div>
  );
}

function JobItem({ job }) {
  return (
    <div className="job-item">
      <div className="company-avatar">
        {String(job.company)
          .substring(0, 2)
          .toUpperCase()}
      </div>

      <div className="job-details">
        <strong>{job.title}</strong>

        <span>{job.company}</span>

        <small>
          <MapPin size={12} />
          {job.location}
        </small>
      </div>

      <ChevronRight
        size={16}
        color="#98a2b3"
      />
    </div>
  );
}

function InterviewItem({
  interview,
}) {
  return (
    <div className="interview">
      <div className="company-avatar purple">
        <CalendarDays size={15} />
      </div>

      <div className="interview-details">
        <strong>
          {interview.round_name}
        </strong>

        <span>
          Application #
          {interview.application}
        </span>

        <small>
          <Clock3 size={12} />

          {interview.scheduled_date ||
            "Not scheduled"}
        </small>
      </div>
    </div>
  );
}

function PageHeading({
  label,
  title,
  text,
}) {
  return (
    <div className="welcome">
      <div>
        <div className="eyebrow">
          {label}
        </div>

        <h1>{title}</h1>

        <p>{text}</p>
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="empty-state">
      <Target size={24} />
      <p>{text}</p>
    </div>
  );
}

export default App;