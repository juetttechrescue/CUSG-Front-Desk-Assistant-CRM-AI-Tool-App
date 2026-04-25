import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bot,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  FolderOpen,
  Home,
  Lock,
  Mail,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  Wrench
} from "lucide-react";
import "./styles.css";

const APPROVED = {
  naju1401: {
    name: "Natalie",
    fullName: "Natalie Juett",
    role: "Staff Assistant",
    email: "naju1401@colorado.edu",
    admin: false
  },
  sabi7853: {
    name: "Sania",
    fullName: "Sania Biswas",
    role: "Staff Assistant",
    email: "sabi7853@colorado.edu",
    admin: false
  },
  lesc6672: {
    name: "Levi",
    fullName: "Levi Schiff",
    role: "Staff Assistant (previous)",
    email: "Levi.Schiff@colorado.edu",
    admin: false
  },
  joke4446: {
    name: "Jade",
    fullName: "Jade Kelly",
    role: "CUSG Advisor",
    email: "Jade.Kelly@colorado.edu",
    admin: true
  }
};

const STAFF = Object.entries(APPROVED).map(([key, person]) => ({ key, ...person }));

const SYSTEM_PROMPT = `You are the CUSG (CU Boulder Student Government) Front Desk AI Assistant for the 105th session. You help front desk staff assistants answer questions quickly and accurately. Be concise, friendly, and specific. If you do not know something exact, say so and direct them to check Teams or ask Megen/Jade.

STAFF SUPPORT
- Natalie Juett | Staff Assistant | naju1401@colorado.edu | identikey: naju1401
- Sania Biswas | Staff Assistant | sabi7853@colorado.edu | identikey: sabi7853
- Levi Schiff | Staff Assistant (previous) | Levi.Schiff@colorado.edu | identikey: lesc6672
- Jade Kelly | CUSG Advisor | Jade.Kelly@colorado.edu | identikey: joke4446
- Megen Princehouse | Office Manager | megen.princehouse@colorado.edu

THREE EMAIL ACCOUNTS
1. custudentgov@gmail.com - Main public-facing email. Most student/public emails. Forward Eldorado bills to sa-bs@colorado.edu and CC Megen.
2. cusg.staffassistant@colorado.edu - Staff assistant email. Use for outgoing correspondence and calendar invites.
3. cusg@colorado.edu - Outlook version. Has out-of-office reply. Check occasionally.
Rule: marked-read email means handled. If opened but not handled, mark it unread.

DAILY
1. Check all 3 email inboxes.
2. Sort and distribute incoming mail.
3. Answer phones.
4. Assist walk-ins.
5. Check Teams.
6. Route questions to Jade or Megen when unsure.`;

const CONTACTS = [
  {
    section: "Front Desk Staff",
    items: [
      { name: "Natalie Juett", role: "Staff Assistant", email: "naju1401@colorado.edu" },
      { name: "Sania Biswas", role: "Staff Assistant", email: "sabi7853@colorado.edu" },
      { name: "Levi Schiff", role: "Staff Assistant (prev.)", email: "Levi.Schiff@colorado.edu" },
      { name: "Jade Kelly", role: "CUSG Advisor", email: "Jade.Kelly@colorado.edu" },
      { name: "Megen Princehouse", role: "Office Manager", email: "megen.princehouse@colorado.edu" }
    ]
  },
  {
    section: "Tri-Executives",
    items: [
      { name: "Karla Castillo", role: "Tri-Executive", email: "president.castillo@colorado.edu" },
      { name: "Rowan Hillhouse", role: "Tri-Executive", email: "president.hillhouse@colorado.edu" },
      { name: "Jake Siemsen", role: "Tri-Executive", email: "president.siemsen@colorado.edu" }
    ]
  },
  {
    section: "Office Inboxes",
    items: [
      { name: "CUSG Gmail", role: "Main public inbox - check daily", email: "custudentgov@gmail.com" },
      { name: "CUSG Staff Assistant", role: "Staff inbox / outgoing", email: "cusg.staffassistant@colorado.edu" },
      { name: "CUSG Outlook", role: "Check occasionally", email: "cusg@colorado.edu" }
    ]
  },
  {
    section: "Key External Contacts",
    items: [
      { name: "UMC Reception", role: "Access lists, inquiries", email: "umc-receptiondesk@colorado.edu" },
      { name: "Events Planning & Catering", role: "Room reservations, catering", email: "cueventsplanning@colorado.edu" },
      { name: "Jill McWilliams", role: "UMC Building Operations - access cards", email: "jill.mcwilliams@colorado.edu" },
      { name: "Bonnie Oriel - ABC Engraving", role: "Name tags and plates", email: "abcoriel@aol.com" },
      { name: "Ink Spot / Imaging Services", role: "Business cards", email: "eprint@colorado.edu" },
      { name: "Property Services", role: "Surplus training", email: "propserv@colorado.edu" }
    ]
  }
];

const LINKS = [
  { label: "Legislative Index", desc: "Bills, resolutions, archive tracking", url: "https://docs.google.com/spreadsheets/" },
  { label: "Expense Google Form", desc: "Submit events, branch, speedtype, reimbursement info", url: "https://docs.google.com/forms/" },
  { label: "EMS Room Booking", desc: "Reserve campus spaces", url: "https://ems.colorado.edu/" },
  { label: "Student Life Invoice", desc: "Invoice and business services", url: "https://www.colorado.edu/studentlife/" },
  { label: "CU Imaging", desc: "Business cards and branded items", url: "https://www.colorado.edu/imagingservices/" },
  { label: "CU Marketplace", desc: "Marketplace orders and carts", url: "https://portal.prod.cu.edu/" },
  { label: "DocuSign", desc: "Download signed files within 30 days", url: "https://www.docusign.com/" },
  { label: "CUSG Website Editor", desc: "Edit CUSG site pages", url: "https://www.colorado.edu/cusg/user" },
  { label: "Microsoft Teams", desc: "Shared CUSG files and staff communication", url: "https://teams.microsoft.com" }
];

const TEAMS = [
  { label: "CUSG General Files", desc: "Main documents, 105th roster, office references", url: "https://teams.microsoft.com" },
  { label: "CUSG Staff Folder", desc: "Identikeys, branch heads, checklists", url: "https://teams.microsoft.com" },
  { label: "Front Desk Onboarding", desc: "How-to guides and training documents", url: "https://teams.microsoft.com" },
  { label: "UMC Access Lists", desc: "Key card and bowling lists", url: "https://teams.microsoft.com" },
  { label: "Legislation Archives", desc: "Past bills and session folders", url: "https://teams.microsoft.com" },
  { label: "Hiring Folder", desc: "Candidate applications and rubrics", url: "https://teams.microsoft.com" }
];

const DEFAULT_TASKS = [
  {
    id: 1,
    text: "Check custudentgov@gmail.com",
    category: "Email",
    assignee: "Natalie",
    due: todayISO(),
    status: "Not Started",
    priority: "Normal"
  },
  {
    id: 2,
    text: "Check cusg.staffassistant@colorado.edu",
    category: "Email",
    assignee: "Sania",
    due: todayISO(),
    status: "Not Started",
    priority: "Normal"
  },
  {
    id: 3,
    text: "Check cusg@colorado.edu",
    category: "Email",
    assignee: "Megan",
    due: todayISO(),
    status: "Not Started",
    priority: "Normal"
  },
  {
    id: 4,
    text: "Sort and distribute incoming mail",
    category: "Mail",
    assignee: "Natalie",
    due: todayISO(),
    status: "Not Started",
    priority: "Normal"
  }
];

const CATS = ["Email", "Mail", "Ordering", "Legislative", "Rooms", "Admin", "Other"];
const ASSIGNEES = ["Natalie", "Sania", "Megan", "Jade"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function greet(name) {
  const h = new Date().getHours();
  return `${h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"}, ${name}.`;
}

function statusSymbol(status) {
  if (status === "Complete") return "✓";
  if (status === "In Progress") return "◐";
  return "○";
}

function localAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes("email") || q.includes("inbox") || q.includes("gmail")) {
    return `Email process:
1. Check custudentgov@gmail.com first because it is the main public-facing inbox.
2. Check cusg.staffassistant@colorado.edu for staff outgoing messages and calendar invites.
3. Check cusg@colorado.edu occasionally.
4. If you open something but cannot handle it, mark it unread.
5. Forward Eldorado bills to sa-bs@colorado.edu and CC Megen.`;
  }

  if (q.includes("room") || q.includes("reservation") || q.includes("reserve")) {
    return `Room reservation process:
1. For UMC 125C or 125F, use Outlook shared calendars and add the CUSG room calendar.
2. For other rooms, use EMS Room Booking.
3. Include event title, date, time, expected attendance, and contact person.
4. If catering is involved, contact Events Planning & Catering.`;
  }

  if (q.includes("expense") || q.includes("invoice") || q.includes("reimburse") || q.includes("marketplace")) {
    return `Expense and Marketplace process:
1. Fill out the expense Google Form with event name, branch, and speedtype.
2. Marketplace orders go through MyCUinfo > CU Marketplace.
3. Use speedtype 12016565 and account 480101 for office supplies unless told otherwise.
4. Assign carts to the current reviewer listed by Megen/Jade.
5. Watch Gmail for UMC package notices.`;
  }

  if (q.includes("name tag") || q.includes("nametag") || q.includes("plate")) {
    return `Name tag and plate process:
1. Email Bonnie Oriel at abcoriel@aol.com.
2. Include name, pronouns, position, and branch.
3. Confirm size and pickup information.
4. Pickup location listed in office notes: ABC Engraving, 1703 Columbine Ave.`;
  }

  if (q.includes("access") || q.includes("key card") || q.includes("keycard")) {
    return `Access card process:
1. Check the UMC Access Lists in the CUSG Staff OneDrive/Teams folder.
2. For an individual access update, email Jill McWilliams with student name and requested rooms.
3. Staff rooms include UMC 125, 125C, and 125F.
4. If unsure, ask Megen or Jade before submitting changes.`;
  }

  if (q.includes("bill") || q.includes("legislative") || q.includes("lc") || q.includes("legislation")) {
    return `Legislative support:
1. Use the Legislative Index to look up bills and resolutions.
2. Bill format usually follows session + LCB/LCR + number.
3. Process: Draft, Introduction, Committee, First Reading, Second Reading, then archive/update.
4. For accessibility or archive questions, check Teams > General > CUSG Archives.`;
  }

  if (q.includes("lost") || q.includes("found")) {
    return `Lost and found:
1. Ask where and when the item was lost.
2. Record name, contact information, item description, and date.
3. Check the front desk area and any current office procedure.
4. Refer to UMC lost and found if it is outside CUSG control.`;
  }

  return `Suggested front desk guidance:
1. Identify whether the question is about email, mail, rooms, expenses, legislation, access cards, or general student support.
2. Check the relevant tool tab in this app.
3. If the answer affects money, access, official records, or an external office, verify with Megen or Jade.
4. If you opened a message but cannot resolve it, mark it unread so it is not treated as handled.`;
}

function LoginPage({ onLogin }) {
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const bump = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const submit = () => {
    const k = key.trim().toLowerCase();
    if (!k) {
      setErr("Please enter your identikey.");
      bump();
      return;
    }

    setLoading(true);
    setErr("");

    setTimeout(() => {
      if (APPROVED[k]) {
        onLogin({ key: k, ...APPROVED[k] });
      } else {
        setLoading(false);
        setErr("Access denied. Your identikey is not on the approved list.");
        bump();
      }
    }, 650);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo-area">
          <div className="logo-mark">CU</div>
          <div className="login-eyebrow">CU Boulder Student Government</div>
          <h1 className="login-title">Front Desk Assistant</h1>
          <div className="login-sub">105th Session · Staff Portal</div>
        </div>

        <label className="form-label">CU Identikey</label>
        <input
          className={`form-input${shake ? " shake" : ""}`}
          placeholder="e.g. naju1401"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoFocus
        />
        <div className="form-hint">Enter your identikey username - not your full email address</div>
        {err && <div className="login-err">{err}</div>}

        <button className="btn-gold" onClick={submit} disabled={loading}>
          {loading ? "Verifying..." : "Sign In to Front Desk"}
        </button>

        <div className="login-foot">Approved front desk staff only · Contact Megen Princehouse for access</div>
      </div>
    </div>
  );
}

function Shell({ user, onLogout }) {
  const [tab, setTab] = useState("home");

  const nav = [
    { id: "home", label: "Home", icon: Home },
    { id: "ai", label: "Ask AI", icon: Bot },
    { id: "tasks", label: "Tasks", icon: CheckCircle2 },
    { id: "teams", label: "Teams & Tools", icon: FolderOpen },
    { id: "contacts", label: "Contacts", icon: Users }
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-logo">CU</div>
          <div>
            <div className="sb-title">CUSG</div>
            <div className="sb-sub">Front Desk Portal</div>
          </div>
        </div>

        <nav className="sb-nav">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${tab === item.id ? "active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sb-user">
          <Avatar person={user} />
          <div>
            <div className="sb-name">{user.name}</div>
            <div className="sb-role">{user.role}</div>
          </div>
        </div>

        <button className="logout" onClick={onLogout}>Sign out</button>
      </aside>

      <main className="main">
        {tab === "home" && <WelcomePage user={user} setTab={setTab} />}
        {tab === "ai" && <AIChatPage user={user} />}
        {tab === "tasks" && <TasksPage user={user} />}
        {tab === "teams" && <TeamsPage />}
        {tab === "contacts" && <ContactsPage />}
      </main>
    </div>
  );
}

function Avatar({ person, size = "normal" }) {
  return (
    <div className={`avatar ${size}`} title={`${person.email || person.fullName} profile`}>
      {initials(person.fullName || person.name)}
    </div>
  );
}

function WelcomePage({ user, setTab }) {
  const cards = [
    { symbol: "AI", title: "Ask AI", desc: "Get instant answers about CUSG procedures.", tab: "ai" },
    { symbol: "✓", title: "Tasks", desc: "Manage daily front desk reminders and assignments.", tab: "tasks" },
    { symbol: "↗", title: "Teams & Tools", desc: "Jump to shared folders and external systems.", tab: "teams" },
    { symbol: "@", title: "Contacts", desc: "Staff, execs, LC, boards, and vendors.", tab: "contacts" }
  ];

  return (
    <div className="page">
      <div className="welcome-banner">
        <div className="banner-logo">CU</div>
        <div className="banner-text">
          <div className="greeting">{greet(user.name)}</div>
          <div className="date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </div>
        </div>
        <div className="secure-pill">
          <ShieldCheck size={15} />
          Approved Staff
        </div>
      </div>

      <div className="home-grid">
        {cards.map((card) => (
          <button key={card.title} className="home-card" onClick={() => setTab(card.tab)}>
            <div className="home-symbol">{card.symbol}</div>
            <div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="section-card">
        <div className="section-title">Daily Front Desk Flow</div>
        <div className="steps">
          {[
            "Check all three inboxes.",
            "Sort mail and update task status.",
            "Use Ask AI for procedure questions.",
            "Route uncertain items to Megen or Jade.",
            "Leave anything unresolved unread or clearly noted."
          ].map((step, i) => (
            <div className="step" key={step}>
              <span className="snum">{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIChatPage({ user }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi ${user.name}. Ask me about CUSG front desk procedures, emails, Marketplace, rooms, access cards, legislation, contacts, or daily tasks.`
    }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: localAnswer(text) }
    ]);
    setInput("");
  };

  return (
    <div className="page chat-page">
      <PageHeader
        title="Ask AI"
        eyebrow="CUSG Procedure Assistant"
        desc="A front desk guide trained on the office workflow notes embedded in this app."
      />

      <div className="chat-shell">
        <div className="chat-log">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="msg-label">{m.role === "assistant" ? "CUSG Assistant" : user.name}</div>
              <div className="msg-text">{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="chat-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something like: How do I reserve a room? What do I do with Marketplace orders?"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button className="btn-gold small" onClick={send}>
            Send
          </button>
        </div>
      </div>

      <div className="tip">
        <div className="tip-title">
          <Lock size={15} />
          Claude/API note
        </div>
        <p>
          This deployable version uses an internal knowledge-base response engine so it works immediately on Netlify.
          To connect a live Claude API safely, add a Netlify serverless function and keep the API key out of browser code.
        </p>
      </div>
    </div>
  );
}

function TasksPage({ user }) {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cusg_original_tasks")) || DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });
  const [txt, setTxt] = useState("");
  const [cat, setCat] = useState("Admin");
  const [assignee, setAssignee] = useState("Natalie");
  const [due, setDue] = useState(todayISO());
  const [priority, setPriority] = useState("Normal");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("cusg_original_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const visible = tasks.filter((task) => {
    const adminView = user.admin;
    const assignedView = task.assignee === user.name || task.assignee === user.fullName;
    const matchesOwner = adminView || assignedView;
    const matchesFilter = filter === "All" || task.status === filter;
    const matchesQuery =
      !query ||
      task.text.toLowerCase().includes(query.toLowerCase()) ||
      task.category.toLowerCase().includes(query.toLowerCase()) ||
      task.assignee.toLowerCase().includes(query.toLowerCase());

    return matchesOwner && matchesFilter && matchesQuery;
  });

  const add = () => {
    if (!txt.trim()) return;

    setTasks((prev) => [
      {
        id: Date.now(),
        text: txt.trim(),
        category: cat,
        assignee,
        due,
        priority,
        status: "Not Started"
      },
      ...prev
    ]);
    setTxt("");
    setCat("Admin");
    setAssignee("Natalie");
    setDue(todayISO());
    setPriority("Normal");
  };

  const updateStatus = (id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const del = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const complete = visible.filter((t) => t.status === "Complete").length;
  const progress = visible.filter((t) => t.status === "In Progress").length;
  const priorityCount = visible.filter((t) => t.priority === "High").length;

  return (
    <div className="page">
      <PageHeader
        title="Tasks"
        eyebrow="Daily Assignments"
        desc={user.admin ? "Jade can create, assign, update, and delete daily tasks." : "View and update your assigned front desk tasks."}
      />

      <div className="stats-row">
        <Stat label="Visible" value={visible.length} />
        <Stat label="Complete" value={complete} />
        <Stat label="In Progress" value={progress} />
        <Stat label="Priority" value={priorityCount} />
      </div>

      {user.admin && (
        <div className="task-add section-card">
          <div className="section-title">Add Daily Task</div>
          <div className="add-grid">
            <input value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Task Jade wants assigned today" />
            <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
              {ASSIGNEES.map((a) => <option key={a}>{a}</option>)}
            </select>
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Normal</option>
              <option>High</option>
            </select>
            <button className="btn-gold" onClick={add}>
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>
      )}

      <div className="task-tools">
        <div className="searchbox">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Complete</option>
        </select>
      </div>

      <div className="task-list">
        {visible.length === 0 ? (
          <div className="empty">No tasks match this view.</div>
        ) : visible.map((task) => (
          <div className="task-row" key={task.id}>
            <button
              className={`check ${task.status === "Complete" ? "done" : ""}`}
              onClick={() => updateStatus(task.id, task.status === "Complete" ? "Not Started" : "Complete")}
              title="Toggle complete"
            >
              {task.status === "Complete" ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>

            <div className="task-main">
              <div className="task-text">{task.text}</div>
              <div className="task-meta">
                <span>{statusSymbol(task.status)} {task.status}</span>
                <span>→ {task.assignee}</span>
                <span>{task.category}</span>
                <span>{task.due}</span>
                {task.priority === "High" && <span className="priority">! Priority</span>}
              </div>
            </div>

            <div className="task-buttons">
              <button onClick={() => updateStatus(task.id, "Not Started")}>○</button>
              <button onClick={() => updateStatus(task.id, "In Progress")}>◐</button>
              <button onClick={() => updateStatus(task.id, "Complete")}>✓</button>
              {user.admin && (
                <button className="delete" onClick={() => del(task.id)}>
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Teams & Tools"
        eyebrow="Quick Access"
        desc="Jump to shared folders, CUSG systems, forms, and daily workflow tools."
      />

      <div className="tool-grid">
        {LINKS.map((link) => (
          <a className="tool-card" href={link.url} target="_blank" rel="noreferrer" key={link.label}>
            <div className="tool-top">
              <Wrench size={17} />
              <span>{link.label}</span>
              <ExternalLink size={14} className="ext" />
            </div>
            <p>{link.desc}</p>
          </a>
        ))}
      </div>

      <div className="section-title extra">Teams Folders</div>
      <div className="tool-grid">
        {TEAMS.map((link) => (
          <a className="tool-card" href={link.url} target="_blank" rel="noreferrer" key={link.label}>
            <div className="tool-top">
              <FolderOpen size={17} />
              <span>{link.label}</span>
              <ExternalLink size={14} className="ext" />
            </div>
            <p>{link.desc}</p>
          </a>
        ))}
      </div>

      <div className="tip">
        <div className="tip-title">
          <Clock3 size={15} />
          Daily check reminder
        </div>
        <div className="tip-steps">
          <div className="tip-step"><span className="snum">1</span><span>Check all 3 inboxes.</span></div>
          <div className="tip-step"><span className="snum">2</span><span>Check Teams for shared folder updates.</span></div>
          <div className="tip-step"><span className="snum">3</span><span>Use the task page to record anything Jade assigns.</span></div>
        </div>
      </div>
    </div>
  );
}

function ContactsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Contacts"
        eyebrow="CUSG Directory"
        desc="Frequently needed front desk contacts, office inboxes, executives, and vendors."
      />

      <div className="contacts-wrap">
        {CONTACTS.map((section) => (
          <div className="contact-section" key={section.section}>
            <div className="csec-title">{section.section}</div>
            {section.items.map((item) => (
              <div className="crow" key={`${item.name}-${item.email}`}>
                <div className="cav">{initials(item.name)}</div>
                <div>
                  <div className="cname">{item.name}</div>
                  <div className="crole">{item.role}</div>
                </div>
                <a className="cemail" href={`mailto:${item.email}`}>
                  {item.email}
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, desc }) {
  return (
    <div className="page-head">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{desc}</p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cusg_original_user")) || null;
    } catch {
      return null;
    }
  });

  const login = (person) => {
    setUser(person);
    localStorage.setItem("cusg_original_user", JSON.stringify(person));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cusg_original_user");
  };

  if (!user) return <LoginPage onLogin={login} />;
  return <Shell user={user} onLogout={logout} />;
}

createRoot(document.getElementById("root")).render(<App />);
